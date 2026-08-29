from langchain_core.prompts import ChatPromptTemplate
from .config import get_llm

llm = get_llm(temperature=0.2)

ASK_TEMPLATE = ChatPromptTemplate.from_messages([
    ("system",
     "You are diagnosing a student's Python/ML knowledge. Ask ONE short, specific "
     "question to test if they know {concept}. Do not explain anything — just ask "
     "the question."),
    ("human", "Ask the question now."),
])

VERDICT_TEMPLATE = ChatPromptTemplate.from_messages([
    ("system",
     "You are diagnosing a student's knowledge of {concept}. You asked them the "
     "question below, and they gave the answer below. Reply with exactly one word: "
     "KNOWN if the answer correctly and specifically addresses the question, or "
     "UNKNOWN if it doesn't — a vague confidence claim with no real answer "
     "('I use this daily', 'that's easy for me') counts as UNKNOWN."),
    ("human", "Question: {question}\nStudent answer: {answer}"),
])


def ask_question(concept: str) -> str:
    prompt = ASK_TEMPLATE.invoke({"concept": concept})
    return llm.invoke(prompt).content.strip()


def evaluate_answer(concept: str, question: str, answer: str) -> str:
    prompt = VERDICT_TEMPLATE.invoke({"concept": concept, "question": question, "answer": answer})
    verdict = llm.invoke(prompt).content.strip().upper()
    # check UNKNOWN first — it contains the substring "KNOWN"
    if "UNKNOWN" in verdict:
        return "UNKNOWN"
    if "KNOWN" in verdict:
        return "KNOWN"
    return "UNKNOWN"  # safe fallback if the model replies with something unexpected
