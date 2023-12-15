//028dd51e1bb7722fb3bae3528fe698ad97f752e30284ce1506a8fe9e2ed5c7a5
#![no_std]
use soroban_sdk::{contract, contractimpl, Address, BytesN, Env, IntoVal, Symbol, Val, Vec};

#[contract]
pub struct Deployer;

#[contractimpl]
impl Deployer {
    #[allow(clippy::too_many_arguments)]
    pub fn deploy(
        env: Env,
        wasm_hash: BytesN<32>,
        salt: BytesN<32>,
        admin: Address,
        asset: Address,
        term: u64,
        compound_step: u64,
        yield_rate: u64,
        min_deposit: i128,
        penalty_rate: u64,
        allowance_period: u32,
    ) -> Address {
        // Skip authorization if deployer is the current contract.
        if admin != env.current_contract_address() {
            admin.require_auth();
        }

        // Deploy the contract using the uploaded Wasm with given hash.
        let deployed_address = env
            .deployer()
            .with_address(admin.clone(), salt)
            .deploy(wasm_hash);

        let init_fn_args: Vec<Val> = (
            admin as Address,
            asset as Address,
            term as u64,
            compound_step as u64,
            yield_rate as u64,
            min_deposit as i128,
            penalty_rate as u64,
            allowance_period as u32,
        )
            .into_val(&env);
        let _res: Val = env.invoke_contract(
            &deployed_address,
            &Symbol::new(&env, "initialize"),
            init_fn_args,
        );

        deployed_address
    }
}
