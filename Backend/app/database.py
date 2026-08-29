import sqlite3
import os
from datetime import datetime, timezone

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "mastery.db")


def init_db():
    """Create the mastery table if it doesn't exist yet. Safe to call every startup."""
    conn = sqlite3.connect(DB_PATH) # define connection
    conn.execute("""
        CREATE TABLE IF NOT EXISTS mastery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student TEXT NOT NULL,
            concept TEXT NOT NULL,
            score INTEGER NOT NULL,
            passed INTEGER NOT NULL,
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()


def save_mastery(student: str, concept: str, score: int, passed: bool) -> None:
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        "INSERT INTO mastery (student, concept, score, passed, created_at) VALUES (?, ?, ?, ?, ?)",
        (student, concept, score, int(passed), datetime.now(timezone.utc).isoformat()),
    )
    conn.commit()
    conn.close()


def get_progress(student: str) -> list[dict]:
    """Returns the most recent attempt per concept for this student, ordered by first-taught."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        "SELECT concept, score, passed, created_at FROM mastery WHERE student = ? ORDER BY created_at ASC",
        (student,),
    ).fetchall()
    conn.close()

    latest_by_concept: dict[str, dict] = {}
    for row in rows:
        # later rows overwrite earlier ones for the same concept, so this
        # naturally keeps only the most recent attempt per concept
        latest_by_concept[row["concept"]] = {
            "concept": row["concept"],
            "score": row["score"],
            "passed": bool(row["passed"]),
            "created_at": row["created_at"],
        }
    return list(latest_by_concept.values())
