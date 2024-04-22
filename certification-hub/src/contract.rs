use soroban_sdk::{contract, contractimpl, Address, Env, Vec};

use crate::{
    authorization::{read_governance_hub_address, require_admin, write_governance_hub_address},
    badges::{read_badge, remove_badge, write_badge, BadgeStatus},
    users::{read_collection_address, remove_from_collection, write_collection_address},
};

pub trait CertificationHubTrait {
    //
    // Admin Functions
    // =========================================
    fn initialize(env: Env, admin: Address, governance_hub: Address);
    fn register_badge(env: Env, admin: Address, address: Address, active: bool);
    fn remove_badge(env: Env, admin: Address, badge_address: Address);
    fn set_badge_status(env: Env, admin: Address, badge_address: Address, status: BadgeStatus);

    //
    // Contract functions
    // =========================================
    fn add_to_collection(env: Env, address: Address, badge_caller: Address);
    fn remove_from_collection(env: Env, address: Address, badge_caller: Address);

    //
    // View functions
    //==========================================
    fn governance_hub(env: Env) -> Address;
    fn user_collection(env: Env, address: Address) -> Vec<Address>;
    fn badge_status(env: Env, address: Address) -> BadgeStatus;
}

#[contract]
pub struct CertificationHub;

#[contractimpl]
impl CertificationHubTrait for CertificationHub {
    fn initialize(env: Env, admin: Address, governance_hub: Address) {
        admin.require_auth();
        require_admin(&env, admin, governance_hub.clone());

        write_governance_hub_address(&env, governance_hub);
    }

    fn register_badge(env: Env, admin: Address, address: Address, active: bool) {
        let governance_hub = read_governance_hub_address(&env);
        require_admin(&env, admin, governance_hub.clone());

        let status = if active {
            BadgeStatus::Active
        } else {
            BadgeStatus::Paused
        };

        write_badge(&env, address, status)
    }

    fn remove_badge(env: Env, admin: Address, badge_address: Address) {
        let governance_hub = read_governance_hub_address(&env);
        require_admin(&env, admin, governance_hub.clone());

        remove_badge(&env, badge_address)
    }

    fn set_badge_status(env: Env, admin: Address, badge_address: Address, status: BadgeStatus) {
        let governance_hub = read_governance_hub_address(&env);
        require_admin(&env, admin, governance_hub.clone());

        write_badge(&env, badge_address, status);
    }

    fn add_to_collection(env: Env, user_address: Address, badge_caller: Address) {
        let badge_status = read_badge(&env, badge_caller.clone());

        assert!(badge_status == BadgeStatus::Active, "Badge not active!");

        badge_caller.require_auth();

        add_badge_to_collection_and_clean_up(&env, user_address, badge_caller)
    }

    fn remove_from_collection(env: Env, user_address: Address, badge_caller: Address) {
        badge_caller.require_auth();

        remove_from_collection(&env, user_address, badge_caller)
    }

    fn user_collection(env: Env, address: Address) -> Vec<Address> {
        return read_collection_address(&env, address);
    }

    fn badge_status(env: Env, address: Address) -> BadgeStatus {
        return read_badge(&env, address);
    }

    fn governance_hub(env: Env) -> Address {
        read_governance_hub_address(&env)
    }
}

fn add_badge_to_collection_and_clean_up(env: &Env, user_address: Address, badge_caller: Address) {
    let mut collection = read_collection_address(&env, user_address.clone());
    let mut updated_collection: Vec<Address> = Vec::new(env);

    while collection.len() > 0 {
        let badge = collection.pop_back().unwrap();

        if badge == badge_caller {
            panic!("Badge already in collection")
        }

        if read_badge(&env, badge.clone()) != BadgeStatus::Invalid {
            updated_collection.push_front(badge);
        }
    }

    updated_collection.push_front(badge_caller.clone());

    write_collection_address(&env, user_address, updated_collection);
}
