"""Integration tests for the /api/accessibility/route endpoint."""
from fastapi.testclient import TestClient

from backend.core.database import init_db
from backend.main import app

init_db()
client = TestClient(app)


def test_accessible_route_returns_ordered_steps():
    response = client.post(
        "/api/accessibility/route", json={"start": "Gate A", "destination": "Seat B24"}
    )
    assert response.status_code == 200
    body = response.json()
    assert len(body["route_steps"]) == 5
    assert "Gate A" in body["route_steps"][0]
    assert "Seat B24" in body["route_steps"][-1]
    assert body["estimated_minutes"] >= 4


def test_accessible_route_includes_accessibility_features():
    response = client.post(
        "/api/accessibility/route", json={"start": "Gate B", "destination": "Section 10"}
    )
    body = response.json()
    assert "Ramp access" in body["accessible_features"]
    assert "Elevator access (no stairs)" in body["accessible_features"]


def test_accessible_route_rejects_empty_start():
    response = client.post(
        "/api/accessibility/route", json={"start": "  ", "destination": "Gate A"}
    )
    assert response.status_code == 422
