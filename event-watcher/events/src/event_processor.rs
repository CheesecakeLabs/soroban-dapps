use std::str::FromStr;
use stellar_xdr::next::{ContractEvent, ContractEventBody, ContractEventV0, Hash, ScVal};

use crate::{deserializer::EventDeserializer, Event, Pool};

pub struct EventProcessor {
    pools: Vec<Pool>,
}

impl EventProcessor {
    pub fn new(pools: Vec<Pool>) -> Self {
        EventProcessor { pools: pools }
    }

    pub fn get_pool_from_event(&self, event: &ContractEvent) -> Option<Pool> {
        if let Some(contract_id) = &event.contract_id {
            for pool in self.pools.clone() {
                if contract_id == &Hash::from_str(pool.contract_hash_id.as_str()).unwrap() {
                    return Some(pool);
                }
            }
        }
        None
    }

    pub fn deserialize_event(&self, event: &ContractEvent, pool: Pool) -> Option<Event> {
        let ContractEventBody::V0(v0) = &event.body;
        let event_type = self.extract_event_type(&v0);
        let data = self.extract_event_data(&v0.data);

        match event_type.as_str() {
            "DEPOSIT" | "WITHDRAW" => Some(self.create_event(event_type, pool.id, data, false)),
            "SWAP" => {
                let buy_a = self.extract_buy_a(&v0.data);
                Some(self.create_event(event_type, pool.id, data, buy_a))
            }
            _ => None,
        }
    }

    fn create_event(
        &self,
        event_type: String,
        pool_id: u32,
        data: (i128, i128, i128, i128),
        buy_a: bool,
    ) -> Event {
        let (amount_token_a, amount_token_b) = if buy_a {
            (data.0, data.1)
        } else {
            (data.1, data.0)
        };
        Event {
            event_type,
            pool_id,
            amount_token_a,
            amount_token_b,
            reserves_a: data.2,
            reserves_b: data.3,
            buy_a,
        }
    }

    fn extract_event_type(&self, v0: &ContractEventV0) -> String {
        EventDeserializer::extract_topic(v0, 0)
            .and_then(|topic| topic.string_value())
            .map(|value| value.to_uppercase())
            .unwrap_or("OTHER".to_string())
    }

    fn extract_event_data(&self, sc_val: &ScVal) -> (i128, i128, i128, i128) {
        let values: Vec<i128> = (0..4)
            .map(|index| {
                EventDeserializer::extract_data_vec(sc_val, index)
                    .and_then(|value| value.i128_value())
                    .unwrap_or(0)
            })
            .collect();

        match values.as_slice() {
            [val1, val2, val3, val4] => (*val1, *val2, *val3, *val4),
            _ => (0, 0, 0, 0),
        }
    }

    fn extract_buy_a(&self, sc_val: &ScVal) -> bool {
        EventDeserializer::extract_data_vec(sc_val, 4)
            .and_then(|value| value.bool_value())
            .unwrap_or(false)
    }
}
