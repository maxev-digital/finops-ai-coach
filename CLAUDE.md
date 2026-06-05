# CLAUDE.md — finops-ai-coach

Project context for Claude Code sessions. Update this file as part of any PR that changes architecture, decisions, or constraints. Do not let it go stale.

---

## What This Is

A production-quality demo of a RAG-powered AI Financial Wellness Coach, built to mirror the architecture of BrightPlan's AI Coach product. Originally built as a portfolio piece for a BrightPlan Applied AI Engineer application — designed to be launched as a real SMB financial wellness product if the opportunity presents.

Live URL (once deployed): https://coach.maxevdigital.com
GitHub: https://github.com/[owner]/finops-ai-coach

---

## Architecture Overview

```
frontend/          Next.js 14 App Router + shadcn/ui + Tailwind
                   → serves coach.maxevdigital.com (port 3035 on VPS)

backend/           FastAPI (async) + SQLAlchemy async + pgvector
                   → internal API at 127.0.0.1:8002 on VPS
                   → proxied through nginx at /api/*

database/          PostgreSQL 16 + pgvector extension
                   → Docker container: fiduciary-coach-db (port 5445 on VPS)
                   → named volume: finops_postgres_data

embeddings/        OpenAI text-embedding-3-small (1536 dims)
                   → Anthropic has no embedding API — OpenAI is the standard pairing
                   → results cached in Redis (port 6379) to avoid redundant API calls

generation/        Anthropic claude-sonnet-4-6
                   → direct SDK (not LangChain wrapper) for full control
                   → LangChain used for text splitting and document loading only

vector search/     Raw pgvector SQL (not LangChain's PGVector abstraction)
                   → gives explicit control over cosine distance operator (<=>)
                   → hybrid: vector search + structured Postgres query for user context
```

---

## Key Architectural Decisions

**Why async SQLAlchemy (not sync psycopg2)?**
FastAPI is async. Blocking DB calls in an async endpoint hold the event loop. Use `asyncpg` driver + `AsyncSession`. This matters at scale and shows production awareness.

**Why OpenAI for embeddings + Anthropic for generation?**
Anthropic has no embedding API. This split is standard in production — the two services are independently optimized. Cost: text-embedding-3-small is ~$0.02/1M tokens.

**Why raw SQL for vector search instead of LangChain PGVector?**
LangChain's PGVector abstraction hides the query and makes debugging harder. Raw SQL with the `<=>` operator is explicit, testable, and shows actual understanding of pgvector.

**Why LangChain at all?**
RecursiveCharacterTextSplitter and document loaders are well-tested utilities. No reason to rewrite them. LangChain is used ONLY for ingestion, not for retrieval or generation.

**Why two prompt versions (V1/V2)?**
The evaluation layer is a core demo feature. V1 is intentionally naive (shows baseline). V2 is production-grade with fiduciary guardrails and personalization injection. Claude-as-judge scores both. This directly demonstrates the "write and refine prompts" job requirement.

**Embedding cache rationale:**
The same query (e.g., "should I max my 401k?") will be asked by multiple demo users. Caching embeddings by query hash avoids duplicate OpenAI calls and shows cost awareness. Uses simple Redis with 1-hour TTL.

---

## VPS Deployment

```
Server:           root@72.60.43.168
SSH key:          ~/.ssh/id_ed25519
Project root:     /var/www/finops-ai-coach
Frontend PM2:     finops-coach-frontend  (port 3035)
Backend PM2:      finops-coach-api       (port 8002)
DB container:     fiduciary-coach-db     (port 5445)
DB image:         pgvector/pgvector:pg16 (NOT postgres:16-alpine — needs vector extension)
Deploy method:    git pull + ./scripts/deploy.sh
```

**Deploy pattern (every project on this VPS):**
- All other projects use SCP deploy (no git). This project is the exception — git-based.
- `./scripts/deploy.sh` runs: git pull → npm run build → copy static → pm2 restart

**NEVER use the Hostinger server for this project.** Hostinger hosts roofworksoftexas.com public site only. This project lives entirely on VPS 72.60.43.168.

---

## Git Workflow

Branch naming:
- `feature/short-description` — new functionality
- `fix/short-description` — bug fixes
- `chore/short-description` — tooling, config, deps
- `test/short-description` — adding/updating tests
- `docs/short-description` — documentation only

Commit convention (Conventional Commits):
```
feat: add hybrid RAG retrieval with pgvector cosine search
fix: handle missing user profile gracefully in chat endpoint
test: add pytest fixtures for mocked Anthropic client
docs: update CLAUDE.md with embedding cache decision
chore: add GitHub Actions CI for backend tests
refactor: extract prompt templates to dedicated module
```

Flow: feature branch → PR to `develop` → merge → PR to `main` → deploy

---

## Testing

**Backend (pytest + pytest-asyncio):**
- `tests/conftest.py` — async test DB, mock Anthropic client, mock OpenAI client
- Mock ALL paid API calls — tests must not spend money
- Use `pytest-httpx` for mocking HTTP clients
- Run: `cd backend && make test`

**Frontend (Vitest + React Testing Library):**
- Test key components: ChatWindow, ScoreCard, UserSelector
- Mock API calls with MSW
- Run: `cd frontend && npm test`

**CI:**
- `.github/workflows/backend-ci.yml` — runs on every PR to develop/main
- `.github/workflows/frontend-ci.yml` — typecheck + lint on every PR

---

## Project-Specific Rules

1. **Never commit `.env` files.** `.env.example` only. Actual `.env` is on VPS only.
2. **Never use Streamlit.** Frontend is Next.js + shadcn/ui.
3. **Never use sync SQLAlchemy.** This project is fully async throughout.
4. **Fiduciary disclaimer required** on every AI response — non-negotiable, it's in the schema.
5. **Mock paid APIs in tests** — Anthropic, OpenAI. Zero API spend in CI.
6. **Update this file** when architecture changes. Stale CLAUDE.md is worse than no CLAUDE.md.

---

## Domain + DNS

- DNS A record: `coach` → `72.60.43.168` (needs to be added in registrar)
- nginx config: `/etc/nginx/sites-enabled/coach.maxevdigital.com`
- SSL: certbot (same pattern as all other projects on this VPS)

---

## Product Context (Why This Exists)

BrightPlan (brightplan.com) is an enterprise financial wellness SaaS with:
- AI Coach (RAG-based, personalized, fiduciary standard)
- Human CFP network (50+ countries)
- 10+ years proprietary content library
- SOC2/ISO/CEFEX certifications
- Enterprise-only pricing, 6-month sales cycles

Our gap/opportunity: **No self-serve SMB tier exists.** Companies with 20-500 employees have no access to BrightPlan-quality financial wellness tools. This product targets that segment at $8-15/employee/month with transparent pricing and no sales cycle.

Caution on name: "FinOps" is an established term for cloud cost management (FinOps Foundation/CNCF). Rebrand before public launch — current name is fine for dev/portfolio context.
