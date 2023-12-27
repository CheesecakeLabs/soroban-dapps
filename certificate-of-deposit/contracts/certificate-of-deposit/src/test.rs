#![cfg(test)]
extern crate std;

// use std::println;

use super::*;

use crate::contract::CertificateOfDepositsClient;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, Env,
};
use token::Client as TokenClient;
use token::StellarAssetClient as TokenAdminClient;

//
// TESTUTILS
//
fn create_token_contract<'a>(e: &Env, admin: &Address) -> (TokenClient<'a>, TokenAdminClient<'a>) {
    let contract_address = e.register_stellar_asset_contract(admin.clone());
    (
        TokenClient::new(e, &contract_address),
        TokenAdminClient::new(e, &contract_address),
    )
}

fn create_certificate_of_deposits_contract(e: &Env) -> CertificateOfDepositsClient {
    CertificateOfDepositsClient::new(e, &e.register_contract(None, CertificateOfDeposits {}))
}

fn advance_ledger(e: &Env, delta: u64) {
    e.ledger().with_mut(|l| {
        l.timestamp += delta;
    });
}

#[test]
fn test_compound_rate() {
    let env = Env::default();
    env.mock_all_auths();

    let token_admin = Address::generate(&env);
    let (token, _token_admin) = create_token_contract(&env, &token_admin);
    let _token_admin_client = TokenAdminClient::new(&env, &token.address);
    let (token, token_admin_client) = create_token_contract(&env, &token_admin);

    // fuels and initialize certificates of deposit contract
    const TERM: u64 = 600; //10 mins
    const COMPOUND_STEP: u64 = 10; //every 10 seconds
    const YIELD_RATE: u64 = 200; // 2%
    const MIN_DEPOSIT: i128 = 10; //10 stroops
    const PENALTY_RATE: u64 = 5000; // 50%
    const ALLOWANCE_PERIOD: u32 = 535_100; // Block 535_100
    let contract = create_certificate_of_deposits_contract(&env);
    // let admin = Address::random(&env);
    let admin = token_admin;
    token_admin_client.mint(&admin, &10_000_000);

    contract.initialize(
        &admin,
        &token.address,
        &TERM,
        &COMPOUND_STEP,
        &YIELD_RATE,
        &MIN_DEPOSIT,
        &PENALTY_RATE,
        &ALLOWANCE_PERIOD,
    );

    //add token allowance to contract
    // token.approve(&token_admin.address, &contract.address, &10000, &(env.ledger().sequence() + 10000 as u32));
    assert_eq!(token.balance(&admin), 10_000_000);

    //
    // User Invests for the first time and withdraws after term
    // Initial user balance 1000
    // Deposits 1000
    // Yield(30):  61
    // Withdraws 3281
    //

    let user = Address::generate(&env);
    token_admin_client.mint(&user, &1000); //fuel user wallet
    contract.deposit(&1000, &user);

    assert_eq!(token.balance(&admin), 10_001_000); //verifies if the contract got the right balance
    assert_eq!(contract.get_position(&user), 1000); //verifies if the user balance is the initial balance
    assert_eq!(contract.get_estimated_yield(&user), 0); //verifies if the user yield is 0 (no steps in time)
    assert_eq!(contract.get_position(&user), 1000); //verifies if the user balance is the initial balance

    //move ledger 100 seconds to the future and verifies if the user yield was accrued
    advance_ledger(&env, 30);
    assert_eq!(contract.get_estimated_yield(&user), 61);

    //advances through the end of the term and verifies if the user got the right balance
    advance_ledger(&env, 571);
    contract.withdraw(&user, &false);
    assert_eq!(token.balance(&user), 3281);

    //
    // User Invests for the second time and withdraws before term
    // Initial user balance 3281
    // Deposits 1000
    // Yield(50):  104
    // Withdraws 52 (penalty applied)
    // Final balance: 3333
    //

    //Deposits and verifies if the user balance is the initial balance
    contract.deposit(&1000, &user);
    assert_eq!(contract.get_position(&user), 1000);

    //move 50 seconds to the future and verifies if the user has earned the yield
    advance_ledger(&env, 50);
    assert_eq!(contract.get_estimated_yield(&user), 104);

    // //user withdraws their balance and verifies balance
    contract.withdraw(&user, &true);
    assert_eq!(token.balance(&user), 3281 + 52);

    //
    // User Invests for the third time and withdraws right on term
    // Initial user balance 3333
    // Deposits 1200
    // Yield(300):  973
    // Withdraws 3937
    // Final balance: 6070
    //

    //Deposits and verifies if the user balance is the initial balance
    contract.deposit(&1200, &user);
    assert_eq!(contract.get_position(&user), 1200);

    //move 50 seconds to the future and verifies if the user has earned the yield
    advance_ledger(&env, 300);
    assert_eq!(contract.get_estimated_yield(&user), 973);

    //user withdraws their balance and verifies balance
    advance_ledger(&env, 300);
    contract.withdraw(&user, &false);
    assert_eq!(token.balance(&user), 2133 + 3937);

    //verifies get time
    contract.deposit(&100, &user);
    assert_eq!(contract.get_time_left(&user), TERM);

    advance_ledger(&env, 200);
    assert_eq!(contract.get_time_left(&user), TERM - 200);

    advance_ledger(&env, TERM + 1);
    assert_eq!(contract.get_time_left(&user), 0);
}

#[test]
fn test_flat_rate() {
    let env = Env::default();
    env.mock_all_auths();

    let token_admin = Address::generate(&env);
    let (token, _token_admin) = create_token_contract(&env, &token_admin);
    let _token_admin_client = TokenAdminClient::new(&env, &token.address);
    let (token, token_admin_client) = create_token_contract(&env, &token_admin);

    // fuels and initialize certificates of deposit contract
    const TERM: u64 = 600; //10 mins
    const COMPOUND_STEP: u64 = 0; // Doesn't compound
    const YIELD_RATE: u64 = 2000; // 20%
    const MIN_DEPOSIT: i128 = 10; //10 stroops
    const PENALTY_RATE: u64 = 5000; // 50%
    const ALLOWANCE_PERIOD: u32 = 535_100; // Block 535_100
    let contract = create_certificate_of_deposits_contract(&env);
    // let admin = Address::random(&env);
    let admin = token_admin;
    token_admin_client.mint(&admin, &10_000_000);

    contract.initialize(
        &admin,
        &token.address,
        &TERM,
        &COMPOUND_STEP,
        &YIELD_RATE,
        &MIN_DEPOSIT,
        &PENALTY_RATE,
        &ALLOWANCE_PERIOD,
    );

    assert_eq!(token.balance(&admin), 10_000_000);

    //
    // User Invests for the first time and withdraws after term
    // Initial user balance 1000
    // Deposits 1000
    // Yield(100):  33
    // Withdraws 1200
    //

    let user = Address::generate(&env);
    token_admin_client.mint(&user, &1000); //fuel user wallet
    contract.deposit(&1000, &user);

    assert_eq!(token.balance(&admin), 10_001_000); //verifies if the contract got the right balance
    assert_eq!(contract.get_position(&user), 1000); //verifies if the user balance is the initial balance
    assert_eq!(contract.get_estimated_yield(&user), 0); //verifies if the user yield is 0 (no steps in time)
    assert_eq!(contract.get_position(&user), 1000); //verifies if the user balance is the initial balance

    //move ledger 100 seconds to the future and verifies if the user yield was accrued
    advance_ledger(&env, 100);
    assert_eq!(contract.get_estimated_yield(&user), 33);

    //advances through the end of the term and verifies if the user got the right balance
    advance_ledger(&env, 501);
    contract.withdraw(&user, &false);
    assert_eq!(token.balance(&user), 1200);

    //
    // User Invests for the second time and withdraws before term
    // Initial user balance 1200
    // Deposits 1000
    // Yield(50):  16
    // Withdraws 1008
    // Final balance: 1208
    //

    //Deposits and verifies if the user balance is the initial balance
    contract.deposit(&1000, &user);
    assert_eq!(contract.get_position(&user), 1000);

    //move 50 seconds to the future and verifies if the user has earned the yield
    advance_ledger(&env, 50);
    assert_eq!(contract.get_estimated_yield(&user), 16);

    //user withdraws their balance and verifies balance
    contract.withdraw(&user, &true);
    assert_eq!(token.balance(&user), 1200 + (16 / 2)); // receives yield with penalty

    //
    // User Invests for the third time and withdraws right on term
    // Initial user balance 1208
    // Deposits 1200
    // Yield(300):  120
    // Withdraws 1440
    // Final balance: 1448
    //

    //Deposits and verifies if the user balance is the initial balance
    contract.deposit(&1200, &user);
    assert_eq!(contract.get_position(&user), 1200);

    //move 50 seconds to the future and verifies if the user has earned the yield
    advance_ledger(&env, 300);
    assert_eq!(contract.get_estimated_yield(&user), 120);

    //user withdraws their balance and verifies balance
    advance_ledger(&env, 300);
    contract.withdraw(&user, &false);
    assert_eq!(token.balance(&user), 8 + 1440);

    //verifies get time
    contract.deposit(&100, &user);
    assert_eq!(contract.get_time_left(&user), TERM);

    advance_ledger(&env, 200);
    assert_eq!(contract.get_time_left(&user), TERM - 200);

    advance_ledger(&env, TERM + 1);
    assert_eq!(contract.get_time_left(&user), 0);
}
