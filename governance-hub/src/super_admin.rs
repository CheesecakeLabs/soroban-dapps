use soroban_sdk::{contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    SuperAdmin,
}

pub fn set_super_admin(env: &Env, super_admin: Address) {
    super_admin.require_auth();

    env.storage()
        .instance()
        .set(&DataKey::SuperAdmin, &super_admin);
}

pub fn get_super_admin(env: &Env) -> Address {
    return env
        .storage()
        .instance()
        .get::<_, Address>(&DataKey::SuperAdmin)
        .expect("Super admin not initialized");
}

pub fn is_super_admin(env: &Env, address: Address) -> bool {
    return get_super_admin(env) == address;
}

pub fn update_super_admin(env: &Env, new_super_admin: Address) {
    let old_super_admin = get_super_admin(env);

    //expect old and new to be different
    assert!(
        old_super_admin != new_super_admin,
        "Provided account is already the current super admin"
    );

    old_super_admin.require_auth();

    env.storage()
        .instance()
        .set(&DataKey::SuperAdmin, &new_super_admin);
}
