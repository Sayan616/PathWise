# Pathwise — Adaptive Learning Path Agent

A full-stack AI tutor that diagnoses what a student already knows, figures out
exactly which prerequisite concepts they're missing, builds a personalised
week-by-week plan, and then teaches + quizzes them on each gap — remembering
their progress across sessions.

Built as a portfolio project to demonstrate a real multi-agent LLM pipeline:
prompt engineering, structured output parsing, graph traversal, retrieval-
augmented generation, and persistent memory, wired end to end behind a React
frontend.

---

## How it works — the pipeline

```
Goal (student types what they want to learn)
   ↓
Diagnostic Agent        — 5-turn Socratic Q&A (LangChain + Groq)
   ↓
Knowledge Graph         — BFS over a prerequisite graph (NetworkX)
   ↓
Path Generator          — turns the gap list into a structured week plan (Pydantic + JSON parser)
   ↓
RAG Engine              — retrieves the right lesson content per concept (ChromaDB)
   ↓
Tutor Agent             — teaches + asks a check question, grades the answer
   ↓
SQLite                  — saves mastery scores, persists across sessions
```

Each step's output feeds directly into the next — the gaps the Diagnostic
Agent finds are exactly what the Knowledge Graph traverses; the traversal
order is exactly what the Path Generator schedules; each week's concept is
exactly what the Tutor Agent retrieves and teaches.

## Current status

| Module | Status |
|---|---|
| Goal | ✅ UI |
| Diagnostic Agent | ✅ Live (real Groq calls) |
| Knowledge Graph | ✅ Live (real BFS traversal) |
| Path Generator | ✅ Live (real structured plan) |
| RAG + Tutor Agent | ✅ Live (real retrieval + teaching + grading) |
| Progress (SQLite) | ✅ Live (real persistence) |
| Dashboard / Practice / Community | 🚧 UI only, not yet wired to a backend |

## Tech stack

**Backend:** Python, FastAPI, LangChain, Groq (`openai/gpt-oss-120b`),
NetworkX, Pydantic, ChromaDB (built-in embeddings, no PyTorch needed), SQLite

**Frontend:** React, Vite, hand-written CSS-in-JS, hand-coded SVG (no UI
library, no charting library)

**Cost:** $0 — Groq's free API tier, local ChromaDB, local SQLite file, no
paid services anywhere in the stack.

---

## Project structure

```
ALProject/
├── Backend/
│   ├── app/
│   │   ├── config.py            # shared Groq LLM instance
│   │   ├── diagnostic.py        # Diagnostic Agent
│   │   ├── knowledge_graph.py   # NetworkX BFS gap-finding
│   │   ├── path_generator.py    # Pydantic + JSON output parser
│   │   ├── curriculum_corpus.py # source text the RAG engine indexes
│   │   ├── rag_engine.py        # ChromaDB chunking + retrieval
│   │   ├── tutor.py             # teach() + grade()
│   │   ├── database.py          # SQLite persistence
│   │   └── main.py              # FastAPI app, all endpoints
│   ├── requirements.txt
│   ├── .env                     # your real Groq key (never committed)
│   ├── test_pipeline.py         # smoke test: diagnostic → graph → plan
│   └── test_learn_pipeline.py   # smoke test: RAG → tutor → SQLite
└── Frontend/
    ├── src/
    │   └── App.jsx              # the entire UI (single-file prototype)
    ├── package.json
    └── vite.config.js
```

---

## Running it locally

You need **two terminals running at once** — one for the backend API, one
for the frontend dev server.

### 1. Backend setup (first time only)

```powershell
cd Backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and paste in your own Groq API key (free at
[console.groq.com](https://console.groq.com)):

```powershell
copy .env.example .env
```

### 2. Start the backend

```powershell
cd Backend
venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

Leave this running. Check `http://localhost:8000/docs` — FastAPI's
interactive docs page lets you test any endpoint directly.

### 3. Frontend setup (first time only)

```powershell
cd Frontend
npm install
```

### 4. Start the frontend

```powershell
cd Frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

### 5. (Optional) Verify the backend independently first

Before touching the UI, you can sanity-check both pipelines from the
terminal — useful if something in the browser isn't working and you want to
narrow down whether it's a frontend or backend issue:

```powershell
cd Backend
venv\Scripts\activate
python test_pipeline.py         # diagnostic → knowledge graph → path generator
python test_learn_pipeline.py   # RAG → tutor → SQLite
```

**Note:** the very first `test_learn_pipeline.py` run (or the first real
`/api/tutor/teach` call) downloads a small (~90MB) embedding model for
ChromaDB. This is one-time and needs a normal internet connection; every
run after that is instant.

---

## Environment variables

`Backend/.env`:
```
GROQ_API_KEY=your_key_here
```

Never commit this file — it's already covered by `.gitignore`.

---

## Notes

- The Dashboard, Practice, and Community pages are fully designed UI but
  currently use mocked/hardcoded data — no backend exists for them yet.
- The "coding exercise" step under Learn uses a simple client-side check
  (not real code execution) since a sandboxed Python runner was out of
  scope for this prototype; the actual mastery score comes from the real,
  LLM-graded check question earlier in the same lesson.
- Read-aloud on the lesson page uses the browser's built-in Web Speech API
  — no AI voice service, no extra cost.
