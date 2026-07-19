"""
Application configuration.

All secrets and environment-specific values are loaded from environment
variables (via a .env file in development). Nothing sensitive is hard-coded.
"""
import os
from functools import lru_cache

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Centralized application settings, populated from environment variables."""

    APP_NAME: str = "Stadium Guardian AI"
    ENV: str = os.getenv("ENV", "development")

    # Gemini
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # CORS
    ALLOWED_ORIGINS: list[str] = os.getenv(
        "ALLOWED_ORIGINS", "http://localhost:5173"
    ).split(",")

    # Database
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", "stadium_guardian.db")

    # RAG
    RAG_TOP_K: int = int(os.getenv("RAG_TOP_K", "3"))
    RAG_MIN_SCORE: float = float(os.getenv("RAG_MIN_SCORE", "0.12"))


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance (avoids re-reading env vars every call)."""
    return Settings()