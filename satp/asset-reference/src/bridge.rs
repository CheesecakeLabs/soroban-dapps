use soroban_sdk::{contracttype, Env};

#[derive(Clone)]
#[contracttype]
pub enum BridgeDataKey {
    BridgedOutAmouny,
}

fn set_bridged_out_amount(env: &Env, amount: i128) {
    env.storage()
        .instance()
        .set(&BridgeDataKey::BridgedOutAmouny, &amount);
}

pub fn get_bridged_out_amount(env: &Env) -> i128 {
    return env
        .storage()
        .instance()
        .get::<_, i128>(&BridgeDataKey::BridgedOutAmouny)
        .unwrap_or(0);
}

pub fn increase_bridged_out_amount(env: &Env, amount: i128) {
    let current = get_bridged_out_amount(env);
    set_bridged_out_amount(env, current + amount);
}

pub fn decrease_bridged_out_amount(env: &Env, amount: i128) {
    let current = get_bridged_out_amount(env);
    if current < amount {
        panic!("Bridge: decrease_bridged_out_amount: amount exceeds current bridged out amount");
    }
    set_bridged_out_amount(env, current - amount);
}
