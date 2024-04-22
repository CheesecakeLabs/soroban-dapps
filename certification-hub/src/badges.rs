use soroban_sdk::{contracttype, Address, Env, Vec};

//
// There is some redundancy here as of now to ensure
// we can fetch everything from on-chain data and
// migrate the data to new contracts if needed, such as
// upgrading a badge contract to a new version.
//
#[derive(Clone)]
#[contracttype]
pub enum BadgesDataKey {
    Badges(Address), // Mapping of the current status a given bagde contract
    BadgesList,      // List of all badges
}

// #[derive(Clone, Debug)]
// #[contracttype]
// pub struct BadgeData {
//     pub status: BadgeStatus,
//     pub address: Address,
// }

#[derive(Clone, Debug, PartialEq)]
#[contracttype]
pub enum BadgeStatus {
    Active,   // Can be awarded
    Paused,   // Is valid but cannot be awarded for now
    Archived, // Cannot be awarded anymore
    Invalid,  // Invalid badge or have been removed already
}

// fn read_badge_id_iterator(env: &Env) -> i128 {
//     return env
//         .storage()
//         .instance()
//         .get::<_, i128>(&BadgesDataKey::BadgeIdIterator)
//         .unwrap_or(0);
// }

// fn write_badge_id_iterator(env: &Env, badge_id: i128) {
//     env.storage()
//         .instance()
//         .set(&BadgesDataKey::BadgeIdIterator, &badge_id);
// }

pub fn read_badge_list(env: &Env) -> Vec<i128> {
    return env
        .storage()
        .instance()
        .get::<_, Vec<i128>>(&BadgesDataKey::BadgesList)
        .unwrap_or(Vec::new(env));
}

pub fn write_badge_list(env: &Env, list: Vec<i128>) {
    env.storage()
        .instance()
        .set(&BadgesDataKey::BadgesList, &list);
}

pub fn write_badge(env: &Env, address: Address, satus: BadgeStatus) {
    env.storage()
        .instance()
        .set(&BadgesDataKey::Badges(address), &satus);
}

pub fn read_badge(env: &Env, address: Address) -> BadgeStatus {
    return env
        .storage()
        .instance()
        .get::<_, BadgeStatus>(&BadgesDataKey::Badges(address))
        .unwrap_or(BadgeStatus::Invalid);
}

pub fn remove_badge(env: &Env, address: Address) {
    env.storage()
        .instance()
        .remove(&BadgesDataKey::Badges(address));
}

// pub fn write_new_badge(env: &Env, badge_address: Address, status: BadgeStatus) -> i128 {
//     let badge_id = read_badge_id_iterator(env) + 1;
//     let mut badge_list = read_badge_list(env);

//     badge_list.push_back(badge_id);

//     let badge_data = BadgeData {
//         status: status,
//         address: badge_address,
//     };

//     write_badge_data(env, badge_id, badge_data);
//     write_badge_id_iterator(env, badge_id);
//     write_badge_list(env, badge_list);

//     return badge_id;
// }

// pub fn remove_badge(env: &Env, badge_id: i128) {
//     let mut badge_list = read_badge_list(env);

//     assert!(
//         badge_list.contains(&badge_id),
//         "Badge not found in list of badges"
//     );

//     let badge_index = badge_list.binary_search(&badge_id).unwrap();
//     badge_list.remove(badge_index);

//     write_badge_list(env, badge_list);
//     remove_badge_data(env, badge_id)
// }
