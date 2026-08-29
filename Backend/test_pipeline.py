"""
Run this first, before starting the FastAPI server, to confirm your Groq key
and every module works end to end. Just prints output at each stage.

Usage:
    python test_pipeline.py
"""
from app.diagnostic import ask_question, evaluate_answer
from app.knowledge_graph import find_gaps
from app.path_generator import generate_plan

CONCEPTS = ["numpy_arrays", "linear_algebra", "pandas_basics", "python_basics", "loops_functions"]

# Simulated answers so you don't have to type anything to smoke-test this.
# For python_basics/loops_functions these are deliberately substantive (not just
# "yes I know this") since the verdict step now checks the answer against the
# actual question asked — a bare confidence claim correctly won't pass anymore.
FAKE_ANSWERS = {
    "numpy_arrays": "Not really, I've only used plain Python lists.",
    "linear_algebra": "I've heard the term but never coded it myself.",
    "pandas_basics": "No, I haven't touched Pandas at all.",
    "python_basics": "Sure — e.g. a list comprehension like [x**2 for x in range(3)] evaluates to [0, 1, 4].",
    "loops_functions": "Yes — a for loop with an accumulator like total += i sums the range, so a function summing range(5) returns 10.",
}

print("=== Step 2: Diagnostic Agent ===")
knowledge_map = {}
for concept in CONCEPTS:
    question = ask_question(concept)
    answer = FAKE_ANSWERS[concept]
    verdict = evaluate_answer(concept, question, answer)
    knowledge_map[concept] = verdict
    print(f"[{concept}] Q: {question}")
    print(f"           A: {answer}  ->  {verdict}")

print("\n=== Step 3: Knowledge Graph (BFS gap-finding) ===")
gaps = find_gaps(knowledge_map)
print("Gaps, in teaching order:", gaps)

print("\n=== Step 4: Path Generator ===")
plan = generate_plan("Sayan", gaps)
for week in plan["weeks"]:
    print(f"Week {week['week']}: {week['concept']} — {week['why']}")
