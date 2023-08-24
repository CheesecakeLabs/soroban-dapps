use soroban_sdk::{Address, Env, Symbol};

pub(crate) fn deposit(
    e: &Env,
    to: Address,
    amount_a: i128,
    amount_b: i128,
    reserves_a: i128,
    reserves_b: i128,
) {
    let topics = (Symbol::new(e, "deposit"), to);
    e.events()
        .publish(topics, (amount_a, amount_b, reserves_a, reserves_b));
}

pub(crate) fn withdraw(
    e: &Env,
    to: Address,
    amount_a: i128,
    amount_b: i128,
    reserves_a: i128,
    reserves_b: i128,
) {
    let topics = (Symbol::new(e, "withdraw"), to);
    e.events()
        .publish(topics, (amount_a, amount_b, reserves_a, reserves_b));
}

pub(crate) fn swap(
    e: &Env,
    to: Address,
    buy_a: bool,
    sell_amount: i128,
    buy_amount: i128,
    reserves_a: i128,
    reserves_b: i128,
) {
    let topics = (Symbol::new(e, "swap"), to, buy_a);
    e.events()
        .publish(topics, (buy_amount, sell_amount, reserves_a, reserves_b));
}
