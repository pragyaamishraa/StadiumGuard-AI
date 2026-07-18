"""Unit tests for the RAG retrieval utility."""
from backend.services import rag_service


def test_retrieve_returns_relevant_gate_chunk():
    results = rag_service.retrieve("Where is Gate B?", top_k=3)
    assert len(results) > 0
    titles = [r.title for r in results]
    assert any("Gate B" in title for title in titles)


def test_retrieve_returns_empty_for_blank_query():
    results = rag_service.retrieve("   ", top_k=3)
    assert results == []


def test_retrieve_respects_top_k():
    results = rag_service.retrieve("gate seating restroom food parking", top_k=2)
    assert len(results) <= 2


def test_retrieve_scores_are_sorted_descending():
    results = rag_service.retrieve("prohibited items rules", top_k=5)
    scores = [r.score for r in results]
    assert scores == sorted(scores, reverse=True)
