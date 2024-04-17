use soroban_sdk::{contracttype, Address, Env};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[contracttype]
pub enum Roles {
    NotAuthorized = 0,
    SuperAdmin = 1,
    Admin = 2,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    AuthorizationLevel(Address),
}

pub fn set_account_authorization_level(env: &Env, address: Address, authorization_level: Roles) {
    env.storage()
        .instance()
        .set(&DataKey::AuthorizationLevel(address), &authorization_level);
}

pub fn remove_account_authorization_level(env: &Env, address: Address) {
    return env
        .storage()
        .instance()
        .remove(&DataKey::AuthorizationLevel(address));
}

pub fn get_account_authorization_level(env: &Env, address: Address) -> Roles {
    return env
        .storage()
        .instance()
        .get::<_, Roles>(&DataKey::AuthorizationLevel(address))
        .unwrap_or(Roles::NotAuthorized);
}
