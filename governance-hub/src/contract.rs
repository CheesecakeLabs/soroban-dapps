use soroban_sdk::{contract, contractimpl, Address, Env};

use crate::{
    authorization::{
        get_account_authorization_level, remove_account_authorization_level,
        set_account_authorization_level, Roles,
    },
    super_admin::{get_super_admin, is_super_admin, set_super_admin, update_super_admin},
};

pub trait GovernanceHubTrait {
    //
    // Super admin governance
    // =========================================
    fn initialize(env: Env, super_admin: Address);
    fn update_super_admin(env: Env, new_super_admin: Address);
    fn add_admin(env: Env, admin: Address);
    fn remove_admin(env: Env, admin: Address);

    //
    // View functions
    //==========================================
    fn super_admin(env: Env) -> Address;
    fn is_super_admin(env: Env, address: Address) -> bool;
    fn role(env: Env, address: Address) -> Roles;
}

#[contract]
pub struct GovernanceHub;

#[contractimpl]
impl GovernanceHubTrait for GovernanceHub {
    fn initialize(env: Env, super_admin: Address) {
        set_super_admin(&env, super_admin.clone());
        set_account_authorization_level(&env, super_admin, Roles::SuperAdmin)
    }

    fn update_super_admin(env: Env, new_super_admin: Address) {
        let previous_super_admin = get_super_admin(&env);
        update_super_admin(&env, new_super_admin.clone()); // validates permission

        set_account_authorization_level(&env, previous_super_admin, Roles::NotAuthorized);
        set_account_authorization_level(&env, new_super_admin, Roles::SuperAdmin);
    }

    fn add_admin(env: Env, admin: Address) {
        let super_admin = get_super_admin(&env);
        super_admin.require_auth();

        let authorization_level = Roles::Admin;

        set_account_authorization_level(&env, admin, authorization_level)
    }

    fn remove_admin(env: Env, admin: Address) {
        let super_admin = get_super_admin(&env);
        super_admin.require_auth();

        remove_account_authorization_level(&env, admin)
    }

    fn role(env: Env, address: Address) -> Roles {
        let role = get_account_authorization_level(&env, address);
        return role as Roles;
    }

    fn is_super_admin(env: Env, address: Address) -> bool {
        return is_super_admin(&env, address);
    }

    fn super_admin(env: Env) -> Address {
        return get_super_admin(&env);
    }
}
