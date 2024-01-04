
use soroban_sdk::{ Address, Env, token};

use crate::storage_types::PERCENTAGE_MULTIPLIER;
use crate::data::{get_term, get_deposit_amount, get_yield_rate, get_deposit_timestamp, get_penalty_rate, get_asset,clear_user_position, get_admin, get_compound_step};


pub fn calculate_yield(env: &Env, address: Address) -> i128 {

    let compound_step  = get_compound_step(env);

    if compound_step == 0 {
        return calculate_flat_yield(env, address);
    }

    calculate_compound_yield(env, address, compound_step)
}

pub fn calculate_compound_yield(env: &Env, address: Address, compound:u64) -> i128 {

    let elapsed_time = get_elapsed_time(env, address.clone()).min(get_term(env));

    let deposit_amount = get_deposit_amount(env,address.clone());
    let yield_rate = get_yield_rate(env);
    let compound_step  = compound;

    let compounds = (elapsed_time / compound_step) as usize;

    
    let mut amount = deposit_amount * PERCENTAGE_MULTIPLIER;
    for _ in 0..compounds {
        amount += (amount * yield_rate as i128) /  PERCENTAGE_MULTIPLIER;
    }

    (amount / PERCENTAGE_MULTIPLIER) - deposit_amount

}

pub fn calculate_flat_yield(env: &Env, address: Address) -> i128 {

    let elapsed_time = get_elapsed_time(env, address.clone()).min(get_term(env));
    let term: u64 = get_term(env);
    let deposit_amount = get_deposit_amount(env,address.clone());
    let yield_rate = get_yield_rate(env);

    return (elapsed_time as i128 * yield_rate as i128 * deposit_amount) / (term as i128 * PERCENTAGE_MULTIPLIER);
}


pub fn calculate_withdraw(env: &Env, address: Address) -> i128 {
    
    let yield_earned: i128 = calculate_yield(env, address.clone());
    let deposit_amount = get_deposit_amount(env,address.clone());
    let term = get_term(env);
    let elapsed_time = get_elapsed_time(env, address);
    let penalty_rate = get_penalty_rate(env);
    
    if elapsed_time < term {
       return (yield_earned - (yield_earned * penalty_rate as i128 / PERCENTAGE_MULTIPLIER)) + deposit_amount; 


    }else{
        return yield_earned + deposit_amount
    }
    
}

pub fn execute_withdraw(env: &Env, address: Address){
    
    let withdraw_amount: i128 = calculate_withdraw(&env, address.clone());

    assert!(
        get_admin_funds(&env) >= withdraw_amount,
        "Treasury is underfunded."
    );

    clear_user_position(&env, address.clone());
    send_funds_to_address(&env, withdraw_amount, address);
        
} 
pub fn send_funds_to_address(env: &Env, amount: i128, address: Address){

    let asset_address: Address = get_asset(&env);
    let token_client = token::Client::new(&env, &asset_address);
    let admin_address: Address = get_admin(&env);

    token_client.transfer_from(&env.current_contract_address() ,&admin_address, &address, &amount);

}




fn get_admin_funds(env:&Env)->i128{
    let asset_address: Address = get_asset(&env);
    let token_client = token::Client::new(&env, &asset_address);
    let admin_address: Address = get_admin(&env);

    token_client.balance(&admin_address)

}

fn get_elapsed_time(env: &Env,address: Address) -> u64 {

    let current_date = env.ledger().timestamp();
    let deposit_date = get_deposit_timestamp(env, address);

    return current_date - deposit_date;
}

