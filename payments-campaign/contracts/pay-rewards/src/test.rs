#![cfg(test)]

use super::*;
use campaign::CampaignStatus;
use contract::{PaymentRewards, PaymentRewardsClient};
use soroban_sdk::{  testutils::{Address as _, Events}, token::{StellarAssetClient, TokenClient, TokenInterface}, Address, Env, Vec};

#[test]
fn test() {
    let env = Env::default();
    let asset_admin = Address::generate(&env);
    let admin = Address::generate(&env);
    let user_a = Address::generate(&env);
    let user_b = Address::generate(&env);


    let end_time =   env.ledger().sequence()+    100;

    env.mock_all_auths();

    let asset = env.register_stellar_asset_contract(asset_admin.clone());
    let asset_client_admin = StellarAssetClient::new(&env, &asset);

    let asset_client = TokenClient::new(&env, &asset);

    let contract_id = env.register_contract(None, PaymentRewards);

    let pay_rewards_client = PaymentRewardsClient::new(&env, &contract_id);

    // Mint initial funds to ADMIN
    asset_client_admin.mint(&admin, &1000);
    assert_eq!(asset_client.balance(&admin), 1000);

    //Mint initial funds to users
    asset_client_admin.mint(&user_a, &100);
    asset_client_admin.mint(&user_b, &100);
    assert_eq!(asset_client.balance(&user_a), 100);
    assert_eq!(asset_client.balance(&user_b), 100);

    // Initialize contract but not campaign
    pay_rewards_client.initialize(&admin, &asset, &end_time, &5, &20, &false);
    assert_eq!(pay_rewards_client.status() , CampaignStatus::Completed); // considered completed due to it being depleted from balance
    assert_eq!(pay_rewards_client.balance(), 0);
    assert_eq!(pay_rewards_client.get_cumulative_quota(&user_a), 0);
    assert_eq!(pay_rewards_client.check_eligibility(&user_a), true);

    // Add funds to contract
    pay_rewards_client.add_funds(&admin, &500);
    assert_eq!(pay_rewards_client.balance(), 500);
    assert_eq!(asset_client.balance(&admin), 500);
    assert_eq!(pay_rewards_client.status() , CampaignStatus::Inactive);


    // Start campaign
    pay_rewards_client.start();
    assert_eq!(pay_rewards_client.status() , CampaignStatus::Active);

    // Send from user_a to user_b - partial quota
    pay_rewards_client.send(&user_a, &user_b, &10);
    assert_eq!(pay_rewards_client.get_cumulative_quota(&user_a), 10);
    assert_eq!(pay_rewards_client.get_cumulative_quota(&user_b), 0);
    assert_eq!(asset_client.balance(&user_a), 90);
    assert_eq!(asset_client.balance(&user_b), 110);

    //send from user_a to user_b - full quota
    pay_rewards_client.send(&user_a, &user_b, &15);
    assert_eq!(pay_rewards_client.get_cumulative_quota(&user_a), 20);
    assert_eq!(pay_rewards_client.get_cumulative_quota(&user_b), 0);
    assert_eq!(asset_client.balance(&user_a), 75+5);
    assert_eq!(asset_client.balance(&user_b), 125);
    assert_eq!(pay_rewards_client.balance(), 500-5);
    assert_eq!(pay_rewards_client.check_eligibility(&user_a), false);
    assert_eq!(pay_rewards_client.check_eligibility(&user_b), true);

    // verify if reward event was emitted    
    let reward_events = env.events().all().iter().filter(|e| e.0 == pay_rewards_client.address);
    assert_eq!(reward_events.count(), 1);

    // Pause campaign
    pay_rewards_client.pause();
    assert_eq!(pay_rewards_client.status() , CampaignStatus::Inactive);
    assert_eq!(pay_rewards_client.check_eligibility(&user_a), false);
    assert_eq!(pay_rewards_client.check_eligibility(&user_b), true);

    // send from user_b to user_a - campaign paused
    pay_rewards_client.send(&user_b, &user_a, &10);
    assert_eq!(pay_rewards_client.get_cumulative_quota(&user_b), 0);
    assert_eq!(asset_client.balance(&user_b), 115);

    //semd more from user_b to user_a - campaign paused
    pay_rewards_client.send(&user_b, &user_a, &50);
    assert_eq!(pay_rewards_client.get_cumulative_quota(&user_b), 0);
    assert_eq!(asset_client.balance(&user_b), 65);

    // Start campaign again
    pay_rewards_client.start();

    // send from user_b to user_a - campaign active and user_b reaches full quota
    pay_rewards_client.send(&user_b, &user_a, &50);
    assert_eq!(pay_rewards_client.get_cumulative_quota(&user_b), 20);
    assert_eq!(asset_client.balance(&user_b), 20);
    
    // verify if reward event was emitted    
    let reward_events = env.events().all().iter().filter(|e| e.0 == pay_rewards_client.address);
    assert_eq!(reward_events.count(), 2);

}
