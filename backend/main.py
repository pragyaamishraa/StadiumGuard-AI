"""
Stadium Guardian AI — FastAPI application entrypoint.

Run with:
    uvicorn backend.main:app --reload
"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.core.config import get_settings
from backend.core.database import init_db
from backend.routers import accessibility, chat, crowd, emergency, sustainability

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("stadium_guardian")

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    logger.info("%s backend started (env=%s)", settings.APP_NAME, settings.ENV)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "AI-powered stadium assistant API: navigation, crowd intelligence, "
        "accessibility, multilingual chat, emergency response, and "
        "sustainability insights, backed by Google Gemini and a local RAG "
        "knowledge base."
    ),
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler so unexpected errors never leak stack traces to clients."""
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again."},
    )


@app.get("/", tags=["Health"])
async def root() -> dict:
    """Basic health check / welcome endpoint."""
    return {"status": "ok", "service": settings.APP_NAME, "version": "1.0.0"}


@app.get("/api/health", tags=["Health"])
async def health() -> dict:
    """Liveness probe used by the frontend to detect backend availability."""
    return {"status": "healthy"}


app.include_router(chat.router)
app.include_router(crowd.router)
app.include_router(emergency.router)
app.include_router(sustainability.router)
app.include_router(accessibility.router)
