# CLAUDE.md — finops-ai-coach

Project context for Claude Code sessions. Update this file as part of any PR that changes architecture, decisions, or constraints. Do not let it go stale.

---

## What This Is

A production-quality prototype of the **generative overlay pattern** — a RAG layer on top of structured user financial data, built to mirror BrightPlan's "Just Ask" feature architecture.

**Primary purpose:** Portfolio demo for BrightPlan Applied AI Engineer application.
**Secondary purpose:** Launchable SMB financial wellness product if the job doesn't materialize.

**Live URL:** https://fincoach.maxevdigital.com
**GitHub:** https://github.com/maxev-digital/finops-ai-coach

---

## BrightPlan Context (Critical for Framing)

BrightPlan's core platform is **ASP.NET + AWS** — a decade-old financial wellness engine with a patented 500-point Financial Wellness Score (launched 2019). "Just Ask" is a **generative AI overlay** launched August 2024 on top of that existing system.

The Python/FastAPI/pgvector stack in the JD is **specifically for the generative layer**, not the core platform.

**The role is:** Expanding "Just Ask" — not building financial AI from scratch. The challenge is integrating a generative layer into a system with established domain logic, proprietary financial data, and strict fiduciary requirements.

**Demo framing:** Position this as "a prototype of that generative overlay pattern" — not a standalone chatbot. Emphasize:
1. Grounding: responses tethered to retrieved source documents, not hallucinated
2. Personalization: structured user context (goals, benefits, profile) injected into every prompt
3. Evaluation layer: how you improve prompt quality on a live system
4. Fiduciary compliance: guardrails baked into the prompt architecture

---

## Current Build State (as of last session)

### What is DONE and merged to develop/main:
- Full async FastAPI backend: config, database, models, schemas, main
- All routers: /chat, /profile (users/goals/benefits), /evaluate
- All services: rag.py (hybrid retrieval), llm.py, embeddings.py (Redis cache), evaluation.py
- Prompt templates: V1 naive baseline + V2 production (prompts/coach.py)
- Document ingestion pipeline (ingest/pipeline.py)
- 5 knowledge base documents (retirement, benefits, budgeting, debt, investing)
- pytest smoke tests + conftest with mocked API clients
- Backend CI (GitHub Actions) — all green

### What is IN PROGRESS (feat/frontend branch, PR open):
- Next.js 15 frontend scaffolded: package.json, tsconfig, tailwind, next.config
- Design system: brand blues (#1e40af) + wellness greens (#059669), Inter font
- Nav component, root layout, globals.css
- Landing page (page.tsx) — hero, stats, features, tech stack
- lib/api.ts — typed fetch client
- 3 feature pages: /demo (chat), /prompt-lab (eval comparison), /insights (HR analytics)
- Components: ProfileSidebar, UserSelector, ScoreCard
- Frontend CI — fixing lint/test errors (in progress)

### What is NOT YET DONE:
- [ ] VPS deploy: git clone to /var/www/finops-ai-coach, .env file, pm2 setup
- [ ] deploy.sh script
- [ ] ecosystem.config.js for PM2
- [ ] Seed demo data on VPS (scripts/seed_demo_data.py)
- [ ] Document ingestion run on VPS (make ingest)
- [ ] Repo made public (currently private — make public after demo is live)
- [ ] CLAUDE.md DNS section update (coach record is obsolete, fincoach is live)
- [ ] Copy update: landing page should use "generative overlay" framing

---

## Architecture Overview

```
frontend/          Next.js 15 App Router + Tailwind CSS
                   → serves fincoach.maxevdigital.com (port 3035 on VPS)
                   → nginx proxies /api/* to FastAPI

backend/           FastAPI (async) + SQLAlchemy async + pgvector
                   → internal API at 127.0.0.1:8002 on VPS
                   → proxied through nginx at /api/*

database/          PostgreSQL 16 + pgvector 0.8.2
                   → Docker container: finops-coach-db (port 5445 on VPS)
                   → named volume: finops_coach_postgres_data

embeddings/        OpenAI text-embedding-3-small (1536 dims)
                   → cached in Redis with 1hr TTL (graceful degrade if Redis down)

generation/        Anthropic claude-sonnet-4-6
                   → direct SDK (not LangChain wrapper)
                   → LangChain used ONLY for text splitting in ingest pipeline

vector search/     Raw pgvector SQL — cosine distance operator <=>
                   → NOT LangChain PGVector abstraction (too opaque for interviews)
                   → hybrid: pgvector similarity + structured Postgres user context
```

---

## VPS Infrastructure (all live)

```
Server:           root@72.60.43.168
SSH key:          ~/.ssh/id_ed25519
Project root:     /var/www/finops-ai-coach  (NOT CLONED YET — next step)
Frontend PM2:     finops-coach-frontend  (port 3035)
Backend PM2:      finops-coach-api       (port 8002, internal only)
DB container:     finops-coach-db        (port 5445)
DB image:         pgvector/pgvector:pg16 (pgvector 0.8.2 installed and verified)
nginx config:     /etc/nginx/sites-enabled/fincoach.maxevdigital.com (live + SSL)
SSL cert:         /etc/letsencrypt/live/fincoach.maxevdigital.com/ (issued)
Deploy method:    git pull → ./scripts/deploy.sh
```

DB credentials (for .env on VPS):
```
DATABASE_URL=postgresql+asyncpg://finops_coach:finops_coach_secure_2026@localhost:5445/finops_coach
```

**All other VPS projects use SCP deploy. This project is git-based — the exception.**
**NEVER use Hostinger for this project.** Hostinger = roofworksoftexas.com only.

---

## Git Branch State

```
main      ← has backend + frontend code (PR #2 accidentally merged here, then synced)
develop   ← synced with main, use as base for all new branches
feat/frontend ← current active branch, PR open, CI in progress
```

**Always branch from develop. Always PR to develop. main → production only.**

Note: PR #2 (feat/rag-pipeline) was accidentally merged to main instead of develop.
Fixed by running: git checkout develop && git merge origin/main && git push origin develop.

---

## Key Architectural Decisions

**Why async SQLAlchemy (not sync psycopg2)?**
FastAPI is async. Blocking DB calls hold the event loop. `asyncpg` driver + `AsyncSession`. Shows production awareness — this is what any senior engineer would flag in code review.

**Why OpenAI for embeddings + Anthropic for generation?**
Anthropic has no embedding API. This split is standard production practice.

**Why raw SQL for vector search?**
LangChain's PGVector hides the query. Raw `<=>` operator SQL is explicit, testable, debuggable. Important for interviews — shows you understand what's happening, not just what LangChain does for you.

**Why two prompt versions?**
V1 intentionally naive, V2 production-grade. The gap between them is the demo's core argument: prompt engineering is measurable and matters. Claude-as-judge scores both on relevance, actionability, personalization, safety.

**Why _extract_text() in llm.py?**
Anthropic response.content is TextBlock | ToolUseBlock | ThinkingBlock | RedactedThinkingBlock. Blindly accessing content[0].text crashes if a non-text block comes back. mypy caught this as a real bug.

---

## Git Workflow

Branch naming: `feat/`, `fix/`, `chore/`, `test/`, `docs/`

Commit convention (Conventional Commits):
```
feat: add hybrid RAG retrieval with pgvector cosine search
fix: remove unused catch variable in demo page
test: add Nav smoke tests
chore: add ESLint config for non-interactive CI
```

Flow: feature branch → PR (base: develop) → CI green → merge → eventually develop → main → deploy

---

## CI Patterns Learned This Session

Common failures and fixes encountered:
- `pydantic-settings` + mypy: add `# type: ignore[call-arg]` to Settings()
- Async generator return type: use `AsyncGenerator[T, None]` not just `T`
- Submodule imports with mypy: add explicit re-exports in `__init__.py`
- `catch (e)` unused: change to `catch {` (no variable)
- No test files: pytest exits code 5, vitest exits code 1 — need at least one test
- ESLint interactive prompt: need `.eslintrc.json` committed before running `next lint`
- `pydantic[email]` required for `EmailStr` fields
- npm cache in CI: requires `package-lock.json` — use `npm install` if no lockfile

---

## Testing

Backend: `cd backend && make test` (pytest-asyncio, all paid APIs mocked)
Frontend: `cd frontend && npm test` (vitest + React Testing Library)

CI runs on every PR to develop or main.
ZERO real API calls in tests — mock everything that costs money.

---

## Project Rules

1. Never commit `.env` — `.env.example` only
2. Never sync SQLAlchemy — fully async throughout
3. Fiduciary disclaimer on every AI response — non-negotiable
4. Mock all paid APIs in tests
5. Always branch from develop, PR to develop
6. Update this file when architecture changes
