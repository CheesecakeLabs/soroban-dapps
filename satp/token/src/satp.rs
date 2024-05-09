use soroban_sdk::{contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum SatpDataKey {
    Bridge,
    AssetReference,
}

pub fn write_bridge_address(e: &Env, address: &Address) {
    e.storage().instance().set(&SatpDataKey::Bridge, address);
}

pub fn read_bridge_address(e: &Env) -> Address {
    e.storage()
        .instance()
        .get::<_, Address>(&SatpDataKey::Bridge)
        .expect("Bridge address not initialized")
}

pub fn write_asset_reference(e: &Env, address: &Address) {
    e.storage()
        .instance()
        .set(&SatpDataKey::AssetReference, address);
}

pub fn read_asset_reference(e: &Env) -> Address {
    e.storage()
        .instance()
        .get::<_, Address>(&SatpDataKey::AssetReference)
        .expect("Asset reference address not initialized")
}
