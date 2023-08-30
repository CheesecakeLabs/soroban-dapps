use stellar_xdr::next::{ContractEventV0, ScSymbol, ScVal, ScVec};
pub enum EventValue {
    String(String),
    Bool(bool),
    I128(i128),
}

impl EventValue {
    pub fn string_value(self) -> Option<String> {
        match self {
            EventValue::String(value) => Some(value),
            _ => None,
        }
    }

    pub fn bool_value(self) -> Option<bool> {
        match self {
            EventValue::Bool(value) => Some(value),
            _ => None,
        }
    }

    pub fn i128_value(self) -> Option<i128> {
        match self {
            EventValue::I128(value) => Some(value),
            _ => None,
        }
    }
}
pub struct EventDeserializer {}

impl EventDeserializer {
    pub fn extract_topic(v0: &ContractEventV0, index: usize) -> Option<EventValue> {
        if let Some(topic) = v0.topics.get(index) {
            match topic {
                ScVal::Symbol(ScSymbol(symbol)) => {
                    Some(EventValue::String(symbol.to_string().unwrap()))
                }
                ScVal::Bool(value) => Some(EventValue::Bool(*value)),
                _ => None,
            }
        } else {
            None
        }
    }

    pub fn extract_data_vec(sc_val: &ScVal, index: usize) -> Option<EventValue> {
        if let ScVal::Vec(Some(ScVec(vec_m))) = sc_val {
            match &vec_m[index] {
                ScVal::Bool(value) => Some(EventValue::Bool(*value)),
                ScVal::I128(value) => Some(EventValue::I128(value.try_into().unwrap())),
                _ => None,
            }
        } else {
            None
        }
    }
}
