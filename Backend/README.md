# Adaptive Learning Path Agent — Curriculum backend

Covers modules 1–4 of the pipeline (Goal, Diagnostic Agent, Knowledge Graph,
Path Generator). RAG + Tutor + SQLite (the Learn/Progress steps) come next,
once this part is confirmed working.

## Setup (Windows / VS Code)

1. Open this folder in VS Code (`code .` from inside it, or File → Open Folder).

2. Create a virtual environment (keeps these packages separate from your
   Node/React project):
   ```powershell
   python -m venv venv
   venv\Scripts\activate
   ```
   Your terminal prompt should now start with `(venv)`.

3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Copy `.env.example` to `.env` and paste in your real Groq key:
   ```powershell
   copy .env.example .env
   ```
   Then edit `.env` in VS Code and replace `gsk_your_key_here` with your actual
   key from console.groq.com.

5. Smoke-test the pipeline before touching the server:
   ```powershell
   python test_pipeline.py
   ```
   You should see 5 diagnostic Q&As, a gap list, and a printed week plan.
   If this works, everything downstream will work too.

6. Start the API server:
   ```powershell
   uvicorn app.main:app --reload --port 8000
   ```
   Open `http://localhost:8000/docs` in a browser — FastAPI's interactive
   docs page lets you test every endpoint by hand, no frontend needed yet.

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/concepts` | The 5 concepts the diagnostic tests |
| POST | `/api/diagnostic/ask` | `{concept}` → `{question}` |
| POST | `/api/diagnostic/evaluate` | `{concept, answer}` → `{verdict}` |
| POST | `/api/graph/gaps` | `{knowledge_map, goal}` → `{gaps}` |
| POST | `/api/plan/generate` | `{student, gaps}` → `{student, weeks}` |

## Next
Once `/docs` confirms all four endpoints work with your real key, the next
step is wiring the React Curriculum page's `StepDiagnostic`, `StepGraph`,
and `StepPlan` to call these instead of using hardcoded mock data — then
building the RAG + Tutor + SQLite pieces for the Learn/Progress steps.
