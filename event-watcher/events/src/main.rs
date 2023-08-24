use std::str::FromStr;

use ingest::{CaptiveCore, IngestionConfig, SupportedNetwork};
use serde_json;
use stellar_xdr::next::{
    ContractEventBody, Hash, LedgerCloseMeta, ScSymbol, ScVal, ScVec, TransactionMeta,
};
mod db;

const TARGET_SEQ: u32 = 387468;

pub struct Event {
    pub pool_id: u32,
    pub event_type: String,
    pub amount_token_a: u64,
    pub amount_token_b: u64,
    pub reserves_a: u64,
    pub reserves_b: u64,
}

pub struct Pool {
    pub id: u32,
    pub contract_hash_id: String,
}

fn extract_event_data(sc_val: &ScVal) -> (u64, u64, u64, u64) {
    if let ScVal::Vec(Some(ScVec(vec_m))) = sc_val {
        if let ScVal::I128(i128_parts_1) = &vec_m[0] {
            if let ScVal::I128(i128_parts_2) = &vec_m[1] {
                if let ScVal::I128(i128_parts_3) = &vec_m[2] {
                    if let ScVal::I128(i128_parts_4) = &vec_m[3] {
                        return (
                            i128_parts_1.lo,
                            i128_parts_2.lo,
                            i128_parts_3.lo,
                            i128_parts_4.lo,
                        );
                    }
                }
            }
        }
    }

    (0, 0, 0, 0)
}

pub fn main() {
    let conn = match db::get_connection() {
        Ok(conn) => conn,
        Err(e) => panic!("database error"),
    };

    let pools = conn.list_pools().unwrap();

    let config = IngestionConfig {
        executable_path: "/usr/local/bin/stellar-core".to_string(),
        context_path: Default::default(),
        network: SupportedNetwork::Futurenet,
        bounded_buffer_size: None,
    };

    let mut captive_core = CaptiveCore::new(config);

    let receiver = captive_core.start_online_no_range().unwrap();

    println!(
        "Capturing all events. When a contract event will be emitted it will be printed to stdout"
    );
    for result in receiver.iter() {
        let ledger = result.ledger_close_meta.unwrap().ledger_close_meta;
        match &ledger {
            LedgerCloseMeta::V1(v1) => {
                let ledger_seq = v1.ledger_header.header.ledger_seq;
                if ledger_seq == TARGET_SEQ {
                    println!("Reached target ledger, closing");
                    captive_core.close_runner_process().unwrap();

                    std::process::exit(0)
                }

                for tx_processing in v1.tx_processing.iter() {
                    match &tx_processing.tx_apply_processing {
                        TransactionMeta::V3(meta) => {
                            if let Some(soroban) = &meta.soroban_meta {
                                if !soroban.events.is_empty() {
                                    for event in soroban.events.iter() {
                                        if let Some(contract_id) = &event.contract_id {
                                            println!("Event from contract: {:?}\n", contract_id);
                                            for pool in &pools {
                                                if contract_id
                                                    == &Hash::from_str(
                                                        pool.contract_hash_id.as_str(),
                                                    )
                                                    .unwrap()
                                                {
                                                    println!(
                                                        "Matching event found: {:?}\n",
                                                        serde_json::to_string_pretty(&event)
                                                    );

                                                    let event_type = match &event.body {
                                                        ContractEventBody::V0(v0) => {
                                                            let data = extract_event_data(&v0.data);
                                                            match &v0.topics[0] {
                                                                ScVal::Symbol(ScSymbol(symbol)) => {
                                                                    match symbol
                                                                        .to_string()
                                                                        .unwrap()
                                                                        .as_ref()
                                                                    {
                                                                        "deposit" => {
                                                                            print!("deposit");
                                                                            let event = Event {
                                                                                event_type:
                                                                                    String::from(
                                                                                        "DEPOSIT",
                                                                                    ),
                                                                                pool_id: pool.id,
                                                                                amount_token_a:
                                                                                    data.0,
                                                                                amount_token_b:
                                                                                    data.1,
                                                                                reserves_a: data.2,
                                                                                reserves_b: data.3,
                                                                            };
                                                                            let _ = conn
                                                                                .create_event(
                                                                                    &event,
                                                                                );
                                                                        }
                                                                        "swap" => {
                                                                            print!("swap");
                                                                            let event = Event {
                                                                                event_type:
                                                                                    String::from(
                                                                                        "SWAP",
                                                                                    ),
                                                                                pool_id: pool.id,
                                                                                amount_token_a:
                                                                                    data.0,
                                                                                amount_token_b:
                                                                                    data.1,
                                                                                reserves_a: data.2,
                                                                                reserves_b: data.3,
                                                                            };
                                                                            let _ = conn
                                                                                .create_event(
                                                                                    &event,
                                                                                );
                                                                        }
                                                                        "withdraw" => {
                                                                            print!("withdraw");
                                                                            let event = Event {
                                                                                event_type:
                                                                                    String::from(
                                                                                        "WITHDRAW",
                                                                                    ),
                                                                                pool_id: pool.id,
                                                                                amount_token_a:
                                                                                    data.0,
                                                                                amount_token_b:
                                                                                    data.1,
                                                                                reserves_a: data.2,
                                                                                reserves_b: data.3,
                                                                            };
                                                                            let _ = conn
                                                                                .create_event(
                                                                                    &event,
                                                                                );
                                                                        }
                                                                        _ => {
                                                                            // Handle other cases
                                                                            println!("No match");
                                                                        }
                                                                    }
                                                                }
                                                                _ => {
                                                                    // Handle other cases
                                                                    println!("No match");
                                                                }
                                                            }

                                                            println!(
                                                                "{:?}",
                                                                extract_event_data(&v0.data)
                                                            )
                                                        }
                                                    };
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        _ => todo!(),
                    }
                }
            }
            _ => (),
        }
    }
}
