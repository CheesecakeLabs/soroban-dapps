#![cfg(test)]

use super::{Contract, ContractClient};
use soroban_sdk::{vec, Env, Symbol};

#[test]
fn test() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Contract);
    let client = ContractClient::new(&env, &contract_id);

    let words = client.hello();
    assert_eq!(
        words,
        vec![&env, Symbol::short("Hello")]
    );
}