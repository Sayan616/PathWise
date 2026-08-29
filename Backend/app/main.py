from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List

from .diagnostic import ask_question, evaluate_answer
from .knowledge_graph import find_gaps
from .path_generator import generate_plan
from .tutor import teach, grade
from .database import init_db, save_mastery, get_progress

app = FastAPI(title="Adaptive Learning Path Agent — Curriculum API")

# Allow the Vite dev server to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

# The 5 concepts the Diagnostic Agent tests, in turn order
CONCEPTS = ["numpy_arrays", "linear_algebra", "pandas_basics", "python_basics", "loops_functions"]


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.get("/api/concepts")
def get_concepts():
    return {"concepts": CONCEPTS}


class AskRequest(BaseModel):
    concept: str


@app.post("/api/diagnostic/ask")
def diagnostic_ask(req: AskRequest):
    question = ask_question(req.concept)
    return {"concept": req.concept, "question": question}


class EvaluateRequest(BaseModel):
    concept: str
    question: str
    answer: str


@app.post("/api/diagnostic/evaluate")
def diagnostic_evaluate(req: EvaluateRequest):
    verdict = evaluate_answer(req.concept, req.question, req.answer)
    return {"concept": req.concept, "verdict": verdict}


class GapsRequest(BaseModel):
    knowledge_map: Dict[str, str]
    goal: str = "machine_learning"


@app.post("/api/graph/gaps")
def graph_gaps(req: GapsRequest):
    gaps = find_gaps(req.knowledge_map, req.goal)
    return {"gaps": gaps}


class PlanRequest(BaseModel):
    student: str
    gaps: List[str]


@app.post("/api/plan/generate")
def plan_generate(req: PlanRequest):
    return generate_plan(req.student, req.gaps)


class TeachRequest(BaseModel):
    concept: str


@app.post("/api/tutor/teach")
def tutor_teach(req: TeachRequest):
    return teach(req.concept)


class GradeRequest(BaseModel):
    student: str
    concept: str
    question: str
    answer: str


@app.post("/api/tutor/grade")
def tutor_grade(req: GradeRequest):
    result = grade(req.concept, req.question, req.answer)
    save_mastery(req.student, req.concept, result["score"], result["passed"])
    return result


@app.get("/api/progress/{student}")
def progress(student: str):
    return {"progress": get_progress(student)}
