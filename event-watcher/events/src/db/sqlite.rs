use rusqlite::{Connection, Result};

use crate::{Event, Pool};

pub struct SqliteDriver {
    conn: Connection,
}

pub fn get_connection() -> Result<SqliteDriver> {
    let conn =
        Connection::open("../backend/database.db").expect("error opening sqlite database file");
    Ok(SqliteDriver { conn })
}

impl SqliteDriver {
    pub fn list_pools(&self) -> Result<Vec<Pool>> {
        let mut stmt = self.conn.prepare("SELECT id, contract_hash_id FROM pool")?;
        let pool_iter = stmt.query_map([], |row| {
            Ok(Pool {
                id: row.get(0)?,
                contract_hash_id: row.get(1)?,
            })
        })?;

        let pools: Result<Vec<Pool>> = pool_iter.collect();
        pools
    }

    pub fn create_event(&self, event: &Event) -> Result<()> {
        // i128 values are converted to i64 because Sqlite doesn't support
        // this type. In a real application this should not be done as there
        // may be a loss of information.
        self.conn.execute(
            "INSERT INTO event (pool_id, type, amount_token_a, amount_token_b, reserves_a, reserves_b, buy_a, user)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (
                event.pool_id,
                &event.event_type,
                self.i128_to_i64(event.amount_token_a),
                self.i128_to_i64(event.amount_token_b),
                self.i128_to_i64(event.reserves_a),
                self.i128_to_i64(event.reserves_b),
                event.buy_a,
                &event.user
            ),
        )?;

        Ok(())
    }

    fn i128_to_i64(&self, value: i128) -> i64 {
        if value > i64::MAX as i128 {
            i64::MAX
        } else if value < i64::MIN as i128 {
            i64::MIN
        } else {
            value as i64
        }
    }
}
