from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()


def get_llm(temperature: float = 0.2) -> ChatGroq:
    """Create a ChatGroq LLM instance. Called once per module, reused across requests."""
    return ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=temperature,
    )
