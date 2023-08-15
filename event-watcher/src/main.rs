use reqwest;
use tokio;
use rusqlite;

use soroban_sdk::xdr::{next::ScVal, ReadXdr};

mod get_events;
mod db;
use crate::get_events::{request_payload, exec_request};


#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
  let pattern = std::env::args().nth(1).expect("no pattern given");

  match pattern.as_str() {
    // Initialize the database
    "init" => {
      match db::get_connection() {
        Ok(conn) => {
          let _ = conn.create_database();
        },
        Err(e) => println!("{:?}", e)
      };
    },
    _ => println!("invalid option"),
  }

    /*let contract_ids = vec![String::from("4a8985222f0a07441d2aa337a980a6bf3e7aca94f6efc469ba6a5a56f7a63b36")];
    let payload = request_payload(318000, 329254, contract_ids);

    let response = match exec_request(payload).await {
      Ok(v) => v,
      Err(e) => return Err(e)
    };
    
    let topic1 = ScVal::from_xdr_base64(&response.result.events[0].topic[0]).expect("invalid ScVal xdr");
    println!("{:?} {:?}", topic1, topic1.discriminant());

    let topic2 = ScVal::from_xdr_base64(&response.result.events[0].topic[1]).expect("invalid ScVal xdr");
    println!("{:?}", topic2);

    let topic3 = ScVal::from_xdr_base64(&response.result.events[0].topic[2]).expect("invalid ScVal xdr");
    println!("{:?}", topic3);

    let sc_val = ScVal::from_xdr_base64(&response.result.events[0].value.xdr).expect("invalid ScVal xdr");
    println!("{:?}", sc_val);


    let topic4 = ScVal::from_xdr_base64(&response.result.events[1].topic[0]).expect("invalid ScVal xdr");
    println!("{:?} {:?}", topic4, topic4.discriminant());

    let topic5 = ScVal::from_xdr_base64(&response.result.events[1].topic[1]).expect("invalid ScVal xdr");
    println!("{:?}", topic5);

    let topic6 = ScVal::from_xdr_base64(&response.result.events[1].topic[2]).expect("invalid ScVal xdr");
    println!("{:?}", topic6);

    let sc_val1 = ScVal::from_xdr_base64(&response.result.events[1].value.xdr).expect("invalid ScVal xdr");
    println!("{:?}", sc_val1);*/

    Ok(())
}


