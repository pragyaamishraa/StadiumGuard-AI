"""Integration tests for the /api/emergency/report endpoint."""
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from backend.core.database import init_db
from backend.main import app

init_db()
client = TestClient(app)


@patch("backend.routers.emergency.gemini_service.generate_text", new_callable=AsyncMock)
def test_emergency_report_parses_structured_gemini_output(mock_generate):
    mock_generate.return_value = (
        "SUMMARY: A fan needs medical attention near Section 14.\n"
        "PRIORITY: high\n"
        "ACTIONS: Dispatch medical team | Clear the area | Notify control room\n"
        "ROUTE: Use the Gate C emergency access lane."
    )

    response = client.post(
        "/api/emergency/report",
        json={
            "incident_type": "medical",
            "location": "Section 14, near Gate C",
            "description": "A fan has collapsed and needs medical attention.",
        },
    )

    assert response.status_code == 200
    body = response.json()
    assert body["priority"] == "high"
    assert len(body["immediate_actions"]) == 3
    assert body["incident_id"].startswith("INC-")
    assert len(body["volunteers_notified"]) == 4  # high priority notifies more volunteers


@patch("backend.routers.emergency.gemini_service.generate_text", new_callable=AsyncMock)
def test_emergency_report_falls_back_gracefully_on_malformed_output(mock_generate):
    mock_generate.return_value = "Something went wrong and Gemini didn't follow the format."

    response = client.post(
        "/api/emergency/report",
        json={
            "incident_type": "lost_child",
            "location": "Food court near Gate A",
            "description": "A child has been separated from their parents.",
        },
    )

    assert response.status_code == 200
    body = response.json()
    # Falls back to a safe default priority and non-empty actions/route.
    assert body["priority"] in {"low", "medium", "high", "critical"}
    assert len(body["immediate_actions"]) > 0
    assert body["suggested_evacuation_route"]


def test_emergency_report_rejects_empty_location():
    response = client.post(
        "/api/emergency/report",
        json={"incident_type": "fire", "location": "   ", "description": "Smoke visible."},
    )
    assert response.status_code == 422


def test_emergency_report_rejects_invalid_incident_type():
    response = client.post(
        "/api/emergency/report",
        json={
            "incident_type": "alien_invasion",
            "location": "Gate A",
            "description": "Unclear situation.",
        },
    )
    assert response.status_code == 422
