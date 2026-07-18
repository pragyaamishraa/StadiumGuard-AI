"""Integration tests for the crowd intelligence and health endpoints."""
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from backend.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_crowd_snapshot_shape():
    response = client.get("/api/crowd/snapshot")
    assert response.status_code == 200
    body = response.json()
    assert "metrics" in body
    assert len(body["metrics"]) > 0
    for metric in body["metrics"]:
        assert metric["category"] in {"gate", "washroom", "food_court", "parking"}
        assert 0 <= metric["occupancy_percent"] <= 100


@patch("backend.routers.crowd.gemini_service.generate_text", new_callable=AsyncMock)
def test_crowd_recommendations_parses_numbered_list(mock_generate):
    mock_generate.return_value = "1. Open Gate C\n2. Deploy volunteers to Section 12"

    response = client.get("/api/crowd/recommendations")

    assert response.status_code == 200
    body = response.json()
    assert body["recommendations"] == ["Open Gate C", "Deploy volunteers to Section 12"]
