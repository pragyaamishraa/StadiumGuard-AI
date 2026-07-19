"""Integration tests for the /api/sustainability/snapshot endpoint."""
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from backend.core.database import init_db
from backend.main import app

init_db()
client = TestClient(app)


def test_sustainability_snapshot_shape():
    response = client.get("/api/sustainability/snapshot")
    assert response.status_code == 200
    body = response.json()
    assert "metrics" in body
    assert len(body["metrics"]) == 4
    for metric in body["metrics"]:
        assert metric["trend"] in {"up", "down", "stable"}
        assert metric["value"] >= 0


@patch("backend.routers.sustainability.gemini_service.generate_text", new_callable=AsyncMock)
def test_sustainability_suggestions_parses_numbered_list(mock_generate):
    mock_generate.return_value = "1. Switch to LED lighting\n2. Recycle more water"

    response = client.get("/api/sustainability/snapshot")

    assert response.status_code == 200
    body = response.json()
    assert body["suggestions"] == ["Switch to LED lighting", "Recycle more water"]
