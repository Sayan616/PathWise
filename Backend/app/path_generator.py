from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List
from .config import get_llm

llm = get_llm(temperature=0.3)


class WeekPlan(BaseModel):
    week: int = Field(description="Week number, starting at 1")
    concept: str = Field(description="Concept to learn this week")
    why: str = Field(description="One sentence on why this concept matters")


class LearningPlan(BaseModel):
    student: str = Field(description="Student name")
    weeks: List[WeekPlan] = Field(description="Week-by-week plan, in order")


parser = JsonOutputParser(pydantic_object=LearningPlan)

PROMPT = ChatPromptTemplate.from_messages([
    ("system",
     "Generate a week-by-week learning plan for the student, one concept per "
     "week, in the exact order given. Do not reorder them.\n{format_instructions}"),
    ("human", "Student: {student}. Concepts to cover in order: {gaps}"),
]).partial(format_instructions=parser.get_format_instructions())

chain = PROMPT | llm | parser


def generate_plan(student: str, gaps: list[str]) -> dict:
    return chain.invoke({"student": student, "gaps": ", ".join(gaps)})
