"""Crowd Intelligence Dashboard endpoints."""
import re

from fastapi import APIRouter

from backend.models.schemas import CrowdSnapshot, RecommendationResponse
from backend.services import gemini_service, simulation_service

router = APIRouter(prefix="/api/crowd", tags=["Crowd Intelligence"])


@router.get("/snapshot", response_model=CrowdSnapshot)
async def get_snapshot() -> CrowdSnapshot:
    """Return simulated live gate/washroom/food-court/parking occupancy data."""
    return simulation_service.get_crowd_snapshot()


@router.get("/recommendations", response_model=RecommendationResponse)
async def get_recommendations() -> RecommendationResponse:
    """Generate AI operational recommendations based on the current crowd snapshot."""
    snapshot = simulation_service.get_crowd_snapshot()
    summary = simulation_service.summarize_crowd_metrics(snapshot)
    prompt = gemini_service.build_crowd_recommendation_prompt(summary)
    raw_text = await gemini_service.generate_text(prompt, temperature=0.5)

    recommendations = [
        re.sub(r"^[\s\-\d.]+", "", line).strip()
        for line in raw_text.splitlines()
        if line.strip()
    ]
    if not recommendations:
        recommendations = [raw_text]

    return RecommendationResponse(
        recommendations=recommendations, generated_at=snapshot["generated_at"]
    )
