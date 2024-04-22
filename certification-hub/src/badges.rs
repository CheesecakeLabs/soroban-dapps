use soroban_sdk::{contracttype, Address, Env};

#[derive(Clone)]
#[contracttype]
pub enum BadgesDataKey {
    Badges(Address), // Mapping of the current status a given bagde contract
    BadgesList,      // List of all badges
}

#[derive(Clone, Debug, PartialEq)]
#[contracttype]
pub enum BadgeStatus {
    Active,   // Can be awarded
    Paused,   // Is valid but cannot be awarded for now
    Archived, // Cannot be awarded anymore
    Invalid,  // Invalid badge or have been removed already
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
