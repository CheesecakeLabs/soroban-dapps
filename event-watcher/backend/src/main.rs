use rusqlite::Result;
use std::sync::Arc;

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
    liquidity: i32,
    // volume: i32,
    // fees: i32,
    token_a: Token,
    token_b: Token,
    token_share: Token,
    token_a_reserves: i32,
    token_b_reserves: i32,
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

    let cors = warp::cors().allow_any_origin();
    let routes = get_pool_route
        .or(list_tokens_route)
        .or(list_pools_route)
        .or(get_tvl_route)
        .or(get_total_volume_24h_route)
        .with(cors);

    warp::serve(routes).run(([127, 0, 0, 1], 3030)).await;
}
