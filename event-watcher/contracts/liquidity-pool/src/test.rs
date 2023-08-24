#![cfg(test)]
extern crate std;

use crate::{token, LiquidityPoolClient};

use soroban_sdk::{
    symbol_short,
    testutils::{Address as _, AuthorizedFunction, AuthorizedInvocation},
    Address, BytesN, Env, IntoVal,
};

fn create_token_contract<'a>(e: &Env, admin: &Address) -> token::Client<'a> {
    token::Client::new(e, &e.register_stellar_asset_contract(admin.clone()))
}

fn create_liqpool_contract<'a>(
    e: &Env,
    token_wasm_hash: &BytesN<32>,
    token_a: &Address,
    token_b: &Address,
) -> LiquidityPoolClient<'a> {
    let liqpool = LiquidityPoolClient::new(e, &e.register_contract(None, crate::LiquidityPool {}));
    liqpool.initialize(token_wasm_hash, token_a, token_b);
    liqpool
}

fn install_token_wasm(e: &Env) -> BytesN<32> {
    soroban_sdk::contractimport!(file = "token/soroban_token_contract.wasm");
    e.deployer().upload_contract_wasm(WASM)
}

#[test]
fn test() {
    let e = Env::default();
    e.mock_all_auths();
    e.budget().reset_unlimited();
    let mut admin1 = Address::random(&e);
    let mut admin2 = Address::random(&e);

    let mut token1 = create_token_contract(&e, &admin1);
    let mut token2 = create_token_contract(&e, &admin2);
    if &token2.address < &token1.address {
        std::mem::swap(&mut token1, &mut token2);
        std::mem::swap(&mut admin1, &mut admin2);
    }
    let user1 = Address::random(&e);
    let liqpool = create_liqpool_contract(
        &e,
        &install_token_wasm(&e),
        &token1.address,
        &token2.address,
    );

    let token_share = token::Client::new(&e, &liqpool.share_id());

    token1.mint(&user1, &1000);
    assert_eq!(token1.balance(&user1), 1000);

    token2.mint(&user1, &1000);
    assert_eq!(token2.balance(&user1), 1000);

    liqpool.deposit(&user1, &100, &100, &100, &100);

    assert_eq!(
        e.auths(),
        std::vec![(
            user1.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    liqpool.address.clone(),
                    symbol_short!("deposit"),
                    (&user1, 100_i128, 100_i128, 100_i128, 100_i128).into_val(&e)
                )),
                sub_invocations: std::vec![
                    AuthorizedInvocation {
                        function: AuthorizedFunction::Contract((
                            token1.address.clone(),
                            symbol_short!("transfer"),
                            (&user1, &liqpool.address, 100_i128).into_val(&e)
                        )),
                        sub_invocations: std::vec![]
                    },
                    AuthorizedInvocation {
                        function: AuthorizedFunction::Contract((
                            token2.address.clone(),
                            symbol_short!("transfer"),
                            (&user1, &liqpool.address, 100_i128).into_val(&e)
                        )),
                        sub_invocations: std::vec![]
                    }
                ]
            }
        )]
    );

    assert_eq!(token_share.balance(&user1), 100);
    assert_eq!(token_share.balance(&liqpool.address), 0);
    assert_eq!(token1.balance(&user1), 900);
    assert_eq!(token1.balance(&liqpool.address), 100);
    assert_eq!(token2.balance(&user1), 900);
    assert_eq!(token2.balance(&liqpool.address), 100);
    //e.budget().print();

    liqpool.swap(&user1, &false, &49, &100);
    assert_eq!(
        e.auths(),
        std::vec![(
            user1.clone(),
            AuthorizedInvocation {
                function: AuthorizedFunction::Contract((
                    liqpool.address.clone(),
                    symbol_short!("swap"),
                    (&user1, false, 49_i128, 100_i128).into_val(&e)
                )),
                sub_invocations: std::vec![AuthorizedInvocation {
                    function: AuthorizedFunction::Contract((
                        token1.address.clone(),
                        symbol_short!("transfer"),
                        (&user1, &liqpool.address, 97_i128).into_val(&e)
                    )),
                    sub_invocations: std::vec![]
                }]
            }
        )]
    );

    assert_eq!(token1.balance(&user1), 803);
    assert_eq!(token1.balance(&liqpool.address), 197);
    assert_eq!(token2.balance(&user1), 949);
    assert_eq!(token2.balance(&liqpool.address), 51);
    e.budget().reset_default();
    e.budget().print();
    liqpool.withdraw(&user1, &50, &90, &25);
    e.budget().print();
    liqpool.withdraw(&user1, &50, &90, &25);
    e.budget().print();
    // assert_eq!(
    //     e.auths(),
    //     std::vec![(
    //         user1.clone(),
    //         AuthorizedInvocation {
    //             function: AuthorizedFunction::Contract((
    //                 liqpool.address.clone(),
    //                 symbol_short!("withdraw"),
    //                 (&user1, 100_i128, 197_i128, 51_i128).into_val(&e)
    //             )),
    //             sub_invocations: std::vec![AuthorizedInvocation {
    //                 function: AuthorizedFunction::Contract((
    //                     token_share.address.clone(),
    //                     symbol_short!("transfer"),
    //                     (&user1, &liqpool.address, 100_i128).into_val(&e)
    //                 )),
    //                 sub_invocations: std::vec![]
    //             }]
    //         }
    //     )]
    // );

    // assert_eq!(token1.balance(&user1), 1000);
    // assert_eq!(token2.balance(&user1), 1000);
    // assert_eq!(token_share.balance(&user1), 0);
    // assert_eq!(token1.balance(&liqpool.address), 0);
    // assert_eq!(token2.balance(&liqpool.address), 0);
    // assert_eq!(token_share.balance(&liqpool.address), 0);
}
