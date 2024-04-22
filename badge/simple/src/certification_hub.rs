use soroban_sdk::{contracttype, Address, Env};

mod certification_hub_contract {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/certification_hub.wasm"
    );
}

#[derive(Clone)]
#[contracttype]
pub enum CertHubDataKey {
    CertificationHub,
}

pub fn write_certification_hub_address(env: &Env, address: Address) {
    env.storage()
        .instance()
        .set(&CertHubDataKey::CertificationHub, &address);
}

pub fn read_certification_hub_address(env: &Env) -> Address {
    return env
        .storage()
        .instance()
        .get::<_, Address>(&CertHubDataKey::CertificationHub)
        .expect("CertificationHub not initialized");
}

pub fn add_to_collection_in_certification_hub(env: &Env, address: Address) {
    let ch_client =
        certification_hub_contract::Client::new(env, &read_certification_hub_address(env));

    let badge_caller = env.current_contract_address();
    ch_client.add_to_collection(&address, &badge_caller);
}

pub fn remove_from_collection_in_certification_hub(env: &Env, address: Address) {
    let ch_client =
        certification_hub_contract::Client::new(env, &read_certification_hub_address(env));

    let badge_caller = env.current_contract_address();
    ch_client.remove_from_collection(&address, &badge_caller);
}
