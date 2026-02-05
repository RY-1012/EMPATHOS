use rusqlite::{Connection, Result};
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::emotional_api::EmotionalState;

pub struct Database {
    conn: Connection,
}

impl Database {
    pub fn new() -> Result<Self> {
        let conn = Connection::open("empathos.db")?;
        
        conn.execute(
            "CREATE TABLE IF NOT EXISTS emotional_states (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                focus REAL NOT NULL,
                stress REAL NOT NULL,
                confusion REAL NOT NULL,
                flow REAL NOT NULL,
                valence REAL NOT NULL,
                arousal REAL NOT NULL,
                context TEXT
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS sessions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                start_time TEXT NOT NULL,
                end_time TEXT,
                avg_focus REAL,
                avg_stress REAL,
                avg_flow REAL,
                notes TEXT
            )",
            [],
        )?;

        Ok(Database { conn })
    }

    pub fn log_emotional_state(&self, state: &EmotionalState) -> Result<()> {
        self.conn.execute(
            "INSERT INTO emotional_states (timestamp, focus, stress, confusion, flow, valence, arousal, context)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
            rusqlite::params![
                state.timestamp.to_rfc3339(),
                state.focus,
                state.stress,
                state.confusion,
                state.flow,
                state.valence,
                state.arousal,
                state.context.as_deref()
            ],
        )?;
        Ok(())
    }

    pub fn get_emotional_history(&self, limit: i32) -> Result<Vec<EmotionalState>> {
        let mut stmt = self.conn.prepare(
            "SELECT timestamp, focus, stress, confusion, flow, valence, arousal, context
             FROM emotional_states
             ORDER BY timestamp DESC
             LIMIT ?1"
        )?;

        let states = stmt.query_map([limit], |row| {
            Ok(EmotionalState {
                timestamp: row.get::<_, String>(0)?.parse().unwrap_or(Utc::now()),
                focus: row.get(1)?,
                stress: row.get(2)?,
                confusion: row.get(3)?,
                flow: row.get(4)?,
                valence: row.get(5)?,
                arousal: row.get(6)?,
                context: row.get(7)?,
            })
        })?;

        states.collect()
    }
}
