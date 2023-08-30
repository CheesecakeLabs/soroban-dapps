mod db;
mod deserializer;
mod event_processor;

use event_processor::EventProcessor;
use ingest::{CaptiveCore, IngestionConfig, SupportedNetwork};
use stellar_xdr::next::{LedgerCloseMeta, TransactionMeta};

const TARGET_SEQ: u32 = 387468;

pub struct Event {
    pub pool_id: u32,
    pub event_type: String,
    pub amount_token_a: i128,
    pub amount_token_b: i128,
    pub reserves_a: i128,
    pub reserves_b: i128,
    pub buy_a: bool,
}
#[derive(Clone)]
pub struct Pool {
    pub id: u32,
    pub contract_hash_id: String,
}

pub fn main() {
    let conn = match db::get_connection() {
        Ok(conn) => conn,
        Err(e) => panic!("database error: {:?}", e),
    };
    let pools = conn.list_pools().unwrap();

    let event_processor = EventProcessor::new(pools);

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
                                        if let Some(pool) =
                                            event_processor.get_pool_from_event(event)
                                        {
                                            println!(
                                                "Found event from Pool: {:?}\n",
                                                pool.contract_hash_id
                                            );
                                            if let Some(event_data) =
                                                event_processor.deserialize_event(event, pool)
                                            {
                                                let _ = conn.create_event(&event_data);
                                                println!("Event saved!\n");
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
