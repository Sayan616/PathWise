import React, { useState, useRef, useEffect } from "react";

const API_BASE = "http://localhost:8000/api";

const MODULES = [
  { id: 0, key: "input", label: "Goal", sub: "Tell us what you want to learn" },
  { id: 1, key: "diagnostic", label: "Diagnose", sub: "5-turn Socratic check-in" },
  { id: 2, key: "graph", label: "Map gaps", sub: "Prerequisite graph traversal" },
  { id: 3, key: "plan", label: "Plan", sub: "Week-by-week path" },
  { id: 4, key: "tutor", label: "Learn", sub: "Guided teaching session" },
  { id: 5, key: "summary", label: "Progress", sub: "Mastery across sessions" },
];

// Positions/labels for the graph visual. "known" is no longer hardcoded here —
// StepGraph derives it live from the real knowledgeMap returned by the backend.
const CONCEPT_GRAPH = [
  { id: "python_basics", label: "Python basics", x: 60, y: 260 },
  { id: "loops_functions", label: "Loops & functions", x: 60, y: 160 },
  { id: "numpy_arrays", label: "NumPy arrays", x: 230, y: 210 },
  { id: "linear_algebra", label: "Linear algebra", x: 230, y: 90 },
  { id: "pandas_basics", label: "Pandas basics", x: 230, y: 320 },
  { id: "machine_learning", label: "Machine learning", x: 420, y: 210 },
];
const CONCEPT_EDGES = [
  ["python_basics", "numpy_arrays"],
  ["loops_functions", "numpy_arrays"],
  ["python_basics", "pandas_basics"],
  ["numpy_arrays", "linear_algebra"],
  ["numpy_arrays", "machine_learning"],
  ["linear_algebra", "machine_learning"],
  ["pandas_basics", "machine_learning"],
];

const CONCEPT_LABELS = {
  numpy_arrays: "NumPy arrays",
  linear_algebra: "Linear algebra",
  pandas_basics: "Pandas basics",
  python_basics: "Python basics",
  loops_functions: "Loops & functions",
};

function JourneyRail({ step, setStep }) {
  return (
    <div style={styles.rail}>
      <div style={styles.railHeader}>
        <div style={styles.railHeaderTitle}>Learning path</div>
        <div style={styles.railHeaderSub}>Machine learning track</div>
      </div>
      <svg width="52" height="420" style={{ position: "absolute", left: 24, top: 92 }}>
        <path
          d="M 26 10 C 10 60, 42 100, 26 150 S 10 240, 26 290 S 42 350, 26 400"
          fill="none"
          stroke="var(--hairline)"
          strokeWidth="2"
        />
        <path
          d={`M 26 10 C 10 60, 42 100, 26 150 S 10 240, 26 290 S 42 350, 26 400`}
          fill="none"
          stroke="var(--teal)"
          strokeWidth="2"
          strokeDasharray="420"
          strokeDashoffset={420 - (step / (MODULES.length - 1)) * 420}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div style={styles.railList}>
        {MODULES.map((m, i) => {
          const state = i < step ? "done" : i === step ? "active" : "todo";
          return (
            <button
              key={m.id}
              onClick={() => setStep(i)}
              style={{
                ...styles.railItem,
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  ...styles.railDot,
                  background:
                    state === "done" ? "var(--teal)" : state === "active" ? "var(--amber)" : "var(--surface2)",
                  borderColor: state === "todo" ? "var(--hairline)" : "transparent",
                  boxShadow: state === "active" ? "0 0 0 4px rgba(255,180,84,0.18)" : "none",
                }}
              >
                {state === "done" ? "✓" : ""}
              </span>
              <span style={{ textAlign: "left" }}>
                <div
                  style={{
                    ...styles.railLabel,
                    color: state === "todo" ? "var(--muted)" : "var(--text)",
                  }}
                >
                  {m.label}
                </div>
                <div style={styles.railSub}>{m.sub}</div>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TopBar({ active, onNavigate, theme, onToggleTheme }) {
  const items = [
    { key: "dashboard", label: "Dashboard" },
    { key: "curriculum", label: "Curriculum" },
    { key: "practice", label: "Practice" },
    { key: "community", label: "Community" },
  ];
  return (
    <div style={styles.topBar}>
      <div style={styles.topBarLeft}>
        <span style={styles.brandMark}>◆</span>
        <span style={styles.brandName}>Pathwise</span>
        <nav style={styles.topNav}>
          {items.map((it) => (
            <span
              key={it.key}
              onClick={() => onNavigate(it.key)}
              style={{
                ...styles.topNavItem,
                ...(active === it.key ? styles.topNavItemActive : {}),
                cursor: "pointer",
              }}
            >
              {it.label}
            </span>
          ))}
        </nav>
      </div>
      <div style={styles.topBarRight}>
        <input style={styles.searchInput} placeholder="Search concepts" />
        <button
          onClick={onToggleTheme}
          title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          style={styles.themeToggle}
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <span style={styles.iconBtn}>🔔</span>
        <span style={styles.avatar}>S</span>
      </div>
    </div>
  );
}

const ACTIVITY = [
  { label: "Completed diagnostic check-in", when: "Today" },
  { label: "Started NumPy arrays lesson", when: "Today" },
  { label: "Reviewed knowledge map", when: "Yesterday" },
  { label: "Set goal: Machine learning track", when: "2 days ago" },
];

function DashboardPage({ onResume }) {
  return (
    <div style={styles.pageWrap}>
      <div style={styles.pageHeader}>
        <h2 style={styles.h2}>Welcome back, Sayan</h2>
        <p style={styles.bodyMuted}>Machine learning track · Day 4 streak</p>
      </div>

      <div style={styles.statRow}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>3 / 6</div>
          <div style={styles.statLabel}>Concepts mastered</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>4 days</div>
          <div style={styles.statLabel}>Current streak</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>60%</div>
          <div style={styles.statLabel}>Weekly goal</div>
        </div>
      </div>

      <div style={styles.continueCard}>
        <div>
          <div style={styles.continueLabel}>Continue where you left off</div>
          <div style={styles.continueConcept}>Week 1 · NumPy arrays</div>
          <div style={styles.masteryTrack}>
            <div style={{ ...styles.masteryFill, width: "45%" }} />
          </div>
        </div>
        <button style={styles.primaryBtn} onClick={onResume}>Resume →</button>
      </div>

      <div style={styles.lessonSectionLabel}>Recent activity</div>
      <div style={styles.activityList}>
        {ACTIVITY.map((a, i) => (
          <div key={i} style={styles.activityRow}>
            <span style={styles.activityDot} />
            <span style={styles.activityLabel}>{a.label}</span>
            <span style={styles.activityWhen}>{a.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const PRACTICE_PROBLEMS = [
  { title: "NumPy array basics", tag: "numpy", difficulty: "Easy", status: "solved" },
  { title: "List comprehensions warm-up", tag: "python", difficulty: "Easy", status: "solved" },
  { title: "Broadcasting rules", tag: "numpy", difficulty: "Medium", status: "open" },
  { title: "Matrix multiplication by hand", tag: "linear algebra", difficulty: "Hard", status: "open" },
  { title: "Filtering a DataFrame", tag: "pandas", difficulty: "Medium", status: "locked" },
  { title: "Merging two DataFrames", tag: "pandas", difficulty: "Medium", status: "locked" },
];
const DIFF_FILTERS = ["All", "Easy", "Medium", "Hard"];

function PracticePage() {
  const [filter, setFilter] = useState("All");
  const rows = PRACTICE_PROBLEMS.filter((p) => filter === "All" || p.difficulty === filter);
  const statusIcon = { solved: "✓", open: "○", locked: "🔒" };
  const statusColor = { solved: "var(--teal)", open: "var(--muted)", locked: "var(--dim)" };

  return (
    <div style={styles.pageWrap}>
      <div style={styles.pageHeader}>
        <h2 style={styles.h2}>Practice problems</h2>
        <p style={styles.bodyMuted}>Extra reps outside the curriculum — unlocked as you clear each week.</p>
      </div>

      <div style={styles.chipRow}>
        {DIFF_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ ...styles.chip, ...(filter === f ? styles.chipActive : {}) }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={styles.problemList}>
        {rows.map((p, i) => (
          <div key={i} style={styles.problemRow}>
            <span style={{ ...styles.problemStatus, color: statusColor[p.status] }}>{statusIcon[p.status]}</span>
            <span style={styles.problemTitle}>{p.title}</span>
            <span style={styles.leetTag}>{p.tag}</span>
            <span style={styles.problemDifficulty}>{p.difficulty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const THREADS = [
  { author: "S", name: "Sayan", title: "Stuck on broadcasting rules in NumPy — any intuition tricks?", tag: "numpy", replies: 6 },
  { author: "T", name: "Tony", title: "Anyone have a good cheat sheet for Pandas groupby?", tag: "pandas", replies: 11 },
  { author: "A", name: "Arunavo", title: "Passed my diagnostic today — feels great to see the gap list shrink", tag: "wins", replies: 3 },
  { author: "F", name: "Frank", title: "Linear algebra week — is Khan Academy enough alongside this?", tag: "linear algebra", replies: 8 },
];

function CommunityPage() {
  return (
    <div style={styles.pageWrap}>
      <div style={{ ...styles.pageHeader, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <h2 style={styles.h2}>Community</h2>
          <p style={styles.bodyMuted}>Ask questions, share wins, compare notes with other learners on the same track.</p>
        </div>
        <button style={styles.primaryBtn}>+ New post</button>
      </div>

      <div style={styles.threadList}>
        {THREADS.map((t, i) => (
          <div key={i} style={styles.threadCard}>
            <span style={styles.avatar}>{t.author}</span>
            <div style={{ flex: 1 }}>
              <div style={styles.threadTitle}>{t.title}</div>
              <div style={styles.threadMeta}>
                <span>{t.name}</span>
                <span style={styles.leetTag}>{t.tag}</span>
              </div>
            </div>
            <div style={styles.threadReplies}>{t.replies} replies</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepGoal({ onNext }) {
  const [goal, setGoal] = useState("I want to get good enough at machine learning to build a real project.");
  return (
    <div style={styles.panel}>
      <div style={styles.eyebrow}>Step 1 of 6</div>
      <h2 style={styles.h2}>What do you want to learn?</h2>
      <p style={styles.bodyMuted}>
        Describe your goal in plain English. We'll figure out what you already know before building a plan —
        no need to guess your own skill level.
      </p>
      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        rows={4}
        style={styles.textarea}
        placeholder="e.g. I want to understand machine learning well enough to build a project"
      />
      <div style={styles.chipRow}>
        {["Machine learning", "Web development", "Data analysis", "Backend systems"].map((c) => (
          <button key={c} style={styles.chip} onClick={() => setGoal(`I want to learn ${c.toLowerCase()}.`)}>
            {c}
          </button>
        ))}
      </div>
      <button style={styles.primaryBtn} onClick={onNext}>
        Start diagnostic →
      </button>
    </div>
  );
}

function StepDiagnostic({ onNext }) {
  const [concepts, setConcepts] = useState([]);
  const [turn, setTurn] = useState(0);
  const [log, setLog] = useState([]); // [{concept, question, answer, verdict}]
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const askedRef = useRef(new Set());

  useEffect(() => {
    fetch(`${API_BASE}/concepts`)
      .then((r) => r.json())
      .then((d) => setConcepts(d.concepts))
      .catch(() => setError("Can't reach the backend at localhost:8000. Is `uvicorn app.main:app --reload --port 8000` running?"));
  }, []);

  useEffect(() => {
    if (concepts.length === 0 || turn >= concepts.length) return;
    if (askedRef.current.has(turn)) return;
    askedRef.current.add(turn);

    const concept = concepts[turn];
    setLoading(true);
    fetch(`${API_BASE}/diagnostic/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept }),
    })
      .then((r) => r.json())
      .then((d) => {
        setLog((l) => [...l, { concept, question: d.question, answer: null, verdict: null }]);
      })
      .catch(() => setError("Couldn't reach the backend. Is the FastAPI server running on port 8000?"))
      .finally(() => setLoading(false));
  }, [concepts, turn]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [log, loading]);

  const submitAnswer = () => {
    if (!answer.trim() || loading) return;
    const entry = log[turn];
    if (!entry) return;

    setLoading(true);
    fetch(`${API_BASE}/diagnostic/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept: entry.concept, question: entry.question, answer }),
    })
      .then((r) => r.json())
      .then((d) => {
        setLog((l) => l.map((item, i) => (i === turn ? { ...item, answer, verdict: d.verdict } : item)));
        setAnswer("");
        const knowledgeMapSoFar = Object.fromEntries(
          log.map((item, i) => [item.concept, i === turn ? d.verdict : item.verdict])
        );
        if (turn < concepts.length - 1) {
          setTurn((t) => t + 1);
        } else {
          onNext(knowledgeMapSoFar);
        }
      })
      .catch(() => setError("Couldn't reach the backend. Is the FastAPI server running on port 8000?"))
      .finally(() => setLoading(false));
  };

  return (
    <div style={styles.panel}>
      <div style={styles.eyebrow}>
        Step 2 of 6 · Turn {Math.min(turn + 1, concepts.length || 1)} of {concepts.length || "…"}
      </div>
      <h2 style={styles.h2}>Diagnostic conversation</h2>
      <p style={styles.bodyMuted}>Answer honestly — this maps what you already know before anything gets planned.</p>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div ref={scrollRef} style={styles.chatWindow}>
        {log.map((item, i) => (
          <React.Fragment key={i}>
            <div style={styles.bubbleAgent}>{item.question}</div>
            {item.answer && <div style={styles.bubbleUser}>{item.answer}</div>}
          </React.Fragment>
        ))}
        {loading && log.length <= turn && <div style={styles.bubbleAgent}>…thinking</div>}
      </div>

      <div style={styles.answerRow}>
        <input
          style={styles.textInput}
          placeholder="Type your answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
          disabled={loading || !log[turn]}
        />
        <button style={styles.primaryBtn} onClick={submitAnswer} disabled={loading || !log[turn]}>
          {loading ? "…" : turn < concepts.length - 1 ? "Submit" : "Finish →"}
        </button>
      </div>
    </div>
  );
}

function StepGraph({ knowledgeMap, onNext }) {
  const [gaps, setGaps] = useState(null);
  const [error, setError] = useState(null);
  const posById = Object.fromEntries(CONCEPT_GRAPH.map((n) => [n.id, n]));

  const fetchGaps = () => {
    setError(null);
    setGaps(null);
    fetch(`${API_BASE}/graph/gaps`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ knowledge_map: knowledgeMap, goal: "machine_learning" }),
    })
      .then((r) => r.json())
      .then((d) => setGaps(d.gaps))
      .catch(() => setError("Couldn't reach the backend. Is the FastAPI server running on port 8000?"));
  };

  useEffect(fetchGaps, []); // eslint-disable-line react-hooks/exhaustive-deps

  const statusOf = (id) => {
    if (id === "machine_learning") return "goal";
    return knowledgeMap[id] === "UNKNOWN" ? "gap" : "known";
  };
  const colorOf = (status) =>
    status === "known" ? "var(--teal)" : status === "gap" ? "var(--amber)" : "var(--violet)";

  return (
    <div style={styles.panel}>
      <div style={styles.eyebrow}>Step 3 of 6</div>
      <h2 style={styles.h2}>Knowledge map</h2>
      <p style={styles.bodyMuted}>
        Prerequisite graph traversal (BFS) surfaces every concept standing between what you know and your goal.
      </p>

      {error && (
        <div style={styles.errorBox}>
          {error} <button style={styles.leetBackLink} onClick={fetchGaps}>Retry</button>
        </div>
      )}

      {!error && gaps === null && <div style={styles.leetConsoleHint}>Traversing the graph…</div>}

      {gaps !== null && (
        <>
          <div style={styles.graphCard}>
            <svg viewBox="0 0 480 380" width="100%" height="300">
              {CONCEPT_EDGES.map(([a, b], i) => {
                const na = posById[a], nb = posById[b];
                const bothKnown = statusOf(a) !== "gap" && statusOf(b) !== "gap" && statusOf(a) !== "goal" && statusOf(b) !== "goal";
                return (
                  <line
                    key={i}
                    x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke={bothKnown ? "var(--teal)" : "var(--hairline)"}
                    strokeWidth="1.5"
                  />
                );
              })}
              {CONCEPT_GRAPH.map((n) => (
                <g key={n.id}>
                  <circle cx={n.x} cy={n.y} r="8" fill={colorOf(statusOf(n.id))} />
                  <text x={n.x} y={n.y - 16} textAnchor="middle" style={styles.graphLabel}>
                    {n.label}
                  </text>
                </g>
              ))}
            </svg>
            <div style={styles.legendRow}>
              <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: "var(--teal)" }} /> already known</span>
              <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: "var(--amber)" }} /> gap to fill</span>
              <span style={styles.legendItem}><span style={{ ...styles.legendDot, background: "var(--violet)" }} /> goal</span>
            </div>
          </div>

          <div style={styles.gapSummary}>
            <div style={styles.gapSummaryLabel}>Gaps found</div>
            <div style={styles.gapPillRow}>
              {gaps.map((id) => (
                <span key={id} style={styles.gapPill}>{CONCEPT_LABELS[id] || id}</span>
              ))}
            </div>
          </div>

          <button style={styles.primaryBtn} onClick={() => onNext(gaps)}>Generate learning plan →</button>
        </>
      )}
    </div>
  );
}

function StepPlan({ gaps, student, onNext }) {
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  const fetchPlan = () => {
    setError(null);
    setPlan(null);
    fetch(`${API_BASE}/plan/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student, gaps }),
    })
      .then((r) => r.json())
      .then((d) => setPlan(d))
      .catch(() => setError("Couldn't reach the backend. Is the FastAPI server running on port 8000?"));
  };

  useEffect(fetchPlan, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={styles.panel}>
      <div style={styles.eyebrow}>Step 4 of 6</div>
      <h2 style={styles.h2}>Your plan</h2>
      <p style={styles.bodyMuted}>Ordered by prerequisite, not difficulty — each week unlocks the next.</p>

      {error && (
        <div style={styles.errorBox}>
          {error} <button style={styles.leetBackLink} onClick={fetchPlan}>Retry</button>
        </div>
      )}

      {!error && plan === null && <div style={styles.leetConsoleHint}>Generating your plan…</div>}

      {plan !== null && (
        <>
          <div style={styles.timeline}>
            {plan.weeks.map((w, i) => (
              <div key={w.week} style={styles.weekCard}>
                <div style={styles.weekNumber}>Week {w.week}</div>
                <div style={styles.weekConcept}>{CONCEPT_LABELS[w.concept] || w.concept}</div>
                <div style={styles.weekWhy}>{w.why}</div>
                {i < plan.weeks.length - 1 && <div style={styles.weekConnector} />}
              </div>
            ))}
          </div>

          <button style={styles.primaryBtn} onClick={() => onNext(plan)}>Begin week 1 →</button>
        </>
      )}
    </div>
  );
}

const TUTOR_TESTS = [
  { desc: "arr is a numpy.ndarray, not a list" },
  { desc: "arr * 2 works elementwise, no loop" },
  { desc: "arr holds a single dtype" },
];

const TUTOR_HINTS = [
  "You don't need a loop — NumPy overloads operators like * to work elementwise.",
  "Compare type(arr) to type([1, 2, 3]) to see the difference in memory representation.",
  "Multiplying an array by a scalar returns a new array of the same shape.",
];

const TUTOR_SOLUTION = `import numpy as np\n\narr = np.array([1, 2, 3, 4, 5])\nprint(arr * 2)\n# array([2, 4, 6, 8, 10]) — no loop needed`;

function StepTutor({ onNext, phase, setPhase, student }) {
  const CONCEPT = "numpy_arrays";
  const [tab, setTab] = useState("description");
  const starterCode = `import numpy as np\n\n# Create an array and show one advantage\n# it has over a plain Python list.\narr = np.array([1, 2, 3, 4, 5])\nprint(arr * 2)\n`;
  const [code, setCode] = useState(starterCode);
  const [consoleOut, setConsoleOut] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // real lesson + check question from the Tutor Agent (RAG-backed)
  const [lesson, setLesson] = useState(null);
  const [lessonError, setLessonError] = useState(null);
  const [checkAnswer, setCheckAnswer] = useState("");
  const [gradeResult, setGradeResult] = useState(null);
  const [grading, setGrading] = useState(false);

  const fetchLesson = () => {
    setLessonError(null);
    setLesson(null);
    setGradeResult(null);
    stopReadAloud();
    fetch(`${API_BASE}/tutor/teach`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ concept: CONCEPT }),
    })
      .then((r) => r.json())
      .then((d) => setLesson(d))
      .catch(() => setLessonError("Couldn't reach the backend. Is the FastAPI server running on port 8000?"));
  };

  // Read-aloud — browser-native Web Speech API, no backend call needed
  const [isSpeaking, setIsSpeaking] = useState(false);

  function stopReadAloud() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }

  const toggleReadAloud = () => {
    if (!window.speechSynthesis) return;
    if (isSpeaking) {
      stopReadAloud();
      return;
    }
    const text = `NumPy arrays. ${lesson.explanation}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel(); // clear any queued speech first
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  useEffect(() => stopReadAloud, []); // stop speech if the component unmounts mid-read

  useEffect(() => {
    if (phase === "theory") fetchLesson();
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const submitCheckAnswer = () => {
    if (!checkAnswer.trim() || !lesson) return;
    setGrading(true);
    fetch(`${API_BASE}/tutor/grade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student, concept: CONCEPT, question: lesson.check_question, answer: checkAnswer }),
    })
      .then((r) => r.json())
      .then((d) => setGradeResult(d))
      .catch(() => setLessonError("Couldn't reach the backend. Is the FastAPI server running on port 8000?"))
      .finally(() => setGrading(false));
  };

  const evaluate = () => {
    const passed = code.includes("np.array");
    setConsoleOut({ passed, tests: TUTOR_TESTS.map((t) => ({ ...t, pass: passed })) });
    return passed;
  };

  const run = () => evaluate();
  const submit = () => {
    const passed = evaluate();
    if (passed) setSubmitted(true);
  };

  const [doubt, setDoubt] = useState("");
  const [doubtLog, setDoubtLog] = useState([]);
  const askDoubt = () => {
    if (!doubt.trim()) return;
    setDoubtLog((log) => [
      ...log,
      {
        q: doubt,
        a: "Good question — because every element in the array is the same type, NumPy skips the per-item type checks a Python list needs, and operates on one contiguous block of memory instead. That's the whole speed difference in a nutshell.",
      },
    ]);
    setDoubt("");
  };

  if (phase === "theory") {
    return (
      <div style={styles.lessonWrap}>
        <div style={styles.eyebrow}>Step 5 of 6 · Week 1 · Lesson</div>
        <h2 style={styles.h2}>NumPy arrays</h2>
        <p style={styles.bodyMuted}>
          Read through the concept first — the check question right after confirms it actually stuck.
        </p>

        {lessonError && (
          <div style={styles.errorBox}>
            {lessonError} <button style={styles.leetBackLink} onClick={fetchLesson}>Retry</button>
          </div>
        )}

        {!lessonError && lesson === null && (
          <div style={styles.leetConsoleHint}>Retrieving the lesson and generating an explanation…</div>
        )}

        {lesson !== null && (
          <>
            <div style={styles.lessonSection}>
              <div style={styles.lessonSectionRow}>
                <div style={styles.lessonSectionLabel}>What it is</div>
                <button style={styles.readAloudBtn} onClick={toggleReadAloud}>
                  {isSpeaking ? "⏹ Stop" : "🔊 Read aloud"}
                </button>
              </div>
              <p style={styles.leetBody}>{lesson.explanation}</p>
            </div>

            <div style={styles.lessonAnalogy}>
              <strong style={{ color: "var(--amber)" }}>Analogy:</strong> think of a Python list like a junk drawer —
              anything can go in, in any order. A NumPy array is a spreadsheet column — every cell holds the same
              kind of value, which is exactly what makes bulk operations on it so quick.
            </div>

            <div style={styles.lessonSection}>
              <div style={styles.lessonSectionLabel}>Check your understanding</div>
              <div style={styles.leetExample}>
                <pre style={styles.leetExamplePre}>{lesson.check_question}</pre>
              </div>

              {gradeResult && (
                <div
                  style={{
                    ...styles.errorBox,
                    color: gradeResult.passed ? "var(--teal-soft)" : "var(--amber-soft)",
                    background: gradeResult.passed ? "rgba(79,216,196,0.08)" : "rgba(255,180,84,0.08)",
                    border: gradeResult.passed ? "1px solid rgba(79,216,196,0.3)" : "1px solid rgba(255,180,84,0.3)",
                  }}
                >
                  <strong>{gradeResult.passed ? "Nice — that's correct." : "Not quite."}</strong> {gradeResult.feedback}
                  {" "}(score: {gradeResult.score}/100)
                </div>
              )}

              <div style={styles.answerRow}>
                <input
                  style={styles.textInput}
                  placeholder="Type your answer"
                  value={checkAnswer}
                  onChange={(e) => setCheckAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitCheckAnswer()}
                  disabled={grading}
                />
                <button style={styles.leetRunBtn} onClick={submitCheckAnswer} disabled={grading}>
                  {grading ? "…" : "Check my answer"}
                </button>
              </div>
            </div>

            <div style={styles.lessonSection}>
              <div style={styles.lessonSectionLabel}>Ask a doubt</div>
              {doubtLog.length > 0 && (
                <div style={styles.doubtLog}>
                  {doubtLog.map((d, i) => (
                    <React.Fragment key={i}>
                      <div style={styles.bubbleUser}>{d.q}</div>
                      <div style={styles.bubbleAgent}>{d.a}</div>
                    </React.Fragment>
                  ))}
                </div>
              )}
              <div style={styles.answerRow}>
                <input
                  style={styles.textInput}
                  placeholder="e.g. why is this faster than a for loop?"
                  value={doubt}
                  onChange={(e) => setDoubt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askDoubt()}
                />
                <button style={styles.leetRunBtn} onClick={askDoubt}>Ask →</button>
              </div>
            </div>

            <button
              style={styles.primaryBtn}
              onClick={() => { stopReadAloud(); setPhase("practice"); }}
              disabled={!gradeResult || !gradeResult.passed}
            >
              {gradeResult && gradeResult.passed ? "Start coding exercise →" : "Pass the check question to continue"}
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={styles.leetWrap}>
      <div style={styles.leetLeft}>
        <div style={styles.leetTabs}>
          {["description", "hints", "solution"].map((t) => (
            <span
              key={t}
              onClick={() => setTab(t)}
              style={{
                ...styles.leetTab,
                ...(tab === t ? styles.leetTabActive : {}),
                textTransform: "capitalize",
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <div style={styles.leetLeftBody}>
          {tab === "description" && (
            <>
              <div style={styles.leetTitleRow}>
                <h2 style={styles.leetTitle}>1. NumPy arrays</h2>
                <span style={styles.leetDifficulty}>Concept · Easy</span>
              </div>
              <div style={styles.leetTagRow}>
                <span style={styles.leetTag}>arrays</span>
                <span style={styles.leetTag}>week 1</span>
                <span style={styles.leetTag}>numpy</span>
              </div>
              <p style={styles.leetBody}>
                Create an array and demonstrate one advantage it has over a plain Python list — no explicit loop
                needed for elementwise math.
              </p>
              <div style={styles.leetExample}>
                <div style={styles.leetExampleLabel}>Example 1:</div>
                <pre style={styles.leetExamplePre}>{`Input:  arr = np.array([1, 2, 3])\nOutput: arr * 2 -> array([2, 4, 6])`}</pre>
              </div>
              <div style={styles.leetConstraint}>
                <div style={styles.leetExampleLabel}>Why this matters:</div>
                <p style={styles.leetBody}>
                  Every downstream module — Pandas, scikit-learn, even tensors — assumes you're comfortable with
                  this data structure.
                </p>
              </div>
              <button style={styles.leetBackLink} onClick={() => setPhase("theory")}>
                ← Back to lesson
              </button>
            </>
          )}

          {tab === "hints" && (
            <>
              <div style={styles.leetTitleRow}>
                <h2 style={styles.leetTitle}>Hints</h2>
              </div>
              <ul style={styles.leetHintList}>
                {TUTOR_HINTS.map((h, i) => (
                  <li key={i} style={styles.leetHintItem}>{h}</li>
                ))}
              </ul>
            </>
          )}

          {tab === "solution" && (
            <>
              <div style={styles.leetTitleRow}>
                <h2 style={styles.leetTitle}>Reference solution</h2>
              </div>
              <div style={styles.leetExample}>
                <pre style={styles.leetExamplePre}>{TUTOR_SOLUTION}</pre>
              </div>
            </>
          )}
        </div>
      </div>

      <div style={styles.leetRight}>
        <div style={styles.leetEditorHeader}>
          <span style={styles.leetLangPill}>Python 3</span>
          <div style={{ display: "flex", gap: "8px" }}>
            <button style={styles.leetRunBtn} onClick={run}>▷ Run</button>
            <button style={styles.leetSubmitBtn} onClick={submit}>Submit</button>
          </div>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={styles.leetEditor}
          spellCheck={false}
        />
        <div style={styles.leetConsole}>
          {!consoleOut && <div style={styles.leetConsoleHint}>Run your code to see test results here.</div>}
          {consoleOut && (
            <>
              <div style={{ ...styles.leetVerdict, color: consoleOut.passed ? "var(--teal)" : "var(--rose)" }}>
                {consoleOut.passed ? "Accepted" : "Wrong answer"}
              </div>
              <div style={styles.leetTestList}>
                {consoleOut.tests.map((t, i) => (
                  <div key={i} style={styles.leetTestRow}>
                    <span style={{ color: t.pass ? "var(--teal)" : "var(--rose)" }}>{t.pass ? "✓" : "✗"}</span>
                    <span style={styles.leetTestDesc}>{t.desc}</span>
                  </div>
                ))}
              </div>
              {submitted && consoleOut.passed && (
                <div style={styles.masteryRow}>
                  <div style={{ ...styles.masteryLabel, color: "#8890a8" }}>Mastery · NumPy arrays</div>
                  <div style={styles.masteryTrack}>
                    <div style={{ ...styles.masteryFill, width: `${gradeResult ? gradeResult.score : 85}%` }} />
                  </div>
                  <button style={styles.primaryBtn} onClick={onNext}>View progress →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StepSummary({ student, plan }) {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);

  const fetchProgress = () => {
    setError(null);
    setProgress(null);
    fetch(`${API_BASE}/progress/${encodeURIComponent(student)}`)
      .then((r) => r.json())
      .then((d) => setProgress(d.progress))
      .catch(() => setError("Couldn't reach the backend. Is the FastAPI server running on port 8000?"));
  };

  useEffect(fetchProgress, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nextUp = (() => {
    if (!plan || !progress) return null;
    const passedConcepts = new Set(progress.filter((p) => p.passed).map((p) => p.concept));
    const upcoming = plan.weeks.find((w) => !passedConcepts.has(w.concept));
    return upcoming ? { week: upcoming.week, concept: CONCEPT_LABELS[upcoming.concept] || upcoming.concept } : null;
  })();

  return (
    <div style={styles.panel}>
      <div style={styles.eyebrow}>Step 6 of 6</div>
      <h2 style={styles.h2}>Progress, saved across sessions</h2>
      <p style={styles.bodyMuted}>Stored in SQLite so {student} can close the tab and pick up exactly where they left off.</p>

      {error && (
        <div style={styles.errorBox}>
          {error} <button style={styles.leetBackLink} onClick={fetchProgress}>Retry</button>
        </div>
      )}

      {!error && progress === null && <div style={styles.leetConsoleHint}>Loading saved progress…</div>}

      {progress !== null && progress.length === 0 && (
        <div style={styles.leetConsoleHint}>No mastery recorded yet — complete a lesson's check question first.</div>
      )}

      {progress !== null && progress.length > 0 && (
        <div style={styles.masteryList}>
          {progress.map((m) => (
            <div key={m.concept} style={styles.masteryListRow}>
              <div style={styles.masteryListLabel}>{CONCEPT_LABELS[m.concept] || m.concept}</div>
              <div style={styles.masteryTrack}>
                <div
                  style={{
                    ...styles.masteryFill,
                    width: `${m.score}%`,
                    background: m.passed ? "var(--teal)" : "var(--amber)",
                  }}
                />
              </div>
              <div style={styles.masteryListScore}>{m.score}%</div>
            </div>
          ))}
        </div>
      )}

      {nextUp && (
        <div style={styles.nextUpCard}>
          <div style={styles.nextUpLabel}>Up next</div>
          <div style={styles.nextUpConcept}>{nextUp.concept} — week {nextUp.week}</div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [navView, setNavView] = useState("curriculum");
  const [tutorPhase, setTutorPhase] = useState("theory");
  const [theme, setTheme] = useState("dark");
  const [studentName] = useState("Sayan");
  const [knowledgeMap, setKnowledgeMap] = useState({});
  const [gaps, setGaps] = useState([]);
  const [plan, setPlan] = useState(null);
  const next = () => setStep((s) => Math.min(s + 1, MODULES.length - 1));

  const screens = [
    <StepGoal onNext={next} />,
    <StepDiagnostic
      onNext={(km) => { setKnowledgeMap(km); next(); }}
    />,
    <StepGraph
      knowledgeMap={knowledgeMap}
      onNext={(g) => { setGaps(g); next(); }}
    />,
    <StepPlan
      gaps={gaps}
      student={studentName}
      onNext={(p) => { setPlan(p); next(); }}
    />,
    <StepTutor onNext={next} phase={tutorPhase} setPhase={setTutorPhase} student={studentName} />,
    <StepSummary student={studentName} plan={plan} />,
  ];

  const resumeToLearning = () => {
    setStep(4);
    setNavView("curriculum");
  };

  let bodyContent;
  if (navView === "dashboard") {
    bodyContent = <div style={styles.main}><DashboardPage onResume={resumeToLearning} /></div>;
  } else if (navView === "practice") {
    bodyContent = <div style={styles.main}><PracticePage /></div>;
  } else if (navView === "community") {
    bodyContent = <div style={styles.main}><CommunityPage /></div>;
  } else {
    const flush = step === 4 && tutorPhase === "practice";
    bodyContent = (
      <>
        <JourneyRail step={step} setStep={setStep} />
        <div style={{ ...styles.main, ...(flush ? styles.mainFlush : {}) }}>{screens[step]}</div>
      </>
    );
  }

  return (
    <div style={styles.app} data-theme={theme}>
      <style>{`
        [data-theme="dark"] {
          --bg: #0b0e16;
          --surface: #131829;
          --surface2: #1b2238;
          --hairline: #262f47;
          --text: #eef1f8;
          --muted: #8890a8;
          --dim: #4a5170;
          --teal: #4fd8c4;
          --amber: #ffb454;
          --violet: #8f8fe8;
          --rose: #ff6b8a;
          --teal-soft: #a8ede1;
          --amber-soft: #ffd9a0;
          --on-teal: #04342c;
          --on-violet: #12123a;
        }
        [data-theme="light"] {
          --bg: #f4f5f9;
          --surface: #ffffff;
          --surface2: #eef0f6;
          --hairline: #dde1ea;
          --text: #171a26;
          --muted: #5c6178;
          --dim: #9599ac;
          --teal: #0d9488;
          --amber: #b45309;
          --violet: #6d5cd6;
          --rose: #e11d48;
          --teal-soft: #0f766e;
          --amber-soft: #92400e;
          --on-teal: #ffffff;
          --on-violet: #ffffff;
        }
        * { box-sizing: border-box; }
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>
      <TopBar active={navView} onNavigate={setNavView} theme={theme} onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
      <div style={styles.body}>{bodyContent}</div>
    </div>
  );
}

const styles = {
  app: {
    display: "flex",
    flexDirection: "column",
    height: "760px",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "'Inter', sans-serif",
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid var(--hairline)",
    boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
  },
  topBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between", height: "52px", flexShrink: 0,
    background: "var(--surface)", borderBottom: "1px solid var(--hairline)", padding: "0 20px",
  },
  topBarLeft: { display: "flex", alignItems: "center", gap: "28px" },
  brandMark: { color: "var(--teal)", fontSize: "16px" },
  brandName: {
    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", marginLeft: "-18px",
  },
  topNav: { display: "flex", gap: "20px" },
  topNavItem: { fontSize: "13px", color: "var(--muted)", cursor: "pointer" },
  topNavItemActive: { color: "var(--text)", fontWeight: 600 },
  topBarRight: { display: "flex", alignItems: "center", gap: "16px" },
  searchInput: {
    background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "8px",
    padding: "7px 12px", fontSize: "12.5px", color: "var(--text)", width: "170px", fontFamily: "inherit",
  },
  iconBtn: { fontSize: "14px", opacity: 0.8, cursor: "pointer" },
  themeToggle: {
    background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "8px",
    width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "13px", cursor: "pointer", padding: 0,
  },
  avatar: {
    width: "26px", height: "26px", borderRadius: "50%", background: "var(--violet)", color: "var(--on-violet)",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700,
  },
  body: { display: "flex", flex: 1, minHeight: 0 },
  rail: {
    width: "260px",
    flexShrink: 0,
    background: "var(--surface)",
    borderRight: "1px solid var(--hairline)",
    position: "relative",
    padding: "28px 20px",
  },
  railHeader: { marginBottom: "24px", paddingLeft: "56px" },
  railHeaderTitle: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px" },
  railHeaderSub: { fontSize: "12px", color: "var(--muted)", marginTop: "2px" },
  railList: { display: "flex", flexDirection: "column", gap: "38px", position: "relative", zIndex: 1 },
  railItem: {
    display: "flex", alignItems: "center", gap: "14px", background: "none", border: "none", padding: 0,
    color: "inherit", font: "inherit",
  },
  railDot: {
    width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0, border: "1.5px solid",
    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "var(--on-teal)",
  },
  railLabel: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "14px" },
  railSub: { fontSize: "11px", color: "var(--muted)", marginTop: "2px", maxWidth: "150px" },
  main: { flex: 1, overflowY: "auto", padding: "40px 48px" },
  mainFlush: { padding: 0, overflow: "hidden" },
  panel: { maxWidth: "560px" },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.08em",
    color: "var(--amber)", marginBottom: "10px", textTransform: "uppercase",
  },
  h2: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "26px", fontWeight: 700, marginBottom: "10px" },
  bodyMuted: { color: "var(--muted)", fontSize: "14px", lineHeight: 1.7, marginBottom: "22px" },
  textarea: {
    width: "100%", background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "10px",
    padding: "14px 16px", color: "var(--text)", fontSize: "14px", fontFamily: "inherit", resize: "none",
    marginBottom: "14px",
  },
  chipRow: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "26px" },
  chip: {
    background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "20px", padding: "6px 14px",
    color: "var(--muted)", fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit",
  },
  primaryBtn: {
    background: "var(--teal)", color: "var(--on-teal)", border: "none", borderRadius: "8px", padding: "12px 22px",
    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "14px", cursor: "pointer",
  },
  errorBox: {
    background: "rgba(255,107,138,0.08)", border: "1px solid rgba(255,107,138,0.3)", color: "var(--rose)",
    borderRadius: "10px", padding: "12px 16px", fontSize: "13px", marginBottom: "18px", lineHeight: 1.6,
  },
  chatWindow: {
    display: "flex", flexDirection: "column", gap: "12px", background: "var(--surface2)",
    border: "1px solid var(--hairline)", borderRadius: "12px", padding: "20px", marginBottom: "20px",
    maxHeight: "320px", overflowY: "auto",
  },
  bubbleAgent: {
    alignSelf: "flex-start", background: "var(--surface)", border: "1px solid var(--hairline)",
    borderRadius: "12px", padding: "10px 14px", fontSize: "13.5px", maxWidth: "85%", lineHeight: 1.6,
  },
  bubbleAgentGood: {
    alignSelf: "flex-start", background: "rgba(79,216,196,0.1)", border: "1px solid rgba(79,216,196,0.3)",
    borderRadius: "12px", padding: "10px 14px", fontSize: "13.5px", maxWidth: "85%", lineHeight: 1.6, color: "var(--teal-soft)",
  },
  bubbleAgentWarn: {
    alignSelf: "flex-start", background: "rgba(255,180,84,0.1)", border: "1px solid rgba(255,180,84,0.3)",
    borderRadius: "12px", padding: "10px 14px", fontSize: "13.5px", maxWidth: "85%", lineHeight: 1.6, color: "var(--amber-soft)",
  },
  bubbleUser: {
    alignSelf: "flex-end", background: "var(--violet)", color: "var(--on-violet)", borderRadius: "12px",
    padding: "10px 14px", fontSize: "13.5px", maxWidth: "85%", lineHeight: 1.6,
  },
  graphCard: {
    background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "12px",
    padding: "16px", marginBottom: "18px",
  },
  graphLabel: { fontSize: "10px", fill: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" },
  legendRow: { display: "flex", gap: "18px", marginTop: "6px", paddingLeft: "6px" },
  legendItem: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--muted)" },
  legendDot: { width: "8px", height: "8px", borderRadius: "50%", display: "inline-block" },
  gapSummary: { marginBottom: "24px" },
  gapSummaryLabel: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "var(--muted)",
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px",
  },
  gapPillRow: { display: "flex", flexWrap: "wrap", gap: "8px" },
  gapPill: {
    background: "rgba(255,180,84,0.12)", border: "1px solid rgba(255,180,84,0.3)", color: "var(--amber-soft)",
    borderRadius: "20px", padding: "5px 12px", fontSize: "12.5px",
  },
  timeline: { display: "flex", flexDirection: "column", marginBottom: "26px" },
  weekCard: {
    background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "12px",
    padding: "18px 20px", marginBottom: "16px", position: "relative",
  },
  weekNumber: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "var(--teal)",
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px",
  },
  weekConcept: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "16px", marginBottom: "6px" },
  weekWhy: { fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 },
  weekConnector: {
    position: "absolute", left: "20px", bottom: "-16px", width: "1px", height: "16px", background: "var(--hairline)",
  },
  answerRow: { display: "flex", gap: "10px", marginBottom: "20px" },
  textInput: {
    flex: 1, background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "8px",
    padding: "10px 14px", color: "var(--text)", fontSize: "13.5px", fontFamily: "inherit",
  },
  masteryRow: { display: "flex", flexDirection: "column", gap: "10px" },
  masteryLabel: { fontSize: "12px", color: "var(--muted)" },
  masteryTrack: { width: "100%", height: "8px", background: "var(--surface2)", borderRadius: "4px", overflow: "hidden" },
  masteryFill: { height: "100%", background: "var(--teal)", borderRadius: "4px", transition: "width 0.4s ease" },
  masteryList: { display: "flex", flexDirection: "column", gap: "14px", marginBottom: "28px" },
  masteryListRow: { display: "grid", gridTemplateColumns: "140px 1fr 40px", alignItems: "center", gap: "12px" },
  masteryListLabel: { fontSize: "13px" },
  masteryListScore: { fontSize: "12px", color: "var(--muted)", textAlign: "right", fontFamily: "'JetBrains Mono', monospace" },
  nextUpCard: {
    background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "12px", padding: "18px 20px",
  },
  nextUpLabel: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "var(--amber)",
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px",
  },
  nextUpConcept: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "15px" },

  leetWrap: { display: "flex", height: "100%" },
  leetLeft: {
    width: "46%", flexShrink: 0, borderRight: "1px solid var(--hairline)",
    display: "flex", flexDirection: "column", overflow: "hidden",
  },
  leetTabs: {
    display: "flex", gap: "18px", padding: "12px 20px", borderBottom: "1px solid var(--hairline)",
    background: "var(--surface)", flexShrink: 0,
  },
  leetTab: { fontSize: "12.5px", color: "var(--muted)", cursor: "pointer", paddingBottom: "4px" },
  leetTabActive: { color: "var(--teal)", borderBottom: "2px solid var(--teal)" },
  leetLeftBody: { padding: "20px 24px", overflowY: "auto", flex: 1 },
  leetTitleRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" },
  leetTitle: { fontFamily: "'Space Grotesk', sans-serif", fontSize: "18px", fontWeight: 700 },
  leetDifficulty: {
    fontSize: "11px", color: "var(--teal-soft)", background: "rgba(79,216,196,0.12)",
    border: "1px solid rgba(79,216,196,0.3)", borderRadius: "6px", padding: "2px 8px",
  },
  leetTagRow: { display: "flex", gap: "8px", marginBottom: "18px" },
  leetTag: {
    fontSize: "11px", color: "var(--muted)", background: "var(--surface2)",
    border: "1px solid var(--hairline)", borderRadius: "6px", padding: "3px 9px",
  },
  leetBody: { fontSize: "13.5px", color: "var(--text)", lineHeight: 1.75, marginBottom: "16px" },
  leetExample: {
    background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "8px",
    padding: "12px 16px", marginBottom: "18px",
  },
  leetExampleLabel: { fontSize: "12px", fontWeight: 600, color: "var(--muted)", marginBottom: "8px" },
  leetExamplePre: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: "12.5px", color: "var(--text)",
    lineHeight: 1.7, whiteSpace: "pre-wrap", margin: 0,
  },
  leetConstraint: {
    borderLeft: "2px solid var(--amber)", paddingLeft: "14px", marginTop: "8px",
  },
  leetRight: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0 },
  leetEditorHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px",
    borderBottom: "1px solid var(--hairline)", background: "var(--surface)", flexShrink: 0,
  },
  leetLangPill: {
    fontSize: "12px", color: "var(--muted)", background: "var(--surface2)",
    border: "1px solid var(--hairline)", borderRadius: "6px", padding: "4px 10px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  leetRunBtn: {
    background: "var(--surface2)", color: "var(--text)", border: "1px solid var(--hairline)",
    borderRadius: "6px", padding: "6px 14px", fontSize: "12.5px", cursor: "pointer", fontFamily: "inherit",
  },
  leetSubmitBtn: {
    background: "var(--teal)", color: "var(--on-teal)", border: "none", borderRadius: "6px",
    padding: "6px 16px", fontSize: "12.5px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
  },
  leetEditor: {
    flex: 1, background: "#0a0d16", color: "#d6e2ff", border: "none", outline: "none",
    padding: "16px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px",
    lineHeight: 1.8, resize: "none",
  },
  leetConsole: {
    height: "180px", flexShrink: 0, borderTop: "1px solid #262f47", background: "#131829",
    padding: "14px 20px", overflowY: "auto", color: "#eef1f8",
  },
  leetConsoleHint: { fontSize: "12.5px", color: "#8890a8" },
  leetVerdict: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "14px", marginBottom: "10px" },
  leetTestList: { display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" },
  leetTestRow: { display: "flex", gap: "8px", fontSize: "12.5px" },
  leetTestDesc: { color: "#8890a8" },
  leetBackLink: {
    background: "none", border: "none", color: "var(--muted)", fontSize: "12.5px", cursor: "pointer",
    padding: 0, marginTop: "8px", fontFamily: "inherit", textDecoration: "underline",
  },
  leetHintList: { display: "flex", flexDirection: "column", gap: "12px", paddingLeft: "18px" },
  leetHintItem: { fontSize: "13.5px", color: "var(--text)", lineHeight: 1.7 },

  lessonWrap: { maxWidth: "820px" },
  lessonSection: { marginBottom: "22px" },
  lessonSectionLabel: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "var(--muted)",
    textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px",
  },
  lessonSectionRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px",
  },
  readAloudBtn: {
    background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "20px",
    padding: "4px 12px", fontSize: "11.5px", color: "var(--muted)", cursor: "pointer", fontFamily: "inherit",
  },
  lessonAnalogy: {
    background: "rgba(255,180,84,0.06)", border: "1px solid rgba(255,180,84,0.2)", borderRadius: "10px",
    padding: "14px 18px", fontSize: "13.5px", color: "var(--amber-soft)", lineHeight: 1.7, marginBottom: "22px",
  },
  doubtLog: {
    display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px",
  },

  pageWrap: { maxWidth: "760px", margin: "0 auto", padding: "40px 48px" },
  pageHeader: { marginBottom: "28px" },
  statRow: { display: "flex", gap: "14px", marginBottom: "28px" },
  statCard: {
    flex: 1, background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "12px",
    padding: "18px 20px",
  },
  statValue: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "22px", marginBottom: "4px" },
  statLabel: { fontSize: "12px", color: "var(--muted)" },
  continueCard: {
    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "24px",
    background: "var(--surface2)", border: "1px solid var(--hairline)", borderRadius: "12px",
    padding: "20px 24px", marginBottom: "32px",
  },
  continueLabel: { fontSize: "12px", color: "var(--muted)", marginBottom: "6px" },
  continueConcept: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "15px", marginBottom: "10px" },
  activityList: { display: "flex", flexDirection: "column", gap: "2px" },
  activityRow: {
    display: "flex", alignItems: "center", gap: "12px", padding: "12px 4px",
    borderBottom: "1px solid var(--hairline)", fontSize: "13px",
  },
  activityDot: { width: "6px", height: "6px", borderRadius: "50%", background: "var(--teal)", flexShrink: 0 },
  activityLabel: { flex: 1, color: "var(--text)" },
  activityWhen: { color: "var(--dim)", fontSize: "12px" },

  chipActive: { borderColor: "var(--teal)", color: "var(--teal)" },
  problemList: { display: "flex", flexDirection: "column", gap: "2px" },
  problemRow: {
    display: "flex", alignItems: "center", gap: "14px", padding: "14px 4px",
    borderBottom: "1px solid var(--hairline)",
  },
  problemStatus: { fontSize: "14px", width: "16px", textAlign: "center", flexShrink: 0 },
  problemTitle: { flex: 1, fontSize: "13.5px" },
  problemDifficulty: { fontSize: "12px", color: "var(--muted)", width: "60px", textAlign: "right" },

  threadList: { display: "flex", flexDirection: "column", gap: "12px" },
  threadCard: {
    display: "flex", alignItems: "center", gap: "16px", background: "var(--surface2)",
    border: "1px solid var(--hairline)", borderRadius: "12px", padding: "16px 20px",
  },
  threadTitle: { fontSize: "13.5px", marginBottom: "6px", lineHeight: 1.5 },
  threadMeta: { display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "var(--muted)" },
  threadReplies: { fontSize: "12px", color: "var(--dim)", flexShrink: 0 },
};
