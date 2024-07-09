use core::ops::Add;

use soroban_sdk::{contract, contractimpl, token::TokenClient, Address, Env};

use crate::{admin::{get_admin, set_admin}, campaign::{get_asset, get_campaign_parameters, get_cumulative_quota, get_status, is_account_eligible, is_campaign_completed, send_reward, set_asset, set_campaign_parameters, set_status, update_account_eligibility, update_transaction_quota, CampaignStatus}};

// use crate::{
//     authorization::{
//         get_account_authorization_level, remove_account_authorization_level,
//         set_account_authorization_level, Roles,
//     },
//     super_admin::{get_super_admin, is_super_admin, set_super_admin, update_super_admin},
// };

pub trait PaymentRewardsTrait {
    //
    //  Admin governance
    // =========================================
    fn initialize(env: Env, admin: Address, asset: Address, end_time: u32, reward: i128, amount_required: i128, start_now: bool);
    fn add_funds(env: Env, from:Address, amount: i128);
    fn start(env: Env);
    fn pause(env: Env);
    fn set_account_eligibility(env: Env, account: Address, eligible: bool);

    //
    //  User functions
    // =========================================
    fn send(env: Env, from:Address, to: Address, amount: i128 );

    //
    // View functions
    //==========================================
    fn balance(env: Env) -> i128;
    fn status(env: Env) -> CampaignStatus;
    fn check_eligibility(env: Env, account: Address) -> bool;
    fn get_cumulative_quota(env: Env, account: Address) -> i128;
}

#[contract]
pub struct PaymentRewards;

#[contractimpl]
impl PaymentRewardsTrait for PaymentRewards {
    fn initialize(env: Env, admin: Address, asset: Address,  end_time: u32, reward: i128, amount_required: i128, start_now: bool) {
        admin.require_auth();
        set_admin(&env, admin.clone());
        set_asset(&env, asset);
        set_campaign_parameters(&env, end_time, reward, amount_required);
    
        let status = if start_now {
            CampaignStatus::Active
        } else {
            CampaignStatus::Inactive
        };

        set_status(&env, status);
    }

    fn start(env: Env) {
        get_admin(&env).require_auth();
        assert!(get_status(&env) == CampaignStatus::Inactive, "Campaign cannot be started");
        set_status(&env, CampaignStatus::Active);
    }

    fn pause(env: Env) {
        get_admin(&env).require_auth();
        assert!(get_status(&env) == CampaignStatus::Active, "Campaign cannot be paused");
        set_status(&env, CampaignStatus::Inactive);
    }

    fn add_funds(env: Env,from:Address, amount: i128) {
        get_admin(&env).require_auth();
        from.require_auth();
        
        let asset = get_asset(&env);

        TokenClient::new(&env, &asset).transfer(&from, &env.current_contract_address(), &amount);
    }

    fn set_account_eligibility(env: Env, account: Address, eligible: bool) {
        get_admin(&env).require_auth();
        update_account_eligibility(&env, account, eligible);
    }

    fn send(env: Env,from:Address, to: Address, amount: i128) {
        get_admin(&env).require_auth();
        from.require_auth();

        let asset = get_asset(&env);
        let status = get_status(&env);
        let params = get_campaign_parameters(&env);

        TokenClient::new(&env, &asset).transfer(&from, &to, &amount);

        if status == CampaignStatus::Inactive || status == CampaignStatus::Completed || !is_account_eligible(&env, from.clone()) {
            return;
        }

        if is_campaign_completed(&env) {
            set_status(&env, CampaignStatus::Completed);
            return;
        }

        let account_quota = update_transaction_quota(&env, from.clone(), amount);

        if account_quota >= params.amount_required {
            send_reward(&env, from.clone());
            update_account_eligibility(&env, from, false)
        }

    }


    fn balance(env: Env) -> i128 {
        let asset = get_asset(&env);
        TokenClient::new(&env, &asset).balance(&env.current_contract_address())
    }

    fn status(env: Env) -> CampaignStatus {

        if is_campaign_completed(&env) {
            return CampaignStatus::Completed
        }

        get_status(&env)
    }

    fn check_eligibility(env: Env, account: Address) -> bool {
        is_account_eligible(&env, account)
    }

    fn get_cumulative_quota(env: Env, account: Address) -> i128 {
        get_cumulative_quota(&env, account)
    }
}