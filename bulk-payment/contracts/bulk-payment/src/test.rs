use crate::{token, BulkPayment, BulkPaymentClient, PaymentSpec};
use soroban_sdk::{testutils::Address as _, Address, Env, Vec};

#[test]
fn hello() {
    let e = Env::default();

    e.mock_all_auths();

    let contract_id = e.register_contract(None, BulkPayment);
    let client = BulkPaymentClient::new(&e, &contract_id);

    let admin = Address::random(&e);
    let token = token::Client::new(&e, &e.register_stellar_asset_contract(admin.clone()));
    let token_admin = token::AdminClient::new(&e, &token.address);

    let from = Address::random(&e);
    let acc1 = Address::random(&e);
    let acc2 = Address::random(&e);
    let acc3 = Address::random(&e);

    token_admin.mint(&from, &1000);

    let recipients = [
        PaymentSpec {
            account: acc1.clone(),
            amount: 100,
        },
        PaymentSpec {
            account: acc2.clone(),
            amount: 10,
        },
        PaymentSpec {
            account: acc3.clone(),
            amount: 50,
        },
    ];

    client.payment(&token.address, &from, &Vec::from_array(&e, recipients));

    assert_eq!(token.balance(&acc1), 100);
    assert_eq!(token.balance(&acc2), 10);
    assert_eq!(token.balance(&acc3), 50);
}
