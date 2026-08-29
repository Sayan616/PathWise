import os
import chromadb
from .curriculum_corpus import CURRICULUM

PERSIST_DIR = os.path.join(os.path.dirname(__file__), "..", "chroma_db")

_client = None
_collection = None


def _chunk(text: str, size: int = 400, overlap: int = 50) -> list[str]:
    """Simple sliding-window chunker — good enough for our short corpus."""
    text = text.strip()
    chunks = []
    start = 0
    while start < len(text):
        end = start + size
        chunks.append(text[start:end])
        start = end - overlap
    return [c.strip() for c in chunks if c.strip()]


def get_collection():
    """
    Returns the Chroma collection, building it from CURRICULUM on first run.
    Uses ChromaDB's built-in default embedding function (a small local ONNX
    model) — no PyTorch, no external API, downloads once on first use.
    """
    global _client, _collection
    if _collection is not None:
        return _collection

    _client = chromadb.PersistentClient(path=PERSIST_DIR)
    existing_names = [c.name for c in _client.list_collections()]

    if "curriculum" in existing_names:
        _collection = _client.get_collection("curriculum")
        return _collection

    _collection = _client.create_collection("curriculum")
    ids, docs, metadatas = [], [], []
    for concept, text in CURRICULUM.items():
        for i, chunk in enumerate(_chunk(text)):
            ids.append(f"{concept}-{i}")
            docs.append(chunk)
            metadatas.append({"concept": concept})
    _collection.add(ids=ids, documents=docs, metadatas=metadatas)
    return _collection


def retrieve_context(concept: str, k: int = 3) -> str:
    """Vector search restricted to the target concept's chunks, stitched into one context block."""
    collection = get_collection()
    results = collection.query(
        query_texts=[f"explain {concept} for a beginner"],
        n_results=k,
        where={"concept": concept},
    )
    docs = results.get("documents", [[]])[0]
    if not docs:
        # fall back to the raw corpus entry if retrieval somehow comes up empty
        return CURRICULUM.get(concept, "")
    return "\n\n".join(docs)
