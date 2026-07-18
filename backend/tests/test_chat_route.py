"""Integration tests for the /api/chat endpoint, with Gemini calls mocked out."""
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from backend.core.database import init_db
from backend.main import app

init_db()  # ensure tables exist for this test session
client = TestClient(app)


@patch("backend.routers.chat.gemini_service.generate_text", new_callable=AsyncMock)
def test_chat_returns_grounded_answer(mock_generate):
    mock_generate.return_value = "Gate B is on the East side of the stadium."

    response = client.post(
        "/api/chat", json={"message": "Where is Gate B?", "language": "en"}
    )

    assert response.status_code == 200
    body = response.json()
    assert body["reply"] == "Gate B is on the East side of the stadium."
    assert body["used_knowledge_base"] is True
    assert any("Gate B" in s["title"] for s in body["sources"])


@patch("backend.routers.chat.gemini_service.generate_text", new_callable=AsyncMock)
def test_chat_rejects_empty_message(mock_generate):
    response = client.post("/api/chat", json={"message": "   ", "language": "en"})
    assert response.status_code == 422
    mock_generate.assert_not_called()


def test_chat_rejects_unsupported_language():
    response = client.post(
        "/api/chat", json={"message": "Hello", "language": "zz"}
    )
    assert response.status_code == 422
