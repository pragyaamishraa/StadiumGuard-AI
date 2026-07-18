"""Pydantic models used for request validation and response typing."""
from typing import Literal, Optional

from pydantic import BaseModel, Field

SupportedLanguage = Literal["en", "hi", "es", "fr", "ar", "pt"]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    language: SupportedLanguage = "en"
    session_id: Optional[str] = Field(default="anonymous", max_length=100)


class SourceChunk(BaseModel):
    title: str
    content: str
    score: float


class ChatResponse(BaseModel):
    reply: str
    sources: list[SourceChunk]
    used_knowledge_base: bool
    language: SupportedLanguage


class CrowdMetric(BaseModel):
    location: str
    category: Literal["gate", "washroom", "food_court", "parking"]
    occupancy_percent: int
    status: Literal["low", "moderate", "high", "critical"]


class CrowdSnapshot(BaseModel):
    generated_at: str
    metrics: list[CrowdMetric]


class RecommendationResponse(BaseModel):
    recommendations: list[str]
    generated_at: str


class EmergencyRequest(BaseModel):
    incident_type: Literal["medical", "lost_child", "fire", "suspicious_object", "other"]
    location: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=1000)
    reporter_contact: Optional[str] = Field(default=None, max_length=100)


class EmergencyResponse(BaseModel):
    incident_id: str
    summary: str
    immediate_actions: list[str]
    priority: Literal["low", "medium", "high", "critical"]
    suggested_evacuation_route: str
    volunteers_notified: list[str]


class SustainabilityMetric(BaseModel):
    metric: str
    value: float
    unit: str
    trend: Literal["up", "down", "stable"]


class SustainabilitySnapshot(BaseModel):
    generated_at: str
    metrics: list[SustainabilityMetric]
    suggestions: list[str]


class AccessibleRouteRequest(BaseModel):
    start: str = Field(..., min_length=1, max_length=100)
    destination: str = Field(..., min_length=1, max_length=100)


class AccessibleRouteResponse(BaseModel):
    route_steps: list[str]
    estimated_minutes: int
    accessible_features: list[str]
