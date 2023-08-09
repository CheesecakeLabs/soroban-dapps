#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, token, xdr::ScVal, Address, Env, Vec};

#[derive(Clone)]
#[contracttype]
pub struct PaymentSpec {
    pub account: Address,
    pub amount: i128,
}

#[contract]
pub struct BulkPayment;

#[contractimpl]
impl BulkPayment {
    pub fn payment(e: Env, token_addr: Address, from: Address, to: Vec<PaymentSpec>) {
        ScVal::read_xdr();
        from.require_auth();
        let token_client = token::Client::new(&e, &token_addr);
        for acc in to.iter() {
            token_client.transfer(&from, &acc.account, &acc.amount);
        }
    }
}
#[cfg(test)]
mod test;
