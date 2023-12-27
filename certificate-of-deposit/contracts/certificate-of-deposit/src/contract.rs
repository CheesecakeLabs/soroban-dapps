use crate::storage_types::{DataKey, BALANCE_BUMP_AMOUNT, BALANCE_BUMP_THREASHOLD};
use soroban_sdk::{contract, contractimpl, token, Address, Env};

use crate::balance::{calculate_withdraw, calculate_yield, execute_withdraw};
use crate::data::{
    get_admin, get_asset, get_deposit_amount, get_deposit_timestamp, get_term, set_user_position,
};
use crate::validation::{
    has_achieved_completion, has_active_deposit, has_not_active_deposit, is_deposit_valid,
    is_initialized,
};

pub trait CertificateOfDepositsTrait {
    fn initialize(
        env: Env,
        admin: Address,
        asset: Address,
        term: u64,
        compound_step: u64,
        yield_rate: u64,
        min_deposit: i128,
        penalty_rate: u64,
        allowance_period: u32,
    );

    fn deposit(env: Env, amount: i128, address: Address);
    fn withdraw(env: Env, address: Address, accept_premature_withdraw: bool);

    fn get_estimated_yield(env: Env, address: Address) -> i128;
    fn get_position(env: Env, address: Address) -> i128;
    fn get_estimated_premature_withdraw(env: Env, address: Address) -> i128;
    fn get_time_left(env: Env, address: Address) -> u64;
    fn extend_contract_validity(env: Env);
}

#[contract]
pub struct CertificateOfDeposits;

#[contractimpl]
impl CertificateOfDepositsTrait for CertificateOfDeposits {
    //
    // Set compound_step as 0 to use a flat fee rate instead of a compounding approach
    //
    fn initialize(
        env: Env,
        admin: Address,
        asset: Address,
        term: u64,
        compound_step: u64,
        yield_rate: u64,
        min_deposit: i128,
        penalty_rate: u64,
        allowance_period: u32,
    ) {
        assert!(!is_initialized(&env), "contract already initialized");

        admin.require_auth();

        //
        // TODO: Validate provided arguments as valid asset and valid parameters for the use case
        //
        env.storage().persistent().set(&DataKey::Admin, &admin);
        env.storage().persistent().set(&DataKey::Asset, &asset);
        env.storage().persistent().set(&DataKey::Term, &term);
        env.storage()
            .persistent()
            .set(&DataKey::CompoundStep, &compound_step);
        env.storage()
            .persistent()
            .set(&DataKey::YieldRate, &yield_rate);
        env.storage()
            .persistent()
            .set(&DataKey::MinDeposit, &min_deposit);
        env.storage()
            .persistent()
            .set(&DataKey::PenaltyRate, &penalty_rate);

        // Self::extend_contract_validity(env);

        //
        // Here, since the testnet resets every quarter, there is no need to update this allowance
        // but in a mainnet environment it would be necessary to extend the allowance regularly
        // to ensure it is not expired when the contract needs to move funds in name of the admin
        //
        // let expiration_ledger = env.ledger().sequence() + 535_100; // Maximum allowed for testnet = 31 days
        let expiration_ledger = allowance_period; // Maximum allowed for testnet = 31 days
        let allowance_amount = 900_000_000_000_0000000; //maximum allowance

        // let expiration_ledger = env.ledger().sequence() + 1_000; // Maximum allowed for testnet = 31 days
        // let allowance_amount = 1_0000000; //maximum allowance

        let token_client = token::Client::new(&env, &asset);
        token_client.approve(
            &admin,
            &env.current_contract_address(),
            &allowance_amount,
            &expiration_ledger,
        );
    }

    fn deposit(env: Env, amount: i128, address: Address) {
        address.require_auth();

        assert!(is_initialized(&env), "Contract has not been initialized!");

        assert!(
            is_deposit_valid(&env, amount),
            "Insufficient deposit amount."
        );

        assert!(
            has_not_active_deposit(&env, address.clone()),
            "User has an active deposit."
        );

        let asset_address: Address = get_asset(&env);
        let token_client = token::Client::new(&env, &asset_address);

        let admin_address: Address = get_admin(&env);

        token_client.transfer(&address, &admin_address, &amount);
        set_user_position(&env, address, amount, env.ledger().timestamp());
    }

    fn withdraw(env: Env, address: Address, accept_premature_withdraw: bool) {
        address.require_auth();

        assert!(is_initialized(&env), "Contract has not been initialized!");

        assert!(
            has_active_deposit(&env, address.clone()),
            "User doesn't have an active deposit."
        );

        if !accept_premature_withdraw {
            assert!(
                has_achieved_completion(&env, address.clone()),
                "Term hasn't been achieved."
            );
        }

        execute_withdraw(&env, address.clone());
    }

    fn get_estimated_yield(env: Env, address: Address) -> i128 {
        return calculate_yield(&env, address);
    }

    fn get_position(env: Env, address: Address) -> i128 {
        let deposit_amount = get_deposit_amount(&env, address.clone());
        return deposit_amount + calculate_yield(&env, address);
    }

    fn get_estimated_premature_withdraw(env: Env, address: Address) -> i128 {
        let balance_premature: i128 = calculate_withdraw(&env, address.clone());
        return balance_premature;
    }

    fn get_time_left(env: Env, address: Address) -> u64 {
        assert!(
            has_active_deposit(&env, address.clone()),
            "User doesn't have an active deposit."
        );

        let deposit_time = get_deposit_timestamp(&env, address);
        let term = get_term(&env);
        let elapsed_time = env.ledger().timestamp() - deposit_time;

        if elapsed_time >= term {
            0
        } else {
            return term - elapsed_time;
        }
    }

    fn extend_contract_validity(env: Env) {
        let admin_address: Address = get_admin(&env);
        admin_address.require_auth();

        //
        // All values are immediatelly bumped to a high value during instancing and the same
        // applies to user balances being written. Since this demo is intended to run on
        // testnet, further bumps should  be necessary prior to the testnet resets. For a mainnet
        // environment, it would be necessary to maintain the contract states active by periodically
        // bumping their expiration times.
        //
        env.storage().persistent().extend_ttl(
            &DataKey::Admin,
            BALANCE_BUMP_THREASHOLD,
            BALANCE_BUMP_AMOUNT,
        );
        env.storage().persistent().extend_ttl(
            &DataKey::Asset,
            BALANCE_BUMP_THREASHOLD,
            BALANCE_BUMP_AMOUNT,
        );
        env.storage().persistent().extend_ttl(
            &DataKey::Term,
            BALANCE_BUMP_THREASHOLD,
            BALANCE_BUMP_AMOUNT,
        );
        env.storage().persistent().extend_ttl(
            &DataKey::CompoundStep,
            BALANCE_BUMP_THREASHOLD,
            BALANCE_BUMP_AMOUNT,
        );
        env.storage().persistent().extend_ttl(
            &DataKey::YieldRate,
            BALANCE_BUMP_THREASHOLD,
            BALANCE_BUMP_AMOUNT,
        );
        env.storage().persistent().extend_ttl(
            &DataKey::MinDeposit,
            BALANCE_BUMP_THREASHOLD,
            BALANCE_BUMP_AMOUNT,
        );
        env.storage().persistent().extend_ttl(
            &DataKey::PenaltyRate,
            BALANCE_BUMP_THREASHOLD,
            BALANCE_BUMP_AMOUNT,
        );

        //
        // Here, since the testnet resets every quarter, there is no need to update this allowance
        // but in a mainnet environment it would be necessary to extend the allowance regularly
        // to ensure it is not expired when the contract needs to move funds in name of the admin
        //
        // let expiration_ledger = env.ledger().sequence() + 535_100; // Maximum allowed for testnet = 31 days
        // let allowance_amount = 922_337_203_685_4775807; //maximum allowance

        // let asset_address: Address = get_asset(&env);
        // let token_client = token::Client::new(&env, &asset_address);
        // token_client.approve(
        //     &admin_address,
        //     &env.current_contract_address(),
        //     &allowance_amount,
        //     &expiration_ledger,
        // );
    }
}
