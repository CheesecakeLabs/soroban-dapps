use soroban_sdk::{contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
enum DataKey {
    Admin,
}

pub fn set_admin(env: &Env, admin: Address) {

    env.storage()
        .instance()
        .set(&DataKey::Admin, &admin);
}

pub fn get_admin(env: &Env) -> Address {
    return env
        .storage()
        .instance()
        .get::<_, Address>(&DataKey::Admin)
        .expect("Admin not initialized");
}


// pub fn remove_admin(env: &Env) -> Address {
//     return env
//         .storage()
//         .instance()
//         .get::<_, Address>(&DataKey::SuperAdmin)
//         .expect("Admin not initialized");
// }

pub fn is_admin(env: &Env, address: Address) -> bool {
    return get_admin(env) == address;
}