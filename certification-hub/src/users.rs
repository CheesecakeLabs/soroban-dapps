use soroban_sdk::{contracttype, Address, Env, Vec};

#[derive(Clone)]
#[contracttype]
pub enum UsersDataKey {
    Collection(Address),
}

pub fn write_collection_address(env: &Env, address: Address, collection: Vec<Address>) {
    env.storage()
        .instance()
        .set(&UsersDataKey::Collection(address), &collection);
}

pub fn read_collection_address(env: &Env, address: Address) -> Vec<Address> {
    return env
        .storage()
        .instance()
        .get::<_, Vec<Address>>(&UsersDataKey::Collection(address))
        .unwrap_or(Vec::new(env));
}

pub fn remove_from_collection(env: &Env, address: Address, badge_address: Address) {
    let mut collection = read_collection_address(env, address.clone());
    let mut updated_collection = Vec::new(env);

    while collection.len() > 0 {
        let badge = collection.pop_back().unwrap();
        if badge != badge_address {
            updated_collection.push_front(badge);
        }
    }

    write_collection_address(env, address, updated_collection);
}
