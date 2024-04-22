use soroban_sdk::{contracttype, Address, Env, Symbol};

#[derive(Clone, Debug)]
#[contracttype]
pub struct BadgeData {
    pub id: i128,
    pub metadata: Symbol,
}

#[derive(Clone)]
#[contracttype]
pub enum AwardDataKey {
    Badge(Address),
    LastIndex,
}

pub fn award_new_badge(env: &Env, address: Address, metadata: Symbol) {
    let last_index = read_last_index(env);
    let badge_data = BadgeData {
        id: last_index + 1,
        metadata: metadata,
    };

    write_badge(env, address, badge_data);
    write_last_index(env, last_index + 1);
}

pub fn burn_badge(env: &Env, address: Address, badge_id: i128) {
    let badge_data = read_badge(env, address.clone());

    assert!(badge_data.id == badge_id, "Badge id does not match");

    remove_badge(env, address);
}

pub fn read_badge(env: &Env, address: Address) -> BadgeData {
    return env
        .storage()
        .instance()
        .get::<_, BadgeData>(&AwardDataKey::Badge(address))
        .unwrap_or(no_badge_data(env));
}

pub fn read_last_index(env: &Env) -> i128 {
    return env
        .storage()
        .instance()
        .get::<_, i128>(&AwardDataKey::LastIndex)
        .unwrap_or(0);
}

fn write_last_index(env: &Env, last_index: i128) {
    env.storage()
        .instance()
        .set(&AwardDataKey::LastIndex, &last_index);
}

fn write_badge(env: &Env, address: Address, badge_data: BadgeData) {
    env.storage()
        .instance()
        .set(&AwardDataKey::Badge(address), &badge_data);
}

fn remove_badge(env: &Env, address: Address) {
    env.storage()
        .instance()
        .remove(&AwardDataKey::Badge(address));
}

fn no_badge_data(env: &Env) -> BadgeData {
    return BadgeData {
        id: 0,
        metadata: Symbol::new(env, "no_badge"),
    };
}
