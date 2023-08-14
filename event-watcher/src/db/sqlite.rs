use rusqlite::{Connection, Result, Row};

pub struct SqliteDriver {
  conn: Connection,
}

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
  let conn = Connection::open("./rpc_data.db").expect("error opening sqlite database file");
  
  Ok(SqliteDriver { conn })
}

impl SqliteDriver {
  pub fn create_database(&self) -> Result<()> {
    self.conn.execute(
        "CREATE TABLE rpc_event (
            id    INTEGER PRIMARY KEY,
            ledger INTEGER,
            event_id VARCHAR(200),
            contract_id VARCHAR(200),
            topic_1 VARCHAR(200),
            topic_2 VARCHAR(200),
            topic_3 VARCHAR(200),
            topic_4 VARCHAR(200),
            xdr_data VARCHAR(200)
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
        (event.ledger, &event.event_id, &event.contract_id, &event.topic_1, &event.topic_2, &event.topic_3, &event.topic_4, &event.xdr_data),
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

    let ledger = match self.conn.query_row::<u32, _, _>(
      "SELECT max(ledger) FROM rpc_event",
      [],
      |row| {
        row.get(0)
      }) {
        Ok(r) => r,
        Err(rusqlite::Error::QueryReturnedNoRows) => return Ok(0), // if no rows, we just return 0 to represent that there's no value
        Err(e) => return Err(e),
      };

    Ok(ledger)
  }

}
