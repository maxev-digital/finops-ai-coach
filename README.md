# FinOps AI Coach

A RAG-powered, personalized AI Financial Wellness Coach with fiduciary guardrails and prompt evaluation. Built to demonstrate production-grade LLM application architecture on the same stack used by enterprise financial wellness platforms.

**Live demo:** https://fincoach.maxevdigital.com

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    fincoach.maxevdigital.com                    │
│                     Next.js 14 Frontend                      │
│   Landing │ AI Coach Demo │ Prompt Lab │ HR Insights         │
└─────────────────────┬───────────────────────────────────────┘
                      │ API calls (/api/*)
┌─────────────────────▼───────────────────────────────────────┐
│              FastAPI Backend (Python 3.12)                   │
│                                                             │
│  /chat      RAG pipeline → Claude generation                │
│  /profile   User profiles, goals, employer benefits         │
│  /evaluate  V1 vs V2 prompt comparison + LLM-as-judge       │
└──────┬─────────────────────────┬───────────────────────────┘
       │                         │
┌──────▼──────┐         ┌────────▼────────┐
│  PostgreSQL  │         │   OpenAI API    │
│  + pgvector  │         │  (embeddings)   │
│  port 5445   │         └─────────────────┘
│              │         ┌─────────────────┐
│  users       │         │  Anthropic API  │
│  profiles    │         │  (generation)   │
│  goals       │         └─────────────────┘
│  benefits    │         ┌─────────────────┐
│  messages    │         │     Redis       │
│  doc_chunks  │         │  (embed cache)  │
└──────────────┘         └─────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | FastAPI, Python 3.12, async SQLAlchemy |
| Database | PostgreSQL 16 + pgvector extension |
| Vector Search | pgvector cosine similarity (`<=>` operator) |
| Embeddings | OpenAI text-embedding-3-small (1536 dims) |
| Generation | Anthropic Claude claude-sonnet-4-6 |
| Caching | Redis (embedding cache, 1hr TTL) |
| Ingestion | LangChain (text splitting only) |
| Infrastructure | Docker (Postgres), PM2, nginx, certbot |

## Features

- **AI Coach Chat** — Hybrid RAG retrieval over financial wellness documents + structured user context injection. Responses are grounded, personalized, and include fiduciary disclaimers.
- **Personalization** — User profiles with goals, risk tolerance, and employer benefits (401k match, HSA, ESPP) injected into every prompt.
- **Prompt Lab** — Side-by-side comparison of V1 (naive baseline) vs V2 (production-grade) prompts on the same query, scored by Claude-as-judge on relevance, actionability, personalization, and safety.
- **HR Insights** — Aggregated analytics across users: top question categories, goal completion rates, benefit utilization gaps.

## Local Development

### Prerequisites
- Python 3.12+
- Node.js 20+
- Docker
- Redis

### Backend

```bash
cd backend
cp .env.example .env          # fill in API keys
pip install -r requirements-dev.txt

# Start Postgres with pgvector
docker run -d \
  --name finops-db-local \
  -e POSTGRES_USER=finops \
  -e POSTGRES_PASSWORD=finops_dev \
  -e POSTGRES_DB=finops \
  -p 5432:5432 \
  pgvector/pgvector:pg16

# Run database migrations
make db-init

# Ingest knowledge base documents
make ingest

# Seed demo users
make seed

# Start API server
make dev
# → http://localhost:8000
# → http://localhost:8000/docs  (OpenAPI)
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
# → http://localhost:3000
```

### Running Tests

```bash
# Backend
cd backend && make test

# Frontend
cd frontend && npm test
```

## Project Structure

```
finops-ai-coach/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py          # async SQLAlchemy + pgvector
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── routers/             # chat, profile, evaluate
│   │   ├── services/            # rag, llm, embeddings, evaluation
│   │   └── prompts/             # V1 baseline + V2 production templates
│   ├── ingest/
│   │   ├── pipeline.py          # document ingestion
│   │   └── documents/           # financial wellness knowledge base
│   ├── tests/
│   │   ├── conftest.py          # fixtures, mocked API clients
│   │   ├── test_api_chat.py
│   │   ├── test_api_profile.py
│   │   └── test_rag.py
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   └── Makefile
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # landing
│   │   ├── demo/page.tsx        # AI Coach interface
│   │   ├── prompt-lab/page.tsx  # prompt engineering demo
│   │   └── insights/page.tsx    # HR analytics
│   ├── components/
│   └── lib/
├── .github/
│   └── workflows/               # CI for backend + frontend
├── docker/
│   └── init.sql                 # pgvector extension setup
├── scripts/
│   ├── seed_demo_data.py
│   └── deploy.sh
├── CLAUDE.md                    # AI session context (this project)
└── README.md
```

## Deployment

```bash
# One-time VPS setup
ssh root@72.60.43.168
cd /var/www && git clone https://github.com/[owner]/finops-ai-coach.git
cd finops-ai-coach && ./scripts/deploy.sh --first-run

# Every subsequent deploy
ssh root@72.60.43.168 "cd /var/www/finops-ai-coach && ./scripts/deploy.sh"
```

## Demo Users

Three pre-seeded personas covering different life stages:

| User | Age | Situation | Primary Goal |
|------|-----|-----------|-------------|
| Alex Chen | 28 | Tech worker, student loans, ESPP available | Emergency fund + debt payoff |
| Maria Rodriguez | 42 | Mid-career, home purchase in 3 years | Down payment savings |
| Jordan Kim | 55 | Pre-retirement, conservative | Retire at 65 with $1.2M |

## Prompt Engineering

Two prompt versions are maintained for the evaluation feature:

- **V1 (Baseline)**: Minimal system prompt, no personalization, no structured response format
- **V2 (Production)**: Fiduciary guardrails, full profile injection, structured coaching format, explicit safety rules

The `/prompt-lab` page runs both on the same query and uses Claude-as-judge to score on four dimensions: Relevance, Actionability, Personalization, Safety.

---

*This is a demonstration project. All financial content is general education only, not personalized financial advice. Consult a licensed financial advisor for decisions specific to your situation.*
