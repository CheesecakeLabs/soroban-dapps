use soroban_sdk::{contracttype, token, Address, Env};

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

    let token_client = token::StellarAssetClient::new(&env, &asset_address);

    token_client.mint(&recipient, &amount);
}

pub fn burn(env: &Env, amount: i128) {
    // let asset_address = get_asset(env);

    // let token_client = token::TokenClient::new(&env, &asset_address);

    // token_client.burn(&amount);
}
