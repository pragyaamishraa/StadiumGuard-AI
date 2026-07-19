"""Emergency Assistant endpoints."""
import re
import uuid

from fastapi import APIRouter, HTTPException

from backend.core.database import save_emergency_report
from backend.core.security import sanitize_text
from backend.models.schemas import EmergencyRequest, EmergencyResponse
from backend.services import gemini_service

router = APIRouter(prefix="/api/emergency", tags=["Emergency Assistant"])

# Simulated volunteer roster used to "notify" nearby volunteers on report.
_VOLUNTEER_POOL = [
    "Volunteer #12 (Gate A)",
    "Volunteer #07 (Gate B)",
    "Volunteer #21 (Gate C)",
    "Volunteer #15 (Gate D)",
    "Medical Team Lead",
]

_PRIORITY_VALUES = {"low", "medium", "high", "critical"}


def _parse_gemini_emergency_output(raw_text: str) -> dict:
    """Parse the structured SUMMARY/PRIORITY/ACTIONS/ROUTE format from Gemini."""
    fields = {"summary": "", "priority": "medium", "actions": [], "route": ""}

    summary_match = re.search(r"SUMMARY:\s*(.+)", raw_text)
    priority_match = re.search(r"PRIORITY:\s*(\w+)", raw_text, re.IGNORECASE)
    actions_match = re.search(r"ACTIONS:\s*(.+)", raw_text)
    route_match = re.search(r"ROUTE:\s*(.+)", raw_text)

    if summary_match:
        fields["summary"] = summary_match.group(1).strip()
    if priority_match and priority_match.group(1).lower() in _PRIORITY_VALUES:
        fields["priority"] = priority_match.group(1).lower()
    if actions_match:
        fields["actions"] = [a.strip() for a in actions_match.group(1).split("|") if a.strip()]
    if route_match:
        fields["route"] = route_match.group(1).strip()

    if not fields["summary"]:
        fields["summary"] = raw_text[:200] or "Incident reported; awaiting triage."
    if not fields["actions"]:
        fields["actions"] = ["Alert nearest volunteer team", "Assess situation on-site"]
    if not fields["route"]:
        fields["route"] = "Use nearest marked green exit sign."

    return fields


@router.post("/report", response_model=EmergencyResponse)
async def report_emergency(request: EmergencyRequest) -> EmergencyResponse:
    """Triage an incoming emergency report and simulate volunteer notification."""
    try:
        clean_location = sanitize_text(request.location, max_length=200)
        clean_description = sanitize_text(request.description, max_length=1000)
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    prompt = gemini_service.build_emergency_prompt(
        incident_type=request.incident_type,
        location=clean_location,
        description=clean_description,
    )
    raw_text = await gemini_service.generate_text(prompt, temperature=0.2)
    parsed = _parse_gemini_emergency_output(raw_text)

    incident_id = f"INC-{uuid.uuid4().hex[:8].upper()}"
    save_emergency_report(
        incident_id=incident_id,
        incident_type=request.incident_type,
        location=clean_location,
        description=clean_description,
        priority=parsed["priority"],
    )

    notified_count = 2 if parsed["priority"] in ("low", "medium") else 4
    volunteers_notified = _VOLUNTEER_POOL[:notified_count]

    return EmergencyResponse(
        incident_id=incident_id,
        summary=parsed["summary"],
        immediate_actions=parsed["actions"],
        priority=parsed["priority"],
        suggested_evacuation_route=parsed["route"],
        volunteers_notified=volunteers_notified,
    )
