"""Accessibility Assistant endpoints."""
from fastapi import APIRouter

from backend.models.schemas import AccessibleRouteRequest, AccessibleRouteResponse
from backend.core.security import sanitize_text

router = APIRouter(prefix="/api/accessibility", tags=["Accessibility"])

_ACCESSIBLE_FEATURES = [
    "Ramp access",
    "Wide turnstiles",
    "Elevator access (no stairs)",
    "Accessible restroom nearby",
    "Reserved accessible seating",
]


@router.post("/route", response_model=AccessibleRouteResponse)
async def get_accessible_route(request: AccessibleRouteRequest) -> AccessibleRouteResponse:
    """Return a simulated wheelchair-friendly route between two stadium points.

    This uses a deterministic, rule-based route generator (not the LLM) since
    physical routing should be reliable and reproducible rather than
    generative — a good example of using AI only where it adds value.
    """
    start = sanitize_text(request.start, max_length=100)
    destination = sanitize_text(request.destination, max_length=100)

    steps = [
        f"Start at {start} and proceed to the nearest ramp or elevator access point.",
        "Follow the blue accessible-route signage along the main concourse.",
        "Use the elevator (avoid stairs and escalators) to reach the correct level.",
        f"Continue along the accessible path toward {destination}.",
        f"Arrive at {destination} — accessible seating and restrooms are nearby.",
    ]

    return AccessibleRouteResponse(
        route_steps=steps,
        estimated_minutes=max(4, min(20, (len(start) + len(destination)) % 12 + 4)),
        accessible_features=_ACCESSIBLE_FEATURES,
    )
