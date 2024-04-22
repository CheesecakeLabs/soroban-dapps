#![cfg(test)]
extern crate std;

// use std::println;

use soroban_sdk::{
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    Address, Env, IntoVal, Symbol, Vec,
};

use crate::{
    badges::BadgeStatus, contract::CertificationHubClient,
    test::simple_badge_contract::BadgeMetadata, CertificationHub,
};

//
// TESTUTILS
//

mod governance_hub_contract {
    soroban_sdk::contractimport!(
        file = "../target/wasm32-unknown-unknown/release/governance_hub.wasm"
    );
}

mod simple_badge_contract {
    soroban_sdk::contractimport!(
        file = "../target/wasm32-unknown-unknown/release/simple_badge.wasm"
    );
}

fn create_governance_hub_contract<'a>(e: &Env) -> governance_hub_contract::Client<'a> {
    governance_hub_contract::Client::new(
        e,
        &e.register_contract_wasm(None, governance_hub_contract::WASM),
    )
}

fn create_simple_badge_contract<'a>(e: &Env) -> simple_badge_contract::Client<'a> {
    simple_badge_contract::Client::new(
        e,
        &e.register_contract_wasm(None, simple_badge_contract::WASM),
    )
}

fn create_certification_hub_contract<'a>(e: &Env) -> CertificationHubClient<'a> {
    CertificationHubClient::new(e, &e.register_contract(None, CertificationHub {}))
}

#[test]
fn is_initialized_by_super_admin() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let ch_client = create_certification_hub_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);

    ch_client.initialize(&gh_super_admin, &gh_client.address);

    assert_eq!(ch_client.governance_hub(), gh_client.address);
}

#[test]
fn is_initialized_by_admin() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let ch_client = create_certification_hub_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);

    ch_client.initialize(&gh_admin, &gh_client.address);

    assert_eq!(ch_client.governance_hub(), gh_client.address);
}

#[test]
#[should_panic(expected = "Unauthorized")]
fn is_not_initialized_without_admin_permission() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let ch_client = create_certification_hub_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);

    env.mock_auths(&[MockAuth {
        address: &gh_super_admin,
        invoke: &MockAuthInvoke {
            contract: &ch_client.address,
            fn_name: "initialize",
            args: (&gh_admin, &gh_client.address).into_val(&env),
            sub_invokes: &[],
        },
    }]);

    ch_client.initialize(&gh_admin, &gh_client.address);
}

#[test]
#[should_panic(expected = "Admin role or higher is required to initialize badge")]
fn is_not_initialized_without_admin_role() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let not_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let ch_client = create_certification_hub_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);

    ch_client.initialize(&not_admin, &gh_client.address);
}

#[test]
fn admin_can_manage_badge_status() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let ch_client = create_certification_hub_contract(&env);
    let badge_client = create_simple_badge_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);
    ch_client.initialize(&gh_admin, &gh_client.address);

    ch_client.set_badge_status(&gh_admin, &badge_client.address, &BadgeStatus::Active);
    assert_eq!(
        ch_client.badge_status(&badge_client.address),
        BadgeStatus::Active
    );

    ch_client.set_badge_status(&gh_admin, &badge_client.address, &BadgeStatus::Paused);
    assert_eq!(
        ch_client.badge_status(&badge_client.address),
        BadgeStatus::Paused
    );

    ch_client.set_badge_status(
        &gh_admin,
        &badge_client.address,
        &crate::badges::BadgeStatus::Archived,
    );
    assert_eq!(
        ch_client.badge_status(&badge_client.address),
        BadgeStatus::Archived
    );

    ch_client.set_badge_status(&gh_admin, &badge_client.address, &BadgeStatus::Active);
    assert_eq!(
        ch_client.badge_status(&badge_client.address),
        BadgeStatus::Active
    );

    ch_client.remove_badge(&gh_admin, &badge_client.address);
    assert_eq!(
        ch_client.badge_status(&badge_client.address),
        BadgeStatus::Invalid
    );
}

#[test]
fn admin_can_manage_multiple_badges() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let ch_client = create_certification_hub_contract(&env);
    let badge_client_a = create_simple_badge_contract(&env);
    let badge_client_b = create_simple_badge_contract(&env);
    let badge_client_c = create_simple_badge_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);
    ch_client.initialize(&gh_admin, &gh_client.address);

    ch_client.set_badge_status(&gh_admin, &badge_client_a.address, &BadgeStatus::Active);
    assert_eq!(
        ch_client.badge_status(&badge_client_a.address),
        BadgeStatus::Active
    );
    assert_eq!(
        ch_client.badge_status(&badge_client_b.address),
        BadgeStatus::Invalid
    );
    assert_eq!(
        ch_client.badge_status(&badge_client_c.address),
        BadgeStatus::Invalid
    );

    ch_client.set_badge_status(&gh_admin, &badge_client_b.address, &BadgeStatus::Active);
    assert_eq!(
        ch_client.badge_status(&badge_client_a.address),
        BadgeStatus::Active
    );
    assert_eq!(
        ch_client.badge_status(&badge_client_b.address),
        BadgeStatus::Active
    );
    assert_eq!(
        ch_client.badge_status(&badge_client_c.address),
        BadgeStatus::Invalid
    );

    ch_client.set_badge_status(&gh_admin, &badge_client_a.address, &BadgeStatus::Archived);
    assert_eq!(
        ch_client.badge_status(&badge_client_a.address),
        BadgeStatus::Archived
    );
    assert_eq!(
        ch_client.badge_status(&badge_client_b.address),
        BadgeStatus::Active
    );
    assert_eq!(
        ch_client.badge_status(&badge_client_c.address),
        BadgeStatus::Invalid
    );

    ch_client.set_badge_status(&gh_admin, &badge_client_c.address, &BadgeStatus::Paused);
    assert_eq!(
        ch_client.badge_status(&badge_client_a.address),
        BadgeStatus::Archived
    );
    assert_eq!(
        ch_client.badge_status(&badge_client_b.address),
        BadgeStatus::Active
    );
    assert_eq!(
        ch_client.badge_status(&badge_client_c.address),
        BadgeStatus::Paused
    );

    ch_client.remove_badge(&gh_admin, &badge_client_a.address);
    assert_eq!(
        ch_client.badge_status(&badge_client_a.address),
        BadgeStatus::Invalid
    );
    assert_eq!(
        ch_client.badge_status(&badge_client_b.address),
        BadgeStatus::Active
    );
    assert_eq!(
        ch_client.badge_status(&badge_client_c.address),
        BadgeStatus::Paused
    );
}

#[test]
fn badge_contract_can_change_user_collection() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let user = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let ch_client = create_certification_hub_contract(&env);
    let badge_client = create_simple_badge_contract(&env);
    let badge_metadata = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName"),
        symbol: Symbol::new(&env, "BD1"),
        uri: Symbol::new(&env, "imguri"),
    };
    let custom_metadata = Symbol::new(&env, "custom_metadata");
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);
    ch_client.initialize(&gh_admin, &gh_client.address);
    badge_client.initialize(
        &gh_admin,
        &gh_client.address,
        &ch_client.address,
        badge_metadata,
    );
    ch_client.set_badge_status(&gh_admin, &badge_client.address, &BadgeStatus::Active);

    badge_client.mint_badge(&gh_admin, &user, &custom_metadata);
    assert_eq!(ch_client.user_collection(&user).len(), 1);
    assert_eq!(
        ch_client.user_collection(&user).first(),
        Some(badge_client.address.clone())
    );

    badge_client.burn_badge(&gh_admin, &user, &1);
    assert_eq!(ch_client.user_collection(&user).len(), 0);
    assert_eq!(ch_client.user_collection(&user), Vec::new(&env));
}

#[test]
fn users_can_have_multiple_badges() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let user_a = Address::generate(&env);
    let user_b = Address::generate(&env);
    let user_c = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let ch_client = create_certification_hub_contract(&env);
    let badge_client_a = create_simple_badge_contract(&env);
    let badge_client_b = create_simple_badge_contract(&env);
    let badge_client_c = create_simple_badge_contract(&env);
    let badge_metadata_a = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName1"),
        symbol: Symbol::new(&env, "BD1"),
        uri: Symbol::new(&env, "imguri"),
    };
    let badge_metadata_b = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName2"),
        symbol: Symbol::new(&env, "BD2"),
        uri: Symbol::new(&env, "imguri"),
    };
    let badge_metadata_c = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeNam3"),
        symbol: Symbol::new(&env, "BD3"),
        uri: Symbol::new(&env, "imguri"),
    };
    let custom_metadata = Symbol::new(&env, "custom_metadata");
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);
    ch_client.initialize(&gh_admin, &gh_client.address);
    badge_client_a.initialize(
        &gh_admin,
        &gh_client.address,
        &ch_client.address,
        badge_metadata_a,
    );
    badge_client_b.initialize(
        &gh_admin,
        &gh_client.address,
        &ch_client.address,
        badge_metadata_b,
    );
    badge_client_c.initialize(
        &gh_admin,
        &gh_client.address,
        &ch_client.address,
        badge_metadata_c,
    );
    ch_client.set_badge_status(&gh_admin, &badge_client_a.address, &BadgeStatus::Active);
    ch_client.set_badge_status(&gh_admin, &badge_client_b.address, &BadgeStatus::Active);
    ch_client.set_badge_status(&gh_admin, &badge_client_c.address, &BadgeStatus::Active);

    badge_client_a.mint_badge(&gh_admin, &user_a, &custom_metadata);
    badge_client_b.mint_badge(&gh_admin, &user_a, &custom_metadata);
    env.budget().reset_default();
    assert!(ch_client
        .user_collection(&user_a)
        .contains(&badge_client_a.address));
    assert!(ch_client
        .user_collection(&user_a)
        .contains(&badge_client_b.address));

    badge_client_a.mint_badge(&gh_admin, &user_b, &custom_metadata);
    badge_client_c.mint_badge(&gh_admin, &user_b, &custom_metadata);
    env.budget().reset_default();
    assert!(ch_client
        .user_collection(&user_b)
        .contains(&badge_client_a.address));
    assert!(ch_client
        .user_collection(&user_b)
        .contains(&badge_client_c.address));

    badge_client_b.mint_badge(&gh_admin, &user_c, &custom_metadata);
    badge_client_c.mint_badge(&gh_admin, &user_c, &custom_metadata);
    env.budget().reset_default();
    assert!(ch_client
        .user_collection(&user_c)
        .contains(&badge_client_b.address));
    assert!(ch_client
        .user_collection(&user_c)
        .contains(&badge_client_c.address));

    badge_client_c.mint_badge(&gh_admin, &user_a, &custom_metadata);
    assert!(ch_client
        .user_collection(&user_a)
        .contains(&badge_client_c.address));

    badge_client_a.burn_badge(&gh_admin, &user_a, &1);
    assert!(!ch_client
        .user_collection(&user_a)
        .contains(&badge_client_a.address));
    assert!(ch_client
        .user_collection(&user_a)
        .contains(&badge_client_b.address));
    assert!(ch_client
        .user_collection(&user_a)
        .contains(&badge_client_c.address));

    badge_client_a.mint_badge(&gh_admin, &user_a, &custom_metadata);
    assert!(ch_client
        .user_collection(&user_a)
        .contains(&badge_client_a.address));

    badge_client_a.burn_badge(&gh_admin, &user_a, &3);
    assert!(!ch_client
        .user_collection(&user_a)
        .contains(&badge_client_a.address));
}

#[test]
#[should_panic(expected = "Badge not active!")]
fn badge_cannot_change_collection_if_not_active() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let user = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let ch_client = create_certification_hub_contract(&env);
    let badge_client = create_simple_badge_contract(&env);
    let badge_metadata = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName1"),
        symbol: Symbol::new(&env, "BD1"),
        uri: Symbol::new(&env, "imguri"),
    };
    let custom_metadata = Symbol::new(&env, "custom_metadata");
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);
    ch_client.initialize(&gh_admin, &gh_client.address);
    badge_client.initialize(
        &gh_admin,
        &gh_client.address,
        &ch_client.address,
        badge_metadata,
    );

    ch_client.set_badge_status(&gh_admin, &badge_client.address, &BadgeStatus::Paused);

    badge_client.mint_badge(&gh_admin, &user, &custom_metadata);
}
