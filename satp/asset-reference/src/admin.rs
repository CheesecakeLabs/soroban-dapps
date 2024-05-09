use soroban_sdk::{contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum AdminDataKey {
    Admin,
}

pub fn set_admin(env: &Env, admin: Address) {
    admin.require_auth();

    env.storage().instance().set(&AdminDataKey::Admin, &admin);
}

pub fn get_admin(env: &Env) -> Address {
    return env
        .storage()
        .instance()
        .get::<_, Address>(&AdminDataKey::Admin)
        .expect("Admin not initialized");
}

// pub fn is_admin(env: &Env, address: Address) -> bool {
//     return get_admin(env) == address;
// }

// pub fn update_admin(env: &Env, new_admin: Address) {
//     let old_admin = get_admin(env);

//     //expect old and new to be different
//     assert!(
//         old_admin != new_admin,
//         "Provided account is already the current admin"
//     );

//     old_admin.require_auth();

//     env.storage()
//         .instance()
//         .set(&AdminDataKey::Admin, &new_admin);
// }
