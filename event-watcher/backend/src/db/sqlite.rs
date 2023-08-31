use chrono::{Duration, Utc};
use rusqlite::{Connection, Result};

pub struct SqliteDriver {
    conn: Connection,
}

use crate::{Pool, Token};

pub struct EventRecord {
    pub ledger: u32,
    pub event_id: String,
    pub contract_id: String,
    pub topic_1: String,
    pub topic_2: String,
    pub topic_3: String,
    pub topic_4: String,
    pub xdr_data: String,
}

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

    pub fn insert_event(&self, event: &EventRecord) -> Result<()> {
        self.conn.execute(
            "INSERT INTO rpc_event (
        ledger, event_id, contract_id, topic_1, topic_2, topic_3, topic_4, xdr_data
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            (
                event.ledger,
                &event.event_id,
                &event.contract_id,
                &event.topic_1,
                &event.topic_2,
                &event.topic_3,
                &event.topic_4,
                &event.xdr_data,
            ),
        )?;

        Ok(())
    }

    pub fn get_last_ledger(&self) -> Result<u32> {
        /*let mut stmt = self.conn.prepare("SELECT max(ledger) FROM rpc_event")?;
        let query_row = stmt.query_row([], |row: &Row<'_>| -> Row { row });

        let row = match query_row {
          Ok(r) => r,
          Err(QueryReturnedNoRows) => return Ok(0), // if no rows, we just return 0 to represent that there's no value
          Err(e) => return Err(e),
        };

        match row.get::<usize, u32>(0) {
          Ok(v) => return Ok(v),
          Err(e) => return Err(e),
        }*/

        let ledger =
            match self
                .conn
                .query_row::<u32, _, _>("SELECT max(ledger) FROM rpc_event", [], |row| row.get(0))
            {
                Ok(r) => r,
                Err(rusqlite::Error::QueryReturnedNoRows) => return Ok(0), // if no rows, we just return 0 to represent that there's no value
                Err(e) => return Err(e),
            };

        Ok(ledger)
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
                ), 0) AS volume,
                users
            FROM pool AS p
            LEFT JOIN event AS e ON e.pool_id = p.id
            LEFT JOIN (SELECT user, count(DISTINCT user) as users
                FROM event
                GROUP BY pool_id) C ON e.user = C.user
            INNER JOIN token AS t1 ON p.token_a_id = t1.id
            INNER JOIN token AS t2 ON p.token_b_id = t2.id
            INNER JOIN token AS t3 ON p.token_share_id = t3.id
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
}
