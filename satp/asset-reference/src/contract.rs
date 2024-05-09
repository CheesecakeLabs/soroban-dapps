use soroban_sdk::{contract, contractimpl, Address, Env, String, Vec};

use crate::{
    admin::{get_admin, set_admin},
    asset::{burn, mint, set_asset},
    asset_reference::{
        get_all_asset_references, get_asset_exists, get_asset_reference, remove_asset_reference,
        remove_from_asset_reference_list, reset_all_asset_refs_list, set_asset_reference,
        set_lock_asset_reference, AssetReferenceData,
    },
};

pub trait AssetReferenceTrait {
    //
    // admin governance
    // =========================================
    fn initialize(env: Env, admin: Address, asset: Address);
    fn create_asset_reference(env: Env, id: String, amount: i128, recipient: Address);
    fn lock_asset_reference(env: Env, id: String);
    fn unlock_asset_reference(env: Env, id: String);
    fn delete_asset_refrence(env: Env, id: String);
    fn mint(env: Env, amount: i128, account: Address);
    fn burn(env: Env, amount: i128);

    //
    // View functions
    //==========================================
    fn is_present(env: Env, id: String) -> bool;
    fn is_asset_locked(env: Env, id: String) -> bool;
    fn get_asset_reference(env: Env, id: String) -> AssetReferenceData;
    fn check_valid_bridge_back(env: Env, id: String, amount: i128, user: Address) -> bool;

    //
    // UI Helpers
    //==========================================
    fn remove_item_from_list(env: Env, id: String);
    fn get_all_asset_references(env: Env) -> Vec<AssetReferenceData>;
    fn reset_all_asset_refs_list(env: Env);
}

#[contract]
pub struct AssetReference;

#[contractimpl]
impl AssetReferenceTrait for AssetReference {
    fn initialize(env: Env, admin: Address, asset: Address) {
        set_admin(&env, admin.clone());
        set_asset(&env, asset)
    }

    fn create_asset_reference(env: Env, id: String, amount: i128, recipient: Address) {
        get_admin(&env).require_auth();
        set_asset_reference(&env, id, amount, recipient)
    }

    fn lock_asset_reference(env: Env, id: String) {
        get_admin(&env).require_auth();
        set_lock_asset_reference(&env, id, true)
    }

    fn unlock_asset_reference(env: Env, id: String) {
        get_admin(&env).require_auth();
        set_lock_asset_reference(&env, id, false)
    }

    fn delete_asset_refrence(env: Env, id: String) {
        get_admin(&env).require_auth();

        let asset_reference = get_asset_reference(&env, id.clone());
        burn(&env, asset_reference.amount);

        remove_asset_reference(&env, id)
    }

    fn is_present(env: Env, id: String) -> bool {
        return get_asset_exists(&env, id);
    }

    fn is_asset_locked(env: Env, id: String) -> bool {
        return get_asset_reference(&env, id).is_locked;
    }

    fn get_asset_reference(env: Env, id: String) -> AssetReferenceData {
        return get_asset_reference(&env, id);
    }

    fn mint(env: Env, amount: i128, account: Address) {
        get_admin(&env).require_auth();
        mint(&env, amount, account)
    }

    fn burn(env: Env, amount: i128) {
        let admin = get_admin(&env);
        admin.require_auth();
        burn(&env, amount)
    }

    fn check_valid_bridge_back(env: Env, id: String, amount: i128, user: Address) -> bool {
        let asset_reference = get_asset_reference(&env, id);

        return asset_reference.amount >= amount && asset_reference.recipient == user;
    }

    fn remove_item_from_list(env: Env, id: String) {
        get_admin(&env).require_auth();
        remove_from_asset_reference_list(&env, id)
    }

    fn get_all_asset_references(env: Env) -> Vec<AssetReferenceData> {
        get_all_asset_references(&env)
    }

    fn reset_all_asset_refs_list(env: Env) {
        get_admin(&env).require_auth();
        reset_all_asset_refs_list(&env)
    }
}
