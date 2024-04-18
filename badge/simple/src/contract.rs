use soroban_sdk::{contract, contractimpl, Address, Env, Symbol};

use crate::{
    authorization::{read_governance_hub_address, require_admin, write_governance_hub_address},
    award::{award_new_badge, burn_badge, read_badge, BadgeData},
    certification_hub::{read_certification_hub_address, write_certification_hub_address},
    metadata::{read_metadata, write_metadata, BadgeMetadata},
};

pub trait SimpleBadgeTrait {
    //
    // Admin Functions
    // =========================================
    fn initialize(
        env: Env,
        admin: Address,
        governance_hub: Address,
        certification_hub: Address,
        badge_metadata: BadgeMetadata,
    );
    fn mint_badge(env: Env, admin: Address, recipient: Address, custom_metadata: Symbol);
    fn burn_badge(env: Env, admin: Address, recipient: Address, badge_id: i128);

    //
    // View functions
    //==========================================
    fn governance_hub(env: Env) -> Address;
    fn certification_hub(env: Env) -> Address;
    fn metadata(env: Env) -> BadgeMetadata;
    fn badge(env: Env, address: Address) -> BadgeData;
}

#[contract]
pub struct SimpleBadge;

#[contractimpl]
impl SimpleBadgeTrait for SimpleBadge {
    fn initialize(
        env: Env,
        admin: Address,
        governance_hub: Address,
        certification_hub: Address,
        badge_metadata: BadgeMetadata,
    ) {
        admin.require_auth();
        require_admin(&env, admin, governance_hub.clone());

        write_governance_hub_address(&env, governance_hub);
        write_certification_hub_address(&env, certification_hub);
        write_metadata(&env, badge_metadata);
    }

    fn mint_badge(env: Env, admin: Address, recipient: Address, custom_metadata: Symbol) {
        let governance_hub = read_governance_hub_address(&env);
        require_admin(&env, admin.clone(), governance_hub);
        admin.require_auth();

        award_new_badge(&env, recipient, custom_metadata);
    }

    fn burn_badge(env: Env, admin: Address, recipient: Address, badge_id: i128) {
        let governance_hub = read_governance_hub_address(&env);
        require_admin(&env, admin.clone(), governance_hub);
        admin.require_auth();

        burn_badge(&env, recipient, badge_id);
    }

    fn governance_hub(env: Env) -> Address {
        read_governance_hub_address(&env)
    }

    fn certification_hub(env: Env) -> Address {
        read_certification_hub_address(&env)
    }

    fn metadata(env: Env) -> BadgeMetadata {
        read_metadata(&env)
    }

    fn badge(env: Env, address: Address) -> BadgeData {
        read_badge(&env, address)
    }
}
