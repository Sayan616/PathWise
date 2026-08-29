"""
Run this to confirm the RAG + Tutor + SQLite pipeline works end to end.

First run will be slower — ChromaDB downloads its embedding model (~90MB,
one-time) and builds the vector index from the curriculum corpus.

Usage:
    python test_learn_pipeline.py
"""
import os
from app.tutor import teach, grade
from app.database import init_db, save_mastery, get_progress

STUDENT = "Rahul"
CONCEPT = "numpy_arrays"

# clean slate so re-running this script is easy to read
if os.path.exists("mastery.db"):
    os.remove("mastery.db")
init_db()

print(f"=== Teaching: {CONCEPT} ===")
lesson = teach(CONCEPT)
print("Explanation:", lesson["explanation"])
print("Check question:", lesson["check_question"])

print(f"\n=== Grading a WEAK answer ===")
weak_answer = "I'm not totally sure, maybe it's just a list?"
weak_result = grade(CONCEPT, lesson["check_question"], weak_answer)
print(weak_result)
save_mastery(STUDENT, CONCEPT, weak_result["score"], weak_result["passed"])

print(f"\n=== Re-teaching after a weak attempt ===")
lesson2 = teach(CONCEPT)
print("Check question:", lesson2["check_question"])

print(f"\n=== Grading a STRONG answer ===")
strong_answer = (
    "NumPy arrays store one data type contiguously in memory, so operations "
    "like multiplying by a scalar run elementwise across the whole array "
    "without needing an explicit Python loop — that's what makes them fast."
)
strong_result = grade(CONCEPT, lesson2["check_question"], strong_answer)
print(strong_result)
save_mastery(STUDENT, CONCEPT, strong_result["score"], strong_result["passed"])

print(f"\n=== Progress for {STUDENT} (should show only the latest attempt) ===")
print(get_progress(STUDENT))
