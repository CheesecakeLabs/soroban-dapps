use soroban_sdk::{contracttype, Address, Env};

use self::governance_hub_contract::Roles;

mod governance_hub_contract {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/governance_hub.wasm"
    );
}

#[derive(Clone)]
#[contracttype]
pub enum AuthDataKey {
    GovernanceHub,
}

pub fn write_governance_hub_address(env: &Env, address: Address) {
    env.storage()
        .instance()
        .set(&AuthDataKey::GovernanceHub, &address);
}

pub fn read_governance_hub_address(env: &Env) -> Address {
    return env
        .storage()
        .instance()
        .get::<_, Address>(&AuthDataKey::GovernanceHub)
        .expect("GovernanceHub not initialized");
}

pub fn require_admin(e: &Env, account: Address, gh_address: Address) {
    let gh_client = governance_hub_contract::Client::new(e, &gh_address);

    let role = gh_client.role(&account);

    assert!(
        role == Roles::SuperAdmin || role == Roles::Admin,
        "Admin role or higher is required to initialize badge"
    );
}
