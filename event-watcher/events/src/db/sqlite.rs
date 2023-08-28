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
        self.conn.execute(
            "INSERT INTO event (pool_id, type, amount_token_a, amount_token_b, reserves_a, reserves_b, buy_a)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            (
                event.pool_id,
                &event.event_type,
                event.amount_token_a,
                event.amount_token_b,
                event.reserves_a,
                event.reserves_b,
                event.buy_a
            ),
        )?;

        Ok(())
    }
}
