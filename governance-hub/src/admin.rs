use soroban_sdk::{contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
}

pub fn set_admin(env: &Env, super_admin: Address) {
    super_admin.require_auth();

    env.storage()
        .instance()
        .set(&DataKey::SuperAdmin, &super_admin);
}

pub fn remove_admin(env: &Env) -> Address {
    return env
        .storage()
        .instance()
        .get::<_, Address>(&DataKey::SuperAdmin)
        .expect("Super admin not initialized");
}

pub fn is_admin(env: &Env, address: Address) -> bool {
    return get_super_admin(env) == address;
}
