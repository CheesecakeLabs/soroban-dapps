#![cfg(test)]
extern crate std;

// use std::println;

use super::*;

use crate::{authorization::Roles, contract::GovernanceHubClient};

use soroban_sdk::{
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    Address, Env, IntoVal,
};

//
// TESTUTILS
//
fn create_governance_hub_contract<'a>(e: &Env) -> GovernanceHubClient<'a> {
    GovernanceHubClient::new(e, &e.register_contract(None, GovernanceHub {}))
}

#[test]
fn is_initialized_by_super_admin() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    env.mock_auths(&[MockAuth {
        address: &gh_super_admin,
        invoke: &MockAuthInvoke {
            contract: &gh_client.address,
            fn_name: "initialize",
            args: (&gh_super_admin,).into_val(&env),
            sub_invokes: &[],
        },
    }]);
    gh_client.initialize(&gh_super_admin);

    assert!(gh_client.is_super_admin(&gh_super_admin));
    assert_eq!(gh_client.role(&gh_super_admin), Roles::SuperAdmin);
    assert!(gh_client.super_admin() == gh_super_admin);
}

#[test]
#[should_panic(expected = "Unauthorized")]
fn is_not_initialized_by_non_super_admin() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let non_super_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    env.mock_auths(&[MockAuth {
        address: &non_super_admin,
        invoke: &MockAuthInvoke {
            contract: &gh_client.address,
            fn_name: "initialize",
            args: (&gh_super_admin,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    gh_client.initialize(&gh_super_admin);
}

#[test]
#[should_panic(expected = "Unauthorized")]
fn non_super_admin_cannot_set_new_admin() {
    let env = Env::default();
    env.mock_all_auths();
    let gh_user_a = Address::generate(&env);
    let gh_user_b = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);

    gh_client.initialize(&gh_user_a);

    env.mock_auths(&[MockAuth {
        address: &gh_user_b,
        invoke: &MockAuthInvoke {
            contract: &gh_client.address,
            fn_name: "update_super_admin",
            args: (&gh_user_b,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    gh_client.update_super_admin(&gh_user_b);
}

#[test]
fn super_admin_can_set_new_admin() {
    let env = Env::default();
    env.mock_all_auths();
    let gh_user_a = Address::generate(&env);
    let gh_user_b = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);

    gh_client.initialize(&gh_user_a);

    assert!(gh_client.is_super_admin(&gh_user_a));
    assert_eq!(gh_client.role(&gh_user_a), Roles::SuperAdmin);

    env.mock_auths(&[MockAuth {
        address: &gh_user_a,
        invoke: &MockAuthInvoke {
            contract: &gh_client.address,
            fn_name: "update_super_admin",
            args: (&gh_user_b,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    gh_client.update_super_admin(&gh_user_b);

    assert!(gh_client.is_super_admin(&gh_user_b));
    assert_eq!(gh_client.role(&gh_user_b), Roles::SuperAdmin);
    assert!(!gh_client.is_super_admin(&gh_user_a));
    assert_eq!(gh_client.role(&gh_user_a), Roles::NotAuthorized);
}

#[test]
fn super_admin_can_manage_admins() {
    let env = Env::default();
    env.mock_all_auths();
    let gh_super_admin = Address::generate(&env);
    let gh_user_a = Address::generate(&env);
    let gh_user_b = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);

    gh_client.initialize(&gh_super_admin);

    env.mock_auths(&[MockAuth {
        address: &gh_super_admin,
        invoke: &MockAuthInvoke {
            contract: &gh_client.address,
            fn_name: "add_admin",
            args: (&gh_user_a,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    gh_client.add_admin(&gh_user_a);

    assert_eq!(gh_client.role(&gh_user_a), Roles::Admin);
    assert_eq!(gh_client.role(&gh_user_b), Roles::NotAuthorized);

    env.mock_auths(&[MockAuth {
        address: &gh_super_admin,
        invoke: &MockAuthInvoke {
            contract: &gh_client.address,
            fn_name: "add_admin",
            args: (&gh_user_b,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    gh_client.add_admin(&gh_user_b);

    assert_eq!(gh_client.role(&gh_user_a), Roles::Admin);
    assert_eq!(gh_client.role(&gh_user_b), Roles::Admin);

    env.mock_auths(&[MockAuth {
        address: &gh_super_admin,
        invoke: &MockAuthInvoke {
            contract: &gh_client.address,
            fn_name: "remove_admin",
            args: (&gh_user_a,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    gh_client.remove_admin(&gh_user_a);

    assert_eq!(gh_client.role(&gh_user_a), Roles::NotAuthorized);
    assert_eq!(gh_client.role(&gh_user_b), Roles::Admin);
}

#[test]
#[should_panic(expected = "Unauthorized")]
fn admin_cannot_manage_admins() {
    let env = Env::default();
    env.mock_all_auths();
    let gh_super_admin = Address::generate(&env);
    let gh_user_a = Address::generate(&env);
    let gh_user_b = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    gh_client.initialize(&gh_super_admin);

    gh_client.add_admin(&gh_user_a);

    assert_eq!(gh_client.role(&gh_user_a), Roles::Admin);
    assert_eq!(gh_client.role(&gh_user_b), Roles::NotAuthorized);

    env.mock_auths(&[MockAuth {
        address: &gh_user_a,
        invoke: &MockAuthInvoke {
            contract: &gh_client.address,
            fn_name: "add_admin",
            args: (&gh_user_b,).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    gh_client.add_admin(&gh_user_b);
}

#[test]
fn contract_provide_read_functions() {
    let env = Env::default();
    env.mock_all_auths();
    let gh_super_admin = Address::generate(&env);
    let gh_user_a = Address::generate(&env);
    let gh_user_b = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);

    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_user_a);

    assert!(gh_client.is_super_admin(&gh_super_admin));
    assert_eq!(gh_client.super_admin(), gh_super_admin);
    assert_eq!(gh_client.role(&gh_super_admin), Roles::SuperAdmin);
    assert!(!gh_client.is_super_admin(&gh_user_a));
    assert_eq!(gh_client.role(&gh_user_a), Roles::Admin);
    assert!(!gh_client.is_super_admin(&gh_user_b));
    assert_eq!(gh_client.role(&gh_user_b), Roles::NotAuthorized);
}
