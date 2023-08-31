use std::collections::{HashMap, VecDeque};

use chrono::{Duration, Timelike, Utc};
use rusqlite::{Connection, Result};
use serde_json::{json, Value};

pub struct SqliteDriver {
    conn: Connection,
}

use crate::{Pool, Token};

pub fn get_connection() -> Result<SqliteDriver> {
    let conn = Connection::open("./database.db").expect("error opening sqlite database file");
    Ok(SqliteDriver { conn })
}

impl SqliteDriver {
    pub fn create_database(&self) -> Result<()> {
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS token (
              id          INTEGER PRIMARY KEY,
              contract_id VARCHAR(60),
              symbol      VARCHAR(12),
              decimals    INTEGER,
              xlm_value   INTEGER,
              is_share    INTEGER DEFAULT 0
          )",
            (),
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS pool (
              id          INTEGER PRIMARY KEY,
              contract_id VARCHAR(60),
              contract_hash_id VARCHAR(64),
              name        VARCHAR(100),
              liquidity   INTEGER,
              volume      INTEGER,
              fees        INTEGER,
              token_a_id  INTEGER REFERENCES token(id),
              token_b_id  INTEGER REFERENCES token(id),
              token_share_id  INTEGER REFERENCES token(id),
              token_a_reserves INTEGER,
              token_b_reserves INTEGER
          )",
            (),
        )?;

        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS event (
                id INTEGER PRIMARY KEY,
                pool_id  INTEGER REFERENCES pool(id),
                type TEXT CHECK(type IN ('SWAP', 'WITHDRAW', 'DEPOSIT')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                amount_token_a INTEGER,
                amount_token_b INTEGER,
                reserves_a INTEGER,
                reserves_b INTEGER,
                buy_a BOOL
            )",
            (),
        )?;

        Ok(())
    }

    pub fn list_tokens(&self) -> Result<Vec<Token>, rusqlite::Error> {
        let mut stmt = self
            .conn
            .prepare("SELECT id, contract_id, symbol, decimals, xlm_value, is_share FROM token")?;
        let tokens = stmt
            .query_map([], |row| {
                Ok(Token {
                    id: row.get(0)?,
                    contract_id: row.get(1)?,
                    symbol: row.get(2)?,
                    decimals: row.get(3)?,
                    xlm_value: row.get(4)?,
                    is_share: row.get(5)?,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?;

        Ok(tokens)
    }

    pub fn list_pools(&self) -> Result<Vec<Pool>, rusqlite::Error> {
        let twenty_four_hours_ago = Utc::now() - Duration::hours(24);
        let formatted_time = twenty_four_hours_ago.to_rfc3339();

        let mut stmt = self.conn.prepare(
            "
            SELECT 
                p.id, p.contract_id, p.name,
                t1.id AS token_a_id, t1.contract_id AS token_a_contract_id, t1.symbol AS token_a_symbol, t1.decimals AS token_a_decimals, t1.xlm_value AS token_a_xlm_value, t1.is_share AS token_a_is_share,
                t2.id AS token_b_id, t2.contract_id AS token_b_contract_id, t2.symbol AS token_b_symbol, t2.decimals AS token_b_decimals, t2.xlm_value AS token_b_xlm_value, t2.is_share AS token_b_is_share,
                t3.id AS token_share_id, t3.contract_id AS token_share_contract_id, t3.symbol AS token_share_symbol, t3.decimals AS token_share_decimals, t3.xlm_value AS token_share_xlm_value, t3.is_share AS token_share_is_share,
                p.token_a_reserves, p.token_b_reserves,
                COALESCE(e.reserves_a * t1.xlm_value + e.reserves_b * t2.xlm_value, 0) AS reserves,
                COALESCE(SUM(
                    CASE
                        WHEN event.buy_a THEN event.amount_token_b * t2.xlm_value
                        ELSE event.amount_token_a * t1.xlm_value
                    END
                ), 0) AS volume
            FROM pool AS p
            INNER JOIN token AS t1 ON p.token_a_id = t1.id
            INNER JOIN token AS t2 ON p.token_b_id = t2.id
            INNER JOIN token AS t3 ON p.token_share_id = t3.id
            LEFT JOIN event AS e ON e.pool_id = p.id AND e.id = (SELECT MAX(id) FROM event WHERE pool_id = p.id)
            LEFT JOIN event AS event ON event.pool_id = p.id AND event.created_at >= ? AND event.type = 'SWAP'
            GROUP BY p.id, p.contract_id, p.name, t1.id, t1.contract_id, t1.symbol, t1.decimals, t1.xlm_value, t1.is_share,
                     t2.id, t2.contract_id, t2.symbol, t2.decimals, t2.xlm_value, t2.is_share,
                     t3.id, t3.contract_id, t3.symbol, t3.decimals, t3.xlm_value, t3.is_share,
                     p.token_a_reserves, p.token_b_reserves
        ",
        )?;

        let pools = stmt
            .query_map([formatted_time], |row| {
                Ok(Pool {
                    id: row.get(0)?,
                    contract_id: row.get(1)?,
                    name: row.get(2)?,
                    token_a: Token {
                        id: row.get(3)?,
                        contract_id: row.get(4)?,
                        symbol: row.get(5)?,
                        decimals: row.get(6)?,
                        xlm_value: row.get(7)?,
                        is_share: row.get(8)?,
                    },
                    token_b: Token {
                        id: row.get(9)?,
                        contract_id: row.get(10)?,
                        symbol: row.get(11)?,
                        decimals: row.get(12)?,
                        xlm_value: row.get(13)?,
                        is_share: row.get(14)?,
                    },
                    token_share: Token {
                        id: row.get(15)?,
                        contract_id: row.get(16)?,
                        symbol: row.get(17)?,
                        decimals: row.get(18)?,
                        xlm_value: row.get(19)?,
                        is_share: row.get(20)?,
                    },
                    token_a_reserves: row.get(21)?,
                    token_b_reserves: row.get(22)?,
                    liquidity: row.get(23)?,
                    volume: row.get(24)?,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?;

        Ok(pools)
    }

    pub fn get_pool_by_id(&self, id: i32) -> Result<Option<Pool>, rusqlite::Error> {
        let mut stmt = self.conn.prepare(
            "
            SELECT 
                p.id, p.contract_id, p.name,
                t1.id AS token_a_id, t1.contract_id AS token_a_contract_id, t1.symbol AS token_a_symbol, t1.decimals AS token_a_decimals, t1.xlm_value AS token_a_xlm_value, t1.is_share AS token_a_is_share,
                t2.id AS token_b_id, t2.contract_id AS token_b_contract_id, t2.symbol AS token_b_symbol, t2.decimals AS token_b_decimals, t2.xlm_value AS token_b_xlm_value, t2.is_share AS token_b_is_share,
                t3.id AS token_share_id, t3.contract_id AS token_share_contract_id, t3.symbol AS token_share_symbol, t3.decimals AS token_share_decimals, t3.xlm_value AS token_share_xlm_value, t3.is_share AS token_share_is_share,
                p.token_a_reserves, p.token_b_reserves
            FROM pool AS p
            INNER JOIN token AS t1 ON p.token_a_id = t1.id
            INNER JOIN token AS t2 ON p.token_b_id = t2.id
            INNER JOIN token AS t3 ON p.token_share_id = t3.id
            WHERE p.id = ?
        ",
        )?;

        let pool = stmt.query_row([id], |row| {
            Ok(Pool {
                id: row.get(0)?,
                contract_id: row.get(1)?,
                name: row.get(2)?,
                token_a: Token {
                    id: row.get(3)?,
                    contract_id: row.get(4)?,
                    symbol: row.get(5)?,
                    decimals: row.get(6)?,
                    xlm_value: row.get(7)?,
                    is_share: row.get(8)?,
                },
                token_b: Token {
                    id: row.get(9)?,
                    contract_id: row.get(10)?,
                    symbol: row.get(11)?,
                    decimals: row.get(12)?,
                    xlm_value: row.get(13)?,
                    is_share: row.get(14)?,
                },
                token_share: Token {
                    id: row.get(15)?,
                    contract_id: row.get(16)?,
                    symbol: row.get(17)?,
                    decimals: row.get(18)?,
                    xlm_value: row.get(19)?,
                    is_share: row.get(20)?,
                },
                token_a_reserves: row.get(21)?,
                token_b_reserves: row.get(22)?,
                liquidity: 0,
                volume: 0,
            })
        });

        Ok(Some(pool?))
    }

    pub fn get_tvl(&self) -> Result<u64, rusqlite::Error> {
        let mut stmt = self.conn.prepare(
            "
            SELECT
                COALESCE(SUM(e.reserves_a * t1.xlm_value + e.reserves_b * t2.xlm_value), 0) AS total_tvl
            FROM
                event e
            JOIN
                pool p ON e.pool_id = p.id
            JOIN
                token t1 ON p.token_a_id = t1.id
            JOIN
                token t2 ON p.token_b_id = t2.id
            WHERE
                e.id = (SELECT MAX(id) FROM event WHERE pool_id = p.id);
        ",
        )?;

        let result = stmt.query_row([], |row| row.get(0))?;

        Ok(result)
    }

    pub fn get_total_volume_24h(&self) -> Result<u64, rusqlite::Error> {
        let twenty_four_hours_ago = Utc::now() - Duration::hours(24);
        let formatted_time = twenty_four_hours_ago.to_rfc3339();

        let mut stmt = self.conn.prepare(
            "
                SELECT COALESCE(SUM(
                    CASE
                        WHEN e.buy_a THEN e.amount_token_b* token_b.xlm_value
                        ELSE e.amount_token_a * token_a.xlm_value
                    END
                ), 0) AS volume
                FROM event e
                JOIN pool p ON e.pool_id = p.id
                JOIN token token_a ON p.token_a_id = token_a.id
                JOIN token token_b ON p.token_b_id = token_b.id
                WHERE e.type = 'SWAP' AND e.created_at >= ?;
            ",
        )?;

        let result = stmt.query_row([formatted_time], |row| row.get(0))?;

        Ok(result)
    }

    pub fn get_volume_chart_data(&self) -> Result<serde_json::Value, rusqlite::Error> {
        let now = Utc::now();
        let six_hours_ago = now - Duration::hours(6);

        let mut stmt = self.conn.prepare(
            "
            SELECT p.id, COALESCE(SUM(
                CASE
                    WHEN e.buy_a THEN e.amount_token_b * token_b.xlm_value
                    ELSE e.amount_token_a * token_a.xlm_value
                END
            ), 0) AS volume
            FROM event e
            JOIN pool p ON e.pool_id = p.id
            JOIN token token_a ON p.token_a_id = token_a.id
            JOIN token token_b ON p.token_b_id = token_b.id
            WHERE e.type = 'SWAP' AND e.created_at >= ?;
    ",
        )?;
        println!("{:?}", six_hours_ago.hour());
        println!("{:?}", now.hour());
        let rows = stmt.query_map([six_hours_ago.to_rfc3339()], |row| {
            println!("{:?}", row);
            Ok((
                row.get::<_, i32>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, f64>(2)?,
            ))
        })?;

        let mut grouped_data: HashMap<i32, Vec<f64>> = HashMap::new();

        let pool_ids = vec![1, 2, 3];

        for hour in six_hours_ago.hour()..=now.hour() {
            for pool_id in pool_ids.clone() {
                grouped_data.entry(pool_id).or_insert(vec![0.0; 6]);
            }
        }

        println!("{:?}", grouped_data);

        for row in rows {
            println!("{:?}", row);
            let hour = 1;
            let (pool_id, volume) = row.unwrap();
            let parsed_hour: i32 = hour.parse().unwrap_or(0);

            if parsed_hour >= six_hours_ago.hour() as i32 && parsed_hour <= now.hour() as i32 {
                let interval_index = (parsed_hour - six_hours_ago.hour() as i32) as usize;
                let pool_volumes = grouped_data.entry(pool_id).or_default();
                pool_volumes[interval_index] += volume;
            }
        }

        // Create the response data in the desired format
        let response_data = pool_ids
            .iter()
            .map(|&pool_id| {
                let pool_volumes = grouped_data.get(&pool_id).unwrap();
                json!({
                    "pool_id": pool_id,
                    "volume": pool_volumes.to_vec(),
                })
            })
            .collect::<Vec<Value>>();

        Ok(json!({
            "intervals": ((six_hours_ago.hour() as i32)..=(now.hour() as i32)).collect::<Vec<i32>>(),
            "data": response_data,
        }))
    }
}
