from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from .config import get_llm
from .rag_engine import retrieve_context

llm = get_llm(temperature=0.3)


class Lesson(BaseModel):
    explanation: str = Field(description="A clear, beginner-friendly explanation of the concept, 3-5 sentences")
    check_question: str = Field(description="One question that tests real understanding, not just recall")


lesson_parser = JsonOutputParser(pydantic_object=Lesson)

TEACH_TEMPLATE = ChatPromptTemplate.from_messages([
    ("system",
     "You are a patient tutor. Using ONLY the reference material below, explain "
     "{concept} simply, then ask one check question that tests real understanding.\n\n"
     "Reference material:\n{context}\n\n{format_instructions}"),
    ("human", "Teach me {concept}."),
]).partial(format_instructions=lesson_parser.get_format_instructions())

teach_chain = TEACH_TEMPLATE | llm | lesson_parser


def teach(concept: str) -> dict:
    context = retrieve_context(concept)
    return teach_chain.invoke({"concept": concept, "context": context})


class Grade(BaseModel):
    passed: bool = Field(description="true if the answer demonstrates real understanding")
    score: int = Field(description="a score from 0 to 100")
    feedback: str = Field(description="one or two encouraging sentences of feedback")


grade_parser = JsonOutputParser(pydantic_object=Grade)

GRADE_TEMPLATE = ChatPromptTemplate.from_messages([
    ("system",
     "You are grading a student's answer to a check question about {concept}. "
     "Reference material:\n{context}\n\n{format_instructions}"),
    ("human", "Question: {question}\nStudent answer: {answer}"),
]).partial(format_instructions=grade_parser.get_format_instructions())

grade_chain = GRADE_TEMPLATE | llm | grade_parser


def grade(concept: str, question: str, answer: str) -> dict:
    context = retrieve_context(concept)
    return grade_chain.invoke({"concept": concept, "context": context, "question": question, "answer": answer})
