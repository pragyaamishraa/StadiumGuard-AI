"""
Google Gemini integration service.

Centralizes every call to the Gemini API so routers never touch the SDK or
the API key directly. If GEMINI_API_KEY is not configured (e.g. local demo
without a key), this service falls back to a clearly-labeled offline
response instead of crashing the app.
"""
import logging

import google.generativeai as genai

from backend.core.config import get_settings

logger = logging.getLogger("stadium_guardian.gemini")

_settings = get_settings()
_configured = False

if _settings.GEMINI_API_KEY:
    genai.configure(api_key=_settings.GEMINI_API_KEY)
    _configured = True
else:
    logger.warning(
        "GEMINI_API_KEY not set. Gemini calls will return a fallback message "
        "until a valid key is added to your .env file."
    )

_LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "es": "Spanish",
    "fr": "French",
    "ar": "Arabic",
    "pt": "Portuguese",
}


def _get_model():
    return genai.GenerativeModel(_settings.GEMINI_MODEL)


async def generate_text(prompt: str, temperature: float = 0.4) -> str:
    """Generate a single text completion from Gemini.

    Returns a fallback string (never raises to the caller) if the API key is
    missing or the request fails, so the rest of the app stays usable.
    """
    if not _configured:
        return (
            "[Offline mode] Gemini API key is not configured. Add GEMINI_API_KEY "
            "to your .env file to enable live AI responses."
        )
    try:
        model = _get_model()
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(temperature=temperature),
        )
        return (response.text or "").strip()
    except Exception as exc:  # noqa: BLE001 - we deliberately degrade gracefully
        logger.error("Gemini generation failed: %s", exc)
        return (
            "I'm having trouble reaching the AI service right now. "
            "Please try again in a moment, or ask a volunteer for help."
        )


def build_copilot_prompt(
    user_message: str,
    language_code: str,
    context_chunks: list[str],
) -> str:
    """Construct a grounded RAG prompt for the Stadium Copilot chatbot."""
    language_name = _LANGUAGE_NAMES.get(language_code, "English")
    context_block = (
        "\n\n".join(f"- {chunk}" for chunk in context_chunks)
        if context_chunks
        else "No directly relevant stadium documents were found for this question."
    )
    return f"""You are Stadium Guardian AI, a friendly and precise assistant for fans \
attending a major stadium event.

Answer the fan's question using the STADIUM KNOWLEDGE CONTEXT below whenever it is \
relevant. If the context does not cover the question, you may answer using your \
general knowledge, but stay concise, practical, and safe.

Always respond in {language_name}. Keep answers short (2-4 sentences) and actionable.

STADIUM KNOWLEDGE CONTEXT:
{context_block}

FAN QUESTION:
{user_message}
"""


def build_crowd_recommendation_prompt(metrics_summary: str) -> str:
    """Construct a prompt asking Gemini for operational crowd-management advice."""
    return f"""You are an operations advisor for a major stadium's control room.

Given the current crowd metrics below, suggest 3 to 5 short, specific, actionable \
recommendations for stadium staff (e.g. redirecting fans, opening counters, \
deploying volunteers). Each recommendation must be a single sentence.

CURRENT METRICS:
{metrics_summary}

Return only the recommendations as a plain numbered list, nothing else.
"""


def build_emergency_prompt(incident_type: str, location: str, description: str) -> str:
    """Construct a prompt asking Gemini to triage an emergency report."""
    return f"""You are an emergency response coordinator for a stadium safety team.

An incident has been reported:
Type: {incident_type}
Location: {location}
Description: {description}

Respond ONLY in this exact format:
SUMMARY: <one sentence summary of the incident>
PRIORITY: <one of: low, medium, high, critical>
ACTIONS: <3 short immediate actions, separated by " | ">
ROUTE: <one short suggested evacuation or access route staff should use>
"""


def build_sustainability_prompt(metrics_summary: str) -> str:
    """Construct a prompt asking Gemini for sustainability optimization tips."""
    return f"""You are a sustainability operations advisor for a large stadium.

Given today's simulated resource metrics below, suggest 3 to 5 concise, practical \
optimization suggestions to reduce environmental impact during the event.

METRICS:
{metrics_summary}

Return only the suggestions as a plain numbered list, nothing else.
"""
