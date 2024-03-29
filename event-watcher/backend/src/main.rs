use chrono::NaiveDateTime;
use rusqlite::Result;
use std::{collections::HashMap, sync::Arc};

use serde::{Deserialize, Serialize};
use tokio;
use warp::Filter;

mod db;
mod get_events;

#[derive(Debug, Serialize, Deserialize)]
pub struct Token {
    id: i32,
    contract_id: String,
    symbol: String,
    decimals: i32,
    xlm_value: i32,
    is_share: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Pool {
    id: i32,
    contract_id: String,
    name: String,
    liquidity: i64,
    volume: i64,
    token_a: Token,
    token_b: Token,
    token_share: Token,
    token_a_reserves: i64,
    token_b_reserves: i64,
    users: i32,
}

#[derive(Debug, Serialize, Deserialize)]
struct SwapEventInfo {
    volume: i64,
    pool_id: i32,
    pool_name: String,
    event_hour: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct VolumeChartData {
    hour: String,
    total: i64,
}

#[derive(Debug, Serialize, Deserialize)]
struct PoolData {
    pool_id: i32,
    pool_name: String,
    volume: Vec<VolumeChartData>,
}

async fn list_pools_handler() -> Result<impl warp::Reply, warp::Rejection> {
    match db::get_connection() {
        Ok(conn) => {
            let items = conn.list_pools();
            match items {
                Ok(items) => {
                    return Ok(warp::reply::json(&items));
                }
                Err(e) => panic!("database error: {:?}", e),
            };
        }
        Err(e) => panic!("database error: {:?}", e),
    };
}

async fn list_tokens_handler() -> Result<impl warp::Reply, warp::Rejection> {
    match db::get_connection() {
        Ok(conn) => {
            let items = conn.list_tokens();
            match items {
                Ok(items) => {
                    return Ok(warp::reply::json(&items));
                }
                Err(e) => panic!("database error: {:?}", e),
            };
        }
        Err(e) => panic!("database error: {:?}", e),
    };
}

async fn get_pool_by_id_handler(id: i32) -> Result<impl warp::Reply, warp::Rejection> {
    match db::get_connection() {
        Ok(conn) => {
            let item = conn.get_pool_by_id(id);
            match item {
                Ok(item) => {
                    return Ok(warp::reply::json(&item));
                }
                Err(e) => panic!("database error: {:?}", e),
            };
        }
        Err(e) => panic!("database error: {:?}", e),
    };
}

async fn get_tvl_handler() -> Result<impl warp::Reply, warp::Rejection> {
    match db::get_connection() {
        Ok(conn) => {
            let item = conn.get_tvl();
            match item {
                Ok(item) => {
                    return Ok(warp::reply::json(&item));
                }
                Err(e) => panic!("database error: {:?}", e),
            };
        }
        Err(e) => panic!("database error: {:?}", e),
    };
}

async fn get_total_volume_24h_handler() -> Result<impl warp::Reply, warp::Rejection> {
    match db::get_connection() {
        Ok(conn) => {
            let item = conn.get_total_volume_24h();
            match item {
                Ok(item) => {
                    return Ok(warp::reply::json(&item));
                }
                Err(e) => panic!("database error: {:?}", e),
            };
        }
        Err(e) => panic!("database error: {:?}", e),
    };
}

async fn get_volume_chart_data_handler() -> Result<impl warp::Reply, warp::Rejection> {
    match db::get_connection() {
        Ok(conn) => {
            let events = conn.get_recent_swap_events();
            match events {
                Ok(events) => {
                    // Group events by pool_id, hour, and calculate the total volume
                    let mut pool_data_map: HashMap<(i32, String), HashMap<String, i64>> =
                        HashMap::new();
                    for event in &events {
                        let pool_key = (event.pool_id, event.pool_name.clone());
                        let volume_map = pool_data_map.entry(pool_key).or_insert(HashMap::new());

                        let total_volume = volume_map.entry(event.event_hour.clone()).or_insert(0);
                        *total_volume += event.volume;
                    }

                    // Create the final response structure
                    let response_data: Vec<PoolData> = pool_data_map
                        .into_iter()
                        .map(|((pool_id, pool_name), volume_map)| {
                            let volume = volume_map
                                .into_iter()
                                .map(|(hour, total)| VolumeChartData { hour, total })
                                .collect();
                            PoolData {
                                pool_id,
                                pool_name,
                                volume,
                            }
                        })
                        .collect();

                    return Ok(warp::reply::json(&response_data));
                }
                Err(e) => panic!("database error: {:?}", e),
            };
        }
        Err(e) => panic!("database error: {:?}", e),
    };
}

#[tokio::main]
async fn main() {
    let conn = match db::get_connection() {
        Ok(conn) => Arc::new(conn),
        Err(e) => panic!("database error: {:?}", e),
    };

    // Initialize the database
    match conn.create_database() {
        Ok(()) => (),
        Err(e) => panic!("database error {}", e),
    };

    // Routes
    let list_pools_route = warp::path("pools")
        .and(warp::get())
        .and_then(list_pools_handler);

    let list_tokens_route = warp::path("tokens")
        .and(warp::get())
        .and_then(list_tokens_handler);

    let get_pool_route = warp::path!("pools" / i32)
        .and(warp::get())
        .and_then(get_pool_by_id_handler);

    let get_tvl_route = warp::path!("metrics" / "tvl")
        .and(warp::get())
        .and_then(get_tvl_handler);

    let get_total_volume_24h_route = warp::path!("metrics" / "total-volume-24")
        .and(warp::get())
        .and_then(get_total_volume_24h_handler);

    let get_volume_chart_data_route = warp::path!("metrics" / "volume-chart")
        .and(warp::get())
        .and_then(get_volume_chart_data_handler);

    let cors = warp::cors().allow_any_origin();
    let routes = get_pool_route
        .or(list_tokens_route)
        .or(list_pools_route)
        .or(get_tvl_route)
        .or(get_total_volume_24h_route)
        .or(get_volume_chart_data_route)
        .with(cors);

    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}
