"""Sustainability Dashboard endpoints."""
import re

from fastapi import APIRouter

from backend.models.schemas import SustainabilitySnapshot
from backend.services import gemini_service, simulation_service

router = APIRouter(prefix="/api/sustainability", tags=["Sustainability"])


@router.get("/snapshot", response_model=SustainabilitySnapshot)
async def get_snapshot() -> SustainabilitySnapshot:
    """Return simulated resource metrics plus AI-generated optimization tips."""
    snapshot = simulation_service.get_sustainability_snapshot()
    summary = simulation_service.summarize_sustainability_metrics(snapshot)
    prompt = gemini_service.build_sustainability_prompt(summary)
    raw_text = await gemini_service.generate_text(prompt, temperature=0.5)

    suggestions = [
        re.sub(r"^[\s\-\d.]+", "", line).strip()
        for line in raw_text.splitlines()
        if line.strip()
    ]
    if not suggestions:
        suggestions = [raw_text]

    return SustainabilitySnapshot(
        generated_at=snapshot["generated_at"],
        metrics=snapshot["metrics"],
        suggestions=suggestions,
    )
