"""
SQLite persistence layer.

Used to store chat history and emergency reports so the dashboard has real
(if locally-generated) data to display across requests. Uses the stdlib
sqlite3 module directly — no ORM needed for two small tables.
"""
import sqlite3
from contextlib import contextmanager
from pathlib import Path

from backend.core.config import get_settings

_settings = get_settings()
_DB_PATH = Path(__file__).resolve().parent.parent / _settings.DATABASE_PATH


@contextmanager
def get_connection():
    conn = sqlite3.connect(_DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    """Create tables on startup if they don't already exist."""
    with get_connection() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL,
                message TEXT NOT NULL,
                language TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS emergency_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                incident_id TEXT NOT NULL UNIQUE,
                incident_type TEXT NOT NULL,
                location TEXT NOT NULL,
                description TEXT NOT NULL,
                priority TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
            """
        )


def save_chat_message(session_id: str, role: str, message: str, language: str) -> None:
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO chat_messages (session_id, role, message, language) "
            "VALUES (?, ?, ?, ?)",
            (session_id, role, message, language),
        )


def save_emergency_report(
    incident_id: str, incident_type: str, location: str, description: str, priority: str
) -> None:
    with get_connection() as conn:
        conn.execute(
            "INSERT INTO emergency_reports "
            "(incident_id, incident_type, location, description, priority) "
            "VALUES (?, ?, ?, ?, ?)",
            (incident_id, incident_type, location, description, priority),
        )
