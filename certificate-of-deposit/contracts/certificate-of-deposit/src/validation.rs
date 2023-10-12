
use soroban_sdk::{ Address, Env,};
use crate::data::{get_term, get_deposit_amount, get_deposit_timestamp,get_min_deposit};
use crate::storage_types::DataKey;

pub fn is_initialized(env: &Env) -> bool {
    
    if !env.storage().persistent().has(&DataKey::Asset){
        false
    } else {
        true
    }
      
}

pub fn is_deposit_valid(env: &Env, amount: i128)-> bool {
    let min_amount: i128 = get_min_deposit(env);
    min_amount <= amount
}

pub fn has_not_active_deposit(env: &Env, address: Address) -> bool {
    get_deposit_amount(env, address) == 0    
}

pub fn has_active_deposit(env: &Env, address: Address) -> bool {
    get_deposit_amount(env, address) != 0
}

pub fn has_achieved_completion(env: &Env, address: Address) -> bool {
    let elapsed_time = env.ledger().timestamp() - get_deposit_timestamp(env, address);
    let term = get_term(env);

    elapsed_time >= term    
}