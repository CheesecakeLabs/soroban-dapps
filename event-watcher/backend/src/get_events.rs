use reqwest;

use serde::Deserialize;
use serde::Serialize;

// Request payload structure
// Example:
//
// {
//     "jsonrpc": "2.0",
//     "id": 8675309,
//     "method": "getEvents",
//     "params": {
//         "startLedger": "292000",
//         "endLedger": "307215",
//         "filters": [
//         {
//             "type": "contract",
//             "contractIds": [
//             "4a8985222f0a07441d2aa337a980a6bf3e7aca94f6efc469ba6a5a56f7a63b36"
//             ],
//             "topics": [
//             ["*", "*", "*"]
//             ]
//         }
//         ],
//         "pagination": {
//         "limit": 100
//         }
//     }
// }

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetEventsRequest {
    pub jsonrpc: String,
    pub id: i64,
    pub method: String,
    pub params: Params,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Params {
    pub start_ledger: String,
    pub end_ledger: String,
    pub filters: Vec<GetEventsFilter>,
    pub pagination: GetEventsPagination,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetEventsFilter {
    #[serde(rename = "type")]
    pub type_field: String,
    pub contract_ids: Vec<String>,
    // pub topics: Vec<Vec<String>>,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetEventsPagination {
    pub limit: i64,
}

// Response payload structures.
// Example:
//
// {
// 	"jsonrpc": "2.0",
// 	"id": 8675309,
// 	"result": {
// 		"events": [
// 			{
// 				"type": "contract",
// 				"ledger": "291445",
// 				"ledgerClosedAt": "2023-08-08T13:36:43Z",
// 				"contractId": "bfde9d3bf5b5eb5993ce79459c92c7f6edb16948c154495f43a8a54af41f6dc9",
// 				"id": "0001251746743590912-0000000012",
// 				"pagingToken": "0001251746743590912-0000000012",
// 				"topic": [
// 					"AAAADwAAAARtaW50",
// 					"AAAAEgAAAAH7L0oUC01mKqOhcm36iz3ZhjMKGz9TuxnxzOIwc25CLw==",
// 					"AAAAEgAAAAAAAAAAqPaea+GyqpBs7+XTWhp8nLQSjat/1yYHaee1uZpaTzo="
// 				],
// 				"value": {
// 					"xdr": "AAAACgAAAAAAAAAAAAAAAAX14QA="
// 				},
// 				"inSuccessfulContractCall": true
// 			}
// 		],
// 		"latestLedger": "307234"
// 	}
// }

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetEventsResponse {
    pub jsonrpc: String,
    pub id: i64,
    pub result: ResponseResult,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ResponseResult {
    pub events: Vec<Event>,
    pub latest_ledger: String,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Event {
    #[serde(rename = "type")]
    pub type_field: String,
    pub ledger: String,
    pub ledger_closed_at: String,
    pub contract_id: String,
    pub id: String,
    pub paging_token: String,
    pub topic: Vec<String>,
    pub value: EventValue,
    pub in_successful_contract_call: bool,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EventValue {
    pub xdr: String,
}


// request_payload creates a default RPC payload for the 
// getEvents method, it accepts start and end legder numbers,
// and the contract_ids to be searched.
pub fn request_payload(start_ledger: i32, end_ledger: i32, contract_ids: Vec<String>) -> GetEventsRequest {
    GetEventsRequest { 
        jsonrpc: "2.0".to_string() ,
        id: 8675309,
        method: "getEvents".to_string(),
        params: Params { 
            start_ledger: start_ledger.to_string(),
            end_ledger: end_ledger.to_string(),
            filters: vec![
                GetEventsFilter{
                    type_field: "contract".to_string(),
                    contract_ids,
                    /*topics: vec![
                        vec!["*".to_string(), "*".to_string(), "*".to_string()]
                    ]*/
                },
            ],
            pagination: GetEventsPagination{ limit: 100 } 
        }
    }
}

// exec_request makes the http POST request to the RPC server,
// it expects a valid getEvents method payload.
pub async fn exec_request(request_payload: GetEventsRequest) -> Result<GetEventsResponse, reqwest::Error> {
    let client = reqwest::Client::new();

    let future = client
        .post("https://rpc-futurenet.stellar.org:443")
        .header("Content-Type", "application/json")
        .json::<GetEventsRequest>(&request_payload)
        .send();

    let response = match future.await {
        Ok(v) => v,
        Err(e) => return Err(e),
    };

    let events_response = match response.json::<GetEventsResponse>().await {
        Ok(v) => v,
        Err(e) => return Err(e),
    };

    Ok(events_response)
}
