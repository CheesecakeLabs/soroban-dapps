use soroban_sdk::{contracttype, Address, Env};

mod satp_token_contract {
    soroban_sdk::contractimport!(
        file = "../../target/wasm32-unknown-unknown/release/satp_token.wasm"
    );
}

#[derive(Clone)]
#[contracttype]
pub enum AssetDataKey {
    Asset,
}

pub fn set_asset(env: &Env, asset: Address) {
    env.storage().instance().set(&AssetDataKey::Asset, &asset);
}

pub fn get_asset(env: &Env) -> Address {
    return env
        .storage()
        .instance()
        .get::<_, Address>(&AssetDataKey::Asset)
        .expect("Asset not initialized");
}

pub fn mint(env: &Env, amount: i128, recipient: Address) {
    let asset_address = get_asset(env);

    let token_client = satp_token_contract::Client::new(&env, &asset_address);
    token_client.mint(&recipient, &amount);
}

pub fn burn(env: &Env, amount: i128) {
    let asset_address = get_asset(env);

    let token_client = satp_token_contract::Client::new(&env, &asset_address);

    token_client.burn_from_bridge(&amount);
}
