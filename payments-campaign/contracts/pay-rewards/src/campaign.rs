use soroban_sdk::{contracttype, symbol_short, token::TokenClient, Address, Env};

#[derive(Clone)]
#[contracttype]
enum DataKey {
    Asset,
    Status,
    CampaignParameters,
    EligibleAccounts(Address),
    CumulativeQuota(Address),
}
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
#[contracttype]
pub enum CampaignStatus {
    Active,
    Inactive,
    Completed,
}
#[derive(Clone)]
#[contracttype]
pub struct CampaignParameters {
    reward: i128,
    pub amount_required: i128,
    pub end_time: u32,
}

pub fn set_asset(env: &Env, asset: Address) {
    env.storage()
        .instance()
        .set(&DataKey::Asset, &asset);
}

pub fn get_asset(env: &Env) -> Address {
    return env
        .storage()
        .instance()
        .get::<_, Address>(&DataKey::Asset)
        .expect("Asset not initialized");
}

pub fn set_status(env: &Env, status: CampaignStatus) {
    env.storage()
        .instance()
        .set(&DataKey::Status, &status);
}

pub fn get_status(env: &Env) -> CampaignStatus {
    return env
        .storage()
        .instance()
        .get::<_, CampaignStatus>(&DataKey::Status)
        .unwrap_or(CampaignStatus::Inactive);
}

pub fn set_campaign_parameters(env: &Env, end_time: u32, reward: i128, amount_required: i128) {
    env.storage()
        .instance()
        .set(
            &DataKey::CampaignParameters,
            &CampaignParameters {
                reward,
                amount_required,
                end_time,
            },
        );
}

pub fn get_campaign_parameters(env: &Env) -> CampaignParameters {
    return env
        .storage()
        .instance()
        .get::<_, CampaignParameters>(&DataKey::CampaignParameters)
        .expect("Campaign parameters not initialized");
}

pub fn update_account_eligibility(env: &Env, account: Address, eligible: bool) {
    env.storage()
        .instance()
        .set(&DataKey::EligibleAccounts(account), &eligible);
}

// Defaults to true unless explicitly set to false
pub fn is_account_eligible(env: &Env, account: Address) -> bool {
    return env
        .storage()
        .instance()
        .get::<_, bool>(&DataKey::EligibleAccounts(account))
        .unwrap_or(true);
}


pub fn set_cumulative_quota(env: &Env, account: Address, quota: i128) {
    env.storage()
        .instance()
        .set(&DataKey::CumulativeQuota(account), &quota);
}

pub fn get_cumulative_quota(env: &Env, account: Address) -> i128 {
    return env
        .storage()
        .instance()
        .get::<_, i128>(&DataKey::CumulativeQuota(account))
        .unwrap_or(0);
}

pub fn is_campaign_completed(env: &Env)-> bool {

    if get_status(env) == CampaignStatus::Completed {
        return true;
    }

    let campaign_parameters = get_campaign_parameters(env);

    if campaign_parameters.end_time <= env.ledger().sequence() {
        return true;
    }

    let asset = get_asset(env);
    let amount_required = campaign_parameters.amount_required;
    let balance = TokenClient::new(&env, &asset).balance(&env.current_contract_address());

    return balance < amount_required;
} 

pub fn update_transaction_quota(env: &Env, account: Address, amount: i128)-> i128{
    let campaign_parameters = get_campaign_parameters(env);
    let updated_quota = get_cumulative_quota(env, account.clone()) + amount;
    let new_quota = if updated_quota > campaign_parameters.amount_required {
        campaign_parameters.amount_required
    } else {
        updated_quota
    };
    
    set_cumulative_quota(env, account, new_quota);

    return new_quota;
}


pub fn send_reward(env: &Env, account: Address) {
    let campaign_parameters = get_campaign_parameters(env);
    let asset = get_asset(env);

    TokenClient::new(&env, &asset).transfer(
        &env.current_contract_address(),
        &account,
        &campaign_parameters.reward,
    );

    env.events().publish(
        (symbol_short!("reward"), account),
        campaign_parameters.reward
    );
}
