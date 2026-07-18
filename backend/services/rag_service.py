"""
Retrieval-Augmented Generation (RAG) service.

Implements a lightweight TF-IDF + cosine-similarity semantic search over the
local stadium knowledge base. A full vector database is overkill for a
~20-document knowledge base, so this uses pure Python (stdlib only) to stay
dependency-light while still doing genuine semantic-ish retrieval instead of
naive substring matching.
"""
import json
import math
import re
from collections import Counter
from pathlib import Path
from typing import NamedTuple

_TOKEN_RE = re.compile(r"[a-z0-9]+")
_KB_PATH = Path(__file__).resolve().parent.parent / "data" / "knowledge_base.json"


class RetrievedChunk(NamedTuple):
    id: str
    title: str
    content: str
    score: float


def _tokenize(text: str) -> list[str]:
    return _TOKEN_RE.findall(text.lower())


class TfidfIndex:
    """A minimal in-memory TF-IDF index built once at startup."""

    def __init__(self, documents: list[dict]):
        self.documents = documents
        self._doc_tokens: list[list[str]] = [
            _tokenize(f"{doc['title']} {doc['content']}") for doc in documents
        ]
        self._doc_freq: Counter = Counter()
        for tokens in self._doc_tokens:
            for term in set(tokens):
                self._doc_freq[term] += 1

        self._n_docs = len(documents)
        self._idf: dict[str, float] = {
            term: math.log((self._n_docs + 1) / (freq + 1)) + 1
            for term, freq in self._doc_freq.items()
        }
        self._doc_vectors: list[dict[str, float]] = [
            self._vectorize(tokens) for tokens in self._doc_tokens
        ]

    def _vectorize(self, tokens: list[str]) -> dict[str, float]:
        term_counts = Counter(tokens)
        vector = {
            term: (count / len(tokens)) * self._idf.get(term, 0.0)
            for term, count in term_counts.items()
        }
        return vector

    @staticmethod
    def _cosine_similarity(vec_a: dict[str, float], vec_b: dict[str, float]) -> float:
        common_terms = set(vec_a) & set(vec_b)
        dot_product = sum(vec_a[t] * vec_b[t] for t in common_terms)
        norm_a = math.sqrt(sum(v * v for v in vec_a.values()))
        norm_b = math.sqrt(sum(v * v for v in vec_b.values()))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot_product / (norm_a * norm_b)

    def search(self, query: str, top_k: int = 3) -> list[RetrievedChunk]:
        query_tokens = _tokenize(query)
        if not query_tokens:
            return []
        query_vector = self._vectorize(query_tokens)

        scored = [
            RetrievedChunk(
                id=doc["id"],
                title=doc["title"],
                content=doc["content"],
                score=self._cosine_similarity(query_vector, doc_vector),
            )
            for doc, doc_vector in zip(self.documents, self._doc_vectors)
        ]
        scored.sort(key=lambda chunk: chunk.score, reverse=True)
        return [chunk for chunk in scored[:top_k] if chunk.score > 0]


def load_knowledge_base() -> list[dict]:
    with open(_KB_PATH, encoding="utf-8") as f:
        return json.load(f)


# Built once at import time — the knowledge base is small and static.
_INDEX = TfidfIndex(load_knowledge_base())


def retrieve(query: str, top_k: int = 3) -> list[RetrievedChunk]:
    """Return the top-k most relevant knowledge base chunks for a query."""
    return _INDEX.search(query, top_k=top_k)
