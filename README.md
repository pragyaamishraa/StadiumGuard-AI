# 🏟️ Stadium Guardian AI

**An AI-powered intelligent stadium assistant that enhances fan experience, volunteer coordination, crowd management, accessibility, multilingual communication, and operational decision-making during major sporting events like the FIFA World Cup 2026.**

Built for a hackathon submission. Generative AI (Google Gemini) is the core
of every feature — not a bolt-on chatbot.

---

## ✨ Features

| Module | What it does |
|---|---|
| 🤖 **AI Stadium Copilot** | RAG-grounded chatbot answering questions about gates, seating, restrooms, food, rules, and emergencies, in 6 languages |
| 📊 **Crowd Intelligence Dashboard** | Live (simulated) gate/washroom/food-court/parking occupancy + Gemini-generated operational recommendations |
| ♿ **Accessibility Assistant** | Wheelchair-friendly routing, voice input, text-to-speech, high-contrast mode, large-text mode, full keyboard navigation |
| 🌍 **Multilingual Assistant** | English, Hindi, Spanish, French, Arabic, Portuguese — Gemini responds in the fan's chosen language |
| 🚨 **Emergency Assistant** | AI-triaged incident reporting (medical, lost child, fire, suspicious object) with priority, immediate actions, and evacuation guidance |
| 🌱 **Sustainability Dashboard** | Simulated electricity/water/waste metrics with Gemini-generated optimization suggestions |

---

## 🏗️ Architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for a full breakdown, and
[`docs/API.md`](docs/API.md) for the complete API reference.

```
stadium-guardian-ai/
├── backend/               # FastAPI application
│   ├── main.py
│   ├── core/              # config, security, database
│   ├── models/            # Pydantic schemas
│   ├── routers/           # one file per feature module
│   ├── services/          # Gemini, RAG, simulation logic
│   ├── data/               # local knowledge base (RAG source)
│   └── tests/              # pytest suite
├── frontend/               # React + Vite + Tailwind
│   └── src/
│       ├── pages/           # one page per feature module
│       ├── components/      # shared UI building blocks
│       ├── context/         # language, accessibility, toast state
│       ├── utils/           # API client, speech helpers
│       └── test/            # vitest + testing-library suite
├── docs/
├── requirements.txt
├── .env.example
└── README.md
```

**Stack:** React 18 · Vite · TailwindCSS · React Router · React Icons ·
Recharts · FastAPI · Pydantic · SQLite · Google Gemini API.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- A Google Gemini API key ([get one free](https://aistudio.google.com/app/apikey))

> The app runs even **without** a Gemini key — AI endpoints return a clearly
> labeled "offline mode" message instead of crashing, so you can explore the
> UI, RAG retrieval, dashboards, and simulated data immediately.

### 1. Backend setup

```bash
# From the project root
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

pip install -r requirements.txt
uvicorn backend.main:app --reload
```

The API will be running at `http://localhost:8000`. Interactive docs at
`http://localhost:8000/docs`.

### 2. Frontend setup

```bash
cd frontend
cp .env.example .env   # defaults to http://localhost:8000, adjust if needed

npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

### 3. Run tests

```bash
# Backend
python -m pytest backend/tests -v

# Frontend
cd frontend
npm run test
```

---

## 🔑 Environment Variables

### Root `.env` (backend)

| Variable | Description | Default |
|---|---|---|
| `GEMINI_API_KEY` | Your Google Gemini API key | *(required for live AI)* |
| `GEMINI_MODEL` | Gemini model name | `gemini-1.5-flash` |
| `ENV` | `development` or `production` | `development` |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins | `http://localhost:5173` |
| `DATABASE_PATH` | SQLite file path (relative to `backend/`) | `stadium_guardian.db` |
| `RAG_TOP_K` | Number of knowledge base chunks retrieved | `3` |
| `RAG_MIN_SCORE` | Minimum similarity score to use a chunk | `0.12` |

### `frontend/.env`

| Variable | Description | Default |
|---|---|---|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

---

## 🧠 How the AI is used (not an add-on)

- **RAG-grounded answers**: the Copilot retrieves relevant stadium
  knowledge-base entries via TF-IDF semantic search before calling Gemini,
  so answers to gate/seating/rules questions are accurate and cited — Gemini
  only falls back to general knowledge when nothing relevant is found.
- **Operational reasoning**: the Crowd Intelligence and Sustainability
  dashboards feed live simulated metrics into Gemini to generate specific,
  actionable recommendations (not canned text).
- **Emergency triage**: incident reports are summarized, prioritized, and
  given immediate action steps by Gemini in a structured format.
- **Multilingual by design**: every AI response is generated directly in the
  fan's selected language, not translated after the fact.

---

## 📸 Screenshots

*(Add screenshots of the Home, Copilot, Crowd Dashboard, Accessibility,
Emergency, and Sustainability pages here before submission.)*

---

## 🔒 Security Notes

- API keys are never exposed to the frontend or committed to source control
  (`.env` is git-ignored; `.env.example` has placeholders only).
- All user input is length-limited and sanitized server-side before use.
- CORS is restricted to configured origins.
- A global exception handler prevents stack traces from leaking to clients.

---

## 🔭 Future Scope

- Real IoT sensor integration to replace simulated crowd/sustainability data
- Push notifications for gate congestion and emergency alerts
- Admin/staff console for managing the knowledge base without redeploying
- Persistent per-fan chat history and personalized recommendations
- Integration with stadium ticketing systems for live seat navigation
- Offline-first PWA support for low-connectivity zones inside the stadium

---

## 📄 License

Built for hackathon submission purposes.
