use soroban_sdk::{contracttype, Address, Env, String, Vec};

#[derive(Clone, Debug)]
#[contracttype]
pub struct AssetReferenceData {
    pub id: String,
    pub is_locked: bool,
    pub amount: i128,
    pub recipient: Address,
}

#[derive(Clone)]
#[contracttype]
pub enum AssetReferenceDataKey {
    Assets(String),      // Mapping of asset reference id to AssetReferenceData
    AssetExists(String), // Mapping of asset reference id to boolean
    AssetReferenceList,  // Vector of all asset references
}

pub fn set_asset_reference(env: &Env, id: String, amount: i128, recipient: Address) {
    env.storage().instance().set(
        &AssetReferenceDataKey::Assets(id.clone()),
        &AssetReferenceData {
            id: id.clone(),
            is_locked: false,
            amount,
            recipient,
        },
    );

    env.storage()
        .instance()
        .set(&AssetReferenceDataKey::AssetExists(id.clone()), &true);

    add_to_asset_reference_list(env, id);
}

pub fn get_asset_reference(env: &Env, id: String) -> AssetReferenceData {
    return env
        .storage()
        .instance()
        .get::<_, AssetReferenceData>(&AssetReferenceDataKey::Assets(id))
        .expect("Asset reference not found");
}

fn add_to_asset_reference_list(env: &Env, id: String) {
    let mut asset_references = env
        .storage()
        .instance()
        .get::<_, Vec<String>>(&AssetReferenceDataKey::AssetReferenceList)
        .unwrap_or(Vec::new(env));

    asset_references.push_front(id.clone());

    env.storage().instance().set(
        &AssetReferenceDataKey::AssetReferenceList,
        &asset_references,
    );
}

pub fn set_lock_asset_reference(env: &Env, id: String, is_locked: bool) {
    let mut asset_reference = get_asset_reference(env, id.clone());

    assert_ne!(
        asset_reference.is_locked, is_locked,
        "Asset reference is already in the desired lock state"
    );

    asset_reference.is_locked = is_locked;

    env.storage()
        .instance()
        .set(&AssetReferenceDataKey::Assets(id.clone()), &asset_reference);
}

pub fn remove_asset_reference(env: &Env, id: String) {
    env.storage()
        .instance()
        .remove(&AssetReferenceDataKey::Assets(id.clone()));

    env.storage()
        .instance()
        .remove(&AssetReferenceDataKey::AssetExists(id.clone()));

    remove_from_asset_reference_list(env, id);
}

pub fn remove_from_asset_reference_list(env: &Env, id: String) {
    let mut asset_references = env
        .storage()
        .instance()
        .get::<_, Vec<String>>(&AssetReferenceDataKey::AssetReferenceList)
        .unwrap_or(Vec::new(env));

    let index = asset_references.first_index_of(id);
    assert_ne!(index, None, "Asset reference not found in list");
    asset_references.remove(index.unwrap());

    env.storage().instance().set(
        &AssetReferenceDataKey::AssetReferenceList,
        &asset_references,
    );
}

pub fn get_asset_exists(env: &Env, id: String) -> bool {
    return env
        .storage()
        .instance()
        .get::<_, bool>(&AssetReferenceDataKey::AssetExists(id))
        .unwrap_or(false);
}

pub fn get_all_asset_references(env: &Env) -> Vec<AssetReferenceData> {
    let asset_references = env
        .storage()
        .instance()
        .get::<_, Vec<String>>(&AssetReferenceDataKey::AssetReferenceList)
        .unwrap_or(Vec::new(env));

    let mut asset_references_data_vec = Vec::new(env);
    for asset_reference in asset_references {
        asset_references_data_vec.push_front(get_asset_reference(&env, asset_reference));
    }

    return asset_references_data_vec;
}

pub fn reset_all_asset_refs_list(env: &Env) {
    env.storage()
        .instance()
        .remove(&AssetReferenceDataKey::AssetReferenceList);
}
