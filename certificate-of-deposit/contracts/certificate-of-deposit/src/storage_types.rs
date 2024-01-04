use soroban_sdk::{contracttype, Address};


pub const PERCENTAGE_MULTIPLIER: i128 = 10_000; // 1 unit = 0.01%
pub(crate) const BALANCE_BUMP_AMOUNT: u32 = 518400; // 30 days (testnet limits to 31 days)
pub(crate) const BALANCE_BUMP_THREASHOLD: u32 = 120960; // 7 days

#[derive(Clone)]
#[contracttype]
pub struct DepositData {
    pub amount: i128,
    pub timestamp: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,               // Address
    Asset,               // Address
    CompoundStep,         // u64 -> seconds
    Term,                // u64 -> seconds
    YieldRate,           // u64 -> 1 unit represents 0.01%
    MinDeposit,          // i128
    PenaltyRate,         // u64 -> 1 unit represents 0.01%
    Deposit(Address)     // DepositData
}