#![cfg(test)]
extern crate std;

// use std::println;

use super::*;

use crate::{contract::SimpleBadgeClient, metadata::BadgeMetadata};

use soroban_sdk::{
    testutils::{Address as _, MockAuth, MockAuthInvoke},
    Address, Env, IntoVal, Symbol,
};

//
// TESTUTILS
//

mod governance_hub_contract {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/governance_hub.wasm"
    );
}

fn create_governance_hub_contract<'a>(e: &Env) -> governance_hub_contract::Client<'a> {
    governance_hub_contract::Client::new(
        e,
        &e.register_contract_wasm(None, governance_hub_contract::WASM),
    )
}

fn create_simple_badge_contract<'a>(e: &Env) -> SimpleBadgeClient<'a> {
    SimpleBadgeClient::new(e, &e.register_contract(None, SimpleBadge {}))
}

#[test]
fn is_initialized_by_super_admin() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let badge_client = create_simple_badge_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);

    let badge_metadata = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName"),
        symbol: Symbol::new(&env, "BD1"),
        uri: Symbol::new(&env, "imguri"),
    };

    badge_client.initialize(
        &gh_super_admin,
        &gh_client.address,
        &gh_client.address, // TODO: update with CH later
        badge_metadata,
    );

    assert_eq!(badge_client.governance_hub(), gh_client.address);
    assert_eq!(badge_client.certification_hub(), gh_client.address);
    assert_eq!(badge_client.metadata().name, badge_metadata.name);
    assert_eq!(badge_client.metadata().symbol, badge_metadata.symbol);
    assert_eq!(badge_client.metadata().uri, badge_metadata.uri);
}

#[test]
fn is_initialized_by_admin() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let badge_client = create_simple_badge_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);

    let badge_metadata = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName"),
        symbol: Symbol::new(&env, "BD1"),
        uri: Symbol::new(&env, "imguri"),
    };

    badge_client.initialize(
        &gh_admin,
        &gh_client.address,
        &gh_client.address, // TODO: update with CH later
        badge_metadata,
    );

    assert_eq!(badge_client.governance_hub(), gh_client.address);
    assert_eq!(badge_client.certification_hub(), gh_client.address);
    assert_eq!(badge_client.metadata().name, badge_metadata.name);
    assert_eq!(badge_client.metadata().symbol, badge_metadata.symbol);
    assert_eq!(badge_client.metadata().uri, badge_metadata.uri);
}

#[test]
#[should_panic(expected = "Unauthorized")]
fn is_not_initialized_without_admin_permission() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let badge_client = create_simple_badge_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);

    let badge_metadata = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName"),
        symbol: Symbol::new(&env, "BD1"),
        uri: Symbol::new(&env, "imguri"),
    };

    env.mock_auths(&[MockAuth {
        address: &gh_super_admin,
        invoke: &MockAuthInvoke {
            contract: &badge_client.address,
            fn_name: "initialize",
            args: (
                &gh_admin,
                &gh_client.address,
                &gh_client.address, // TODO: update with CH later
                badge_metadata.clone(),
            )
                .into_val(&env),
            sub_invokes: &[],
        },
    }]);

    badge_client.initialize(
        &gh_admin,
        &gh_client.address,
        &gh_client.address, // TODO: update with CH later
        badge_metadata,
    );
}

#[test]
#[should_panic(expected = "Admin role or higher is required to initialize badge")]
fn is_not_initialized_without_admin_role() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let not_admin = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let badge_client = create_simple_badge_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);

    let badge_metadata = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName"),
        symbol: Symbol::new(&env, "BD1"),
        uri: Symbol::new(&env, "imguri"),
    };

    badge_client.initialize(
        &not_admin,
        &gh_client.address,
        &gh_client.address, // TODO: update with CH later
        badge_metadata,
    );
}

#[test]
fn admin_can_mint_to_user() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let user = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let badge_client = create_simple_badge_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);

    let badge_metadata = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName"),
        symbol: Symbol::new(&env, "BD1"),
        uri: Symbol::new(&env, "imguri"),
    };

    badge_client.initialize(
        &gh_admin,
        &gh_client.address,
        &gh_client.address, // TODO: update with CH later
        badge_metadata,
    );

    let custom_metadata = Symbol::new(&env, "custom_metadata");

    badge_client.mint_badge(&gh_admin, &user, &custom_metadata);

    assert_ne!(badge_client.badge(&user).id, 0);
    assert_eq!(badge_client.badge(&user).metadata, custom_metadata);
}

#[test]
fn admin_can_burn_to_user() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let gh_admin = Address::generate(&env);
    let user = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let badge_client = create_simple_badge_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);
    gh_client.add_admin(&gh_admin);

    let badge_metadata = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName"),
        symbol: Symbol::new(&env, "BD1"),
        uri: Symbol::new(&env, "imguri"),
    };

    badge_client.initialize(
        &gh_admin,
        &gh_client.address,
        &gh_client.address, // TODO: update with CH later
        badge_metadata,
    );

    let custom_metadata = Symbol::new(&env, "custom_metadata");

    badge_client.mint_badge(&gh_admin, &user, &custom_metadata);
    badge_client.burn_badge(&gh_admin, &user, &1);

    assert_eq!(badge_client.badge(&user).id, 0);
    assert_eq!(
        badge_client.badge(&user).metadata,
        Symbol::new(&env, "no_badge")
    );
}

#[test]
fn minting_and_burning_multiple_badges() {
    let env = Env::default();
    let gh_super_admin = Address::generate(&env);
    let user_a = Address::generate(&env);
    let user_b = Address::generate(&env);
    let user_c = Address::generate(&env);
    let gh_client = create_governance_hub_contract(&env);
    let badge_client = create_simple_badge_contract(&env);
    env.mock_all_auths();
    gh_client.initialize(&gh_super_admin);

    let badge_metadata = &BadgeMetadata {
        name: Symbol::new(&env, "BadgeName"),
        symbol: Symbol::new(&env, "BD1"),
        uri: Symbol::new(&env, "imguri"),
    };

    badge_client.initialize(
        &gh_super_admin,
        &gh_client.address,
        &gh_client.address, // TODO: update with CH later
        badge_metadata,
    );

    let custom_metadata_a = Symbol::new(&env, "badge_series_a");
    let custom_metadata_b = Symbol::new(&env, "badge_series_b");

    badge_client.mint_badge(&gh_super_admin, &user_a, &custom_metadata_a);
    badge_client.mint_badge(&gh_super_admin, &user_b, &custom_metadata_b);

    assert_eq!(badge_client.badge(&user_a).id, 1);
    assert_eq!(
        badge_client.badge(&user_a).metadata,
        custom_metadata_a.clone()
    );

    assert_eq!(badge_client.badge(&user_b).id, 2);
    assert_eq!(
        badge_client.badge(&user_b).metadata,
        custom_metadata_b.clone()
    );

    badge_client.mint_badge(&gh_super_admin, &user_c, &custom_metadata_a);

    assert_eq!(badge_client.badge(&user_c).id, 3);
    assert_eq!(
        badge_client.badge(&user_c).metadata,
        custom_metadata_a.clone()
    );

    badge_client.burn_badge(&gh_super_admin, &user_a, &1);

    assert_eq!(badge_client.badge(&user_a).id, 0);
    assert_eq!(
        badge_client.badge(&user_a).metadata,
        Symbol::new(&env, "no_badge")
    );

    badge_client.mint_badge(&gh_super_admin, &user_a, &custom_metadata_b);

    assert_eq!(badge_client.badge(&user_a).id, 4);
    assert_eq!(
        badge_client.badge(&user_a).metadata,
        custom_metadata_b.clone()
    );
}
