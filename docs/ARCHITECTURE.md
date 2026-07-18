# Architecture

## Overview

Stadium Guardian AI is a two-tier application: a FastAPI backend that owns
all AI orchestration and data, and a React (Vite) frontend that consumes it
over a JSON REST API.

```
┌─────────────────────┐        HTTPS/JSON        ┌──────────────────────────┐
│   React Frontend     │ ───────────────────────▶ │      FastAPI Backend     │
│  (Vite + Tailwind)   │ ◀─────────────────────── │                          │
└─────────────────────┘                            │  ┌────────────────────┐ │
                                                     │  │  Routers           │ │
                                                     │  │  chat / crowd /    │ │
                                                     │  │  emergency /       │ │
                                                     │  │  sustainability /  │ │
                                                     │  │  accessibility     │ │
                                                     │  └─────────┬──────────┘ │
                                                     │            │            │
                                                     │  ┌─────────▼──────────┐ │
                                                     │  │  Services           │ │
                                                     │  │  - gemini_service   │ │
                                                     │  │  - rag_service      │ │
                                                     │  │  - simulation_srv   │ │
                                                     │  └─────────┬──────────┘ │
                                                     │            │            │
                                                     │  ┌─────────▼──────────┐ │
                                                     │  │ SQLite (chat log,   │ │
                                                     │  │ emergency reports)  │ │
                                                     │  └─────────────────────┘ │
                                                     └──────────────┬───────────┘
                                                                    │
                                                          ┌─────────▼─────────┐
                                                          │  Google Gemini API │
                                                          └────────────────────┘
```

## Backend

- **`main.py`** — FastAPI app factory, CORS, global error handler, router
  registration, lifespan startup (DB init).
- **`routers/`** — one file per feature module. Routers only validate input,
  call services, and shape the response — no business logic lives here.
- **`services/gemini_service.py`** — the single place that talks to the
  Gemini SDK. Builds prompts, degrades gracefully to an "offline mode"
  message if `GEMINI_API_KEY` isn't set, and never lets an SDK exception
  bubble up to the client.
- **`services/rag_service.py`** — a from-scratch TF-IDF + cosine-similarity
  index over `data/knowledge_base.json`. Chosen over a vector DB because the
  knowledge base is ~20 short documents — a full embedding pipeline would add
  deployment complexity (API calls, vector store) without a measurable
  quality gain at this scale, while TF-IDF is dependency-free, deterministic,
  and testable.
- **`services/simulation_service.py`** — generates the "live" crowd and
  sustainability figures used by the dashboards, since the hackathon has no
  real IoT feed. Every simulated number is clearly labeled as such in the UI.
- **`core/config.py`** — typed settings loaded from environment variables.
- **`core/security.py`** — input sanitization shared by every router.
- **`core/database.py`** — SQLite persistence for chat history and emergency
  reports (used for basic auditability, not currently read back by the UI).

## Frontend

- **`context/`** — three lightweight React contexts: language selection,
  accessibility preferences (high contrast / large text / TTS), and toast
  notifications. All state is in-memory only (no browser storage, per
  environment constraints).
- **`utils/api.js`** — single fetch wrapper all pages use; centralizes error
  handling and the API base URL.
- **`utils/speech.js`** — wraps the browser's Web Speech API for voice input,
  with a supported-browser check.
- **`pages/`** — one route per feature module, each lazy-loaded via
  `React.lazy` so the initial bundle stays small.
- **`components/`** — shared, presentation-only building blocks (Card,
  StatusBadge, Skeleton, EmptyState, ErrorBoundary, Navbar, Footer).

## Why RAG instead of just prompting Gemini directly

Fan questions ("Where is Gate B?", "What's prohibited?") have exact,
authoritative answers that shouldn't be left to the model's general
knowledge. The RAG layer retrieves the most relevant knowledge-base entries
and injects them into the prompt as grounding context, so the model answers
from real stadium data first and only falls back to general knowledge when
nothing relevant is found — directly addressing the "no fake implementations"
and "AI as a core feature, not an add-on" requirements.

## Data flow example: Stadium Copilot

1. User types/speaks a question in the frontend.
2. `POST /api/chat` with `{ message, language, session_id }`.
3. Router sanitizes input, logs the user turn to SQLite.
4. `rag_service.retrieve()` returns the top-k relevant knowledge base chunks
   above a minimum similarity threshold.
5. `gemini_service.build_copilot_prompt()` assembles a grounded prompt in the
   requested language.
6. `gemini_service.generate_text()` calls Gemini (or returns an offline
   fallback message if no API key is configured).
7. Router logs the assistant turn and returns `{ reply, sources, ... }`.
8. Frontend renders the reply, its cited knowledge-base sources, and offers
   text-to-speech playback.
