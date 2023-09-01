use std::collections::{HashMap, VecDeque};

use chrono::{Duration, Timelike, Utc};
use rusqlite::{Connection, Result};
use serde_json::{json, Value};

pub struct SqliteDriver {
    conn: Connection,
}

use crate::{Pool, SwapEventInfo, Token};

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
                buy_a BOOL,
                user INTEGER
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
                COALESCE(last_event.reserves_a * t1.xlm_value + last_event.reserves_b * t2.xlm_value, 0) AS reserves,
                COALESCE(SUM(
                    CASE
                        WHEN swap_event.buy_a THEN swap_event.amount_token_b * t2.xlm_value
                        ELSE swap_event.amount_token_a * t1.xlm_value
                    END
                ), 0) AS volume,
                COALESCE(user_count, 0) AS users
            FROM pool AS p
            INNER JOIN token AS t1 ON p.token_a_id = t1.id
            INNER JOIN token AS t2 ON p.token_b_id = t2.id
            INNER JOIN token AS t3 ON p.token_share_id = t3.id
            LEFT JOIN event AS last_event ON last_event.pool_id = p.id AND last_event.id = (SELECT MAX(id) FROM event WHERE pool_id = p.id)
            LEFT JOIN event AS swap_event ON swap_event.pool_id = p.id AND swap_event.created_at >= ? AND swap_event.type = 'SWAP'
            LEFT JOIN (SELECT pool_id, COUNT(DISTINCT user) AS user_count FROM event WHERE type IN ('DEPOSIT', 'SWAP') GROUP BY pool_id) AS user_counts ON user_counts.pool_id = p.id
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
                    liquidity: row.get(23).unwrap_or(0),
                    volume: row.get(24).unwrap_or(0),
                    users: row.get(25).unwrap_or(0),
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
                p.token_a_reserves, p.token_b_reserves,
                users
            FROM pool AS p
            LEFT JOIN event AS e ON e.pool_id = p.id
            LEFT JOIN (SELECT user, count(DISTINCT user) as users
                FROM event
                GROUP BY pool_id) C ON e.user = C.user
            INNER JOIN token AS t1 ON p.token_a_id = t1.id
            INNER JOIN token AS t2 ON p.token_b_id = t2.id
            INNER JOIN token AS t3 ON p.token_share_id = t3.id
            WHERE p.id = ?",
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
                users: row.get(23).unwrap_or(0),
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

    pub fn get_recent_swap_events(&self) -> Result<Vec<SwapEventInfo>, rusqlite::Error> {
        let twelve_hours_ago = Utc::now() - Duration::hours(12);

        let mut stmt = self.conn.prepare(
            "
            SELECT
                CASE
                    WHEN e.buy_a THEN e.amount_token_b * t2.xlm_value
                    ELSE e.amount_token_a * t1.xlm_value
                END AS volume,
                e.pool_id,
                p.name,
                strftime('%H', e.created_at) AS event_hour
            FROM
                event e
            JOIN
                pool p ON e.pool_id = p.id
            JOIN
                token t1 ON p.token_a_id = t1.id
            JOIN
                token t2 ON p.token_b_id = t2.id
            WHERE
                e.type = 'SWAP'
                AND e.created_at >= datetime(?, 'utc')
            ORDER BY
                e.created_at DESC;
        ",
        )?;

        let formatted_time = twelve_hours_ago.format("%Y-%m-%d %H:%M:%S");

        let rows = stmt.query_map([formatted_time.to_string()], |row| {
            Ok(SwapEventInfo {
                volume: row.get(0)?,
                pool_id: row.get(1)?,
                pool_name: row.get(2)?,
                event_hour: row.get(3)?,
            })
        })?;

        let mut event_infos = Vec::new();
        for event_info in rows {
            event_infos.push(event_info?);
        }

        Ok(event_infos)
    }
}
