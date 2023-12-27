use crate::storage_types::{DataKey, DepositData, BALANCE_BUMP_AMOUNT, BALANCE_BUMP_THREASHOLD};
use soroban_sdk::{Address, Env};

pub fn get_admin(env: &Env) -> Address {
    return env
        .storage()
        .persistent()
        .get::<_, Address>(&DataKey::Admin)
        .expect("Admin not initialized");
}

pub fn get_min_deposit(env: &Env) -> i128 {
    return env
        .storage()
        .persistent()
        .get::<_, i128>(&DataKey::MinDeposit)
        .expect("Min deposit not initialized");
}

pub fn get_asset(env: &Env) -> Address {
    return env
        .storage()
        .persistent()
        .get::<_, Address>(&DataKey::Asset)
        .expect("Asset not initialized");
}

pub fn get_term(env: &Env) -> u64 {
    return env
        .storage()
        .persistent()
        .get::<_, u64>(&DataKey::Term)
        .expect("Term not initialized");
}

pub fn get_compound_step(env: &Env) -> u64 {
    return env
        .storage()
        .persistent()
        .get::<_, u64>(&DataKey::CompoundStep)
        .expect("Compount Step not initialized");
}

pub fn get_yield_rate(env: &Env) -> u64 {
    return env
        .storage()
        .persistent()
        .get::<_, u64>(&DataKey::YieldRate)
        .expect("Yield rate not initialized");
}

pub fn get_penalty_rate(env: &Env) -> u64 {
    return env
        .storage()
        .persistent()
        .get::<_, u64>(&DataKey::PenaltyRate)
        .expect("Penalty rate not initialized");
}

pub fn get_deposit_amount(env: &Env, address: Address) -> i128 {
    if let Some(user) = env
        .storage()
        .persistent()
        .get::<_, DepositData>(&DataKey::Deposit(address))
    {
        user.amount
    } else {
        0
    }
}

pub fn get_deposit_timestamp(env: &Env, address: Address) -> u64 {
    if let Some(user) = env
        .storage()
        .persistent()
        .get::<_, DepositData>(&DataKey::Deposit(address))
    {
        user.timestamp
    } else {
        0
    }
}

pub fn clear_user_position(env: &Env, address: Address) {
    env.storage()
        .persistent()
        .remove(&DataKey::Deposit(address));
}

pub fn set_user_position(env: &Env, address: Address, amount: i128, timestamp: u64) {
    let deposit_data = DepositData {
        amount: amount,
        timestamp: timestamp,
    };
    env.storage()
        .persistent()
        .set(&DataKey::Deposit(address.clone()), &deposit_data);
    env.storage().persistent().extend_ttl(
        &DataKey::Deposit(address),
        BALANCE_BUMP_THREASHOLD,
        BALANCE_BUMP_AMOUNT,
    );
}
