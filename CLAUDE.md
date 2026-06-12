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

## Current Build State (as of June 11 2026)

### Phase 1 — COMPLETE and deployed to VPS:
- Full async FastAPI backend: config, database, models, schemas, main
- All routers: /chat, /profile (users/goals/benefits), /evaluate
- All services: rag.py (hybrid retrieval), llm.py, embeddings.py (Redis cache), evaluation.py
- Prompt templates: V1 naive baseline + V2 production (prompts/coach.py)
- Document ingestion pipeline (ingest/pipeline.py)
- 5 knowledge base documents (retirement, benefits, budgeting, debt, investing) — THIN, Phase 2 expands to 79
- pytest smoke tests + conftest with mocked API clients
- Backend CI (GitHub Actions) — green
- Full Next.js 15 frontend: landing, /demo, /prompt-lab, /insights, /architecture pages
- Max EV Digital branding + vertical portability showcase
- HR Insights dashboard
- ecosystem.config.js + deploy.sh
- VPS: cloned at /var/www/finops-ai-coach, PM2 running, SSL live
- Site live at https://fincoach.maxevdigital.com

### Phase 2 — TO BUILD (this session):
- [ ] Expand knowledge base from 5 → 79 documents across 15 CFP domains
- [ ] Run `make ingest` on VPS after docs are written
- [ ] Expand user intake to full 6-category profile system
- [ ] Update system prompt to inject personalized user context into every query
- [ ] Implement 3-tier model routing (Haiku → Sonnet → Opus)
- [ ] Build financial wellness score (6-dimension, 0-100)
- [ ] Update landing page: "RAG template system for any vertical" framing
- [ ] Add locked vertical cards: Healthcare, Legal, Real Estate, HR Benefits
- [ ] Make GitHub repo public
- [ ] Add FinCoach card to maxevdigital.com portfolio

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

generation/        3-tier model routing (Phase 2 — see section below)
                   → direct Anthropic SDK (not LangChain wrapper)
                   → LangChain used ONLY for text splitting in ingest pipeline

vector search/     Raw pgvector SQL — cosine distance operator <=>
                   → NOT LangChain PGVector abstraction (too opaque for interviews)
                   → hybrid: pgvector similarity + structured Postgres user context
```

---

## Phase 2: Multi-Model Routing

Three model constants in backend/services/llm.py:

```python
MODEL_CLASSIFIER = "claude-haiku-4-5-20251001"   # domain routing
MODEL_GENERATOR  = "claude-sonnet-4-6"            # hot path, streaming
MODEL_EVALUATOR  = "claude-opus-4-8"              # async quality judge
```

**4-step personalization pipeline per query:**

1. **CLASSIFY (Haiku)** — determine CFP domain(s) the query touches (tax, retirement, estate, etc.) → drives targeted vector retrieval. Sub-100ms, pure classification.

2. **GENERATE (Sonnet)** — user profile snapshot + retrieved chunks + query → streaming response. Sonnet on hot path = fast perceived performance. For grounded RAG the quality delta vs Opus is minimal — retrieval does the heavy lifting.

3. **EVALUATE (Opus, async)** — runs AFTER response is streamed to user. Cross-model eval: Opus catching Sonnet's errors is the only direction that works asymmetrically. Same-model eval shares blindspots. Scores 4 dimensions:
   - Personalization: did response use the user's actual numbers?
   - Grounding: every claim traceable to a retrieved source doc?
   - Actionability: concrete next step given?
   - Safety: no unlicensed investment advice?

4. **PROMPT LAB** — Sonnet × 2 parallel (V1 and V2) → Opus judge → comparative analysis declaring winner with specific reasoning citing user's actual data.

**Future:** Add a third vendor (e.g. Google Gemini or OpenAI GPT-4o) for evaluation diversity. Anthropic evaluating Anthropic has residual vendor bias. Third-party judge eliminates it.

**Why not Opus on the hot path?**
Demo UX: streaming latency is visible. Sonnet streams 2-3x faster. Opus runs where latency doesn't matter — the async eval the user never waits on.

---

## Phase 2: Knowledge Base Expansion

**Target: 79 documents → ~320-400 chunks** (up from 5 docs / 16 chunks)

All documents are markdown files in `backend/ingest/documents/`. Run `make ingest` on VPS after adding new files.

| Domain | Docs | Key Topics |
|--------|------|-----------|
| Tax Planning | 8 | Brackets, cap gains, Roth conversions, QBI, IRMAA, SALT, charitable |
| Retirement Savings | 7 | 401k/403b, IRAs, Roth, SEP/SIMPLE/Solo, RMDs (SECURE 2.0), NUA, 72(t) |
| Retirement Income | 6 | SS optimization, pension lump-sum, 4% rule, sequence of returns, withdrawal order |
| Investment Planning | 7 | Asset allocation, passive vs active, factor investing, TLH, asset location, rebalancing |
| Estate Planning | 8 | Will vs trust, ILIT, GRAT, QTIP, beneficiary designations, gift exclusion, exemption sunset |
| Insurance & Risk | 5 | Term vs perm, disability (own-occ), LTC hybrid, umbrella, buy-sell |
| Healthcare Planning | 5 | Medicare A/B/C/D, Medigap, IRMAA, HSA triple tax, ACA subsidy cliff |
| Education Funding | 4 | 529 superfunding, Coverdell, UGMA/UTMA, FAFSA optimization, SECURE 2.0 529→Roth |
| Debt Strategy | 4 | Mortgage refi, student loan IDR/PSLF, avalanche/snowball, HELOC vs cash-out |
| Business Owner | 5 | S-Corp vs LLC, Solo 401k vs SEP-IRA, QBI, succession, key person insurance |
| Equity Compensation | 4 | RSU taxation, ISO vs NSO AMT, ESPP, 83(b), concentrated stock, Rule 144 |
| Behavioral Finance | 3 | Loss aversion, recency bias, DCA as behavior management |
| Life Stage Planning | 6 | New grad, marriage, new parent, pre-retirement Roth window, retirement transition, widowed/divorced |
| Government Benefits | 3 | SS COLA history, FRA by birth year table, Medicare enrollment windows |
| IRS Reference Data | 4 | 2024/2025 contribution limits, tax brackets all filing statuses, standard deductions, cap gains thresholds |

---

## Phase 2: User Intake & Personalization

Full 6-category intake captured in profile form, stored in profiles table, injected into every query.

**Intake categories:**
1. **Identity** — age, state, filing status, spouse age, dependents, employment status
2. **Income** — W-2, self-employment, rental, investment, Social Security, pension, spouse — and stability (stable/variable/seasonal)
3. **Assets by tax bucket** — tax-deferred (401k, IRA), Roth (Roth IRA, Roth 401k), taxable (brokerage, savings), real estate (primary, investment), other (business equity, HSA, 529)
4. **Liabilities** — mortgage (balance/rate/years remaining), student loans (balance/rate/type/plan), credit cards (total/avg rate), other debt
5. **Goals** (ranked) — retirement target age + monthly income, education funding, home purchase, other (business, legacy, FIRE)
6. **Risk + Tax** — risk tolerance 1-5, prior loss experience, estimated bracket, state income tax, equity comp (yes/no), expected inheritance

**Personalization prompt injection:**
Every chat request builds a structured user context block before retrieval:
```
User context: 52yo, married filing jointly, Texas (no state income tax),
W-2 $145K + spouse $72K = $217K household.
Assets: $680K traditional 401k, $45K Roth IRA, $120K taxable brokerage,
$380K primary home ($210K mortgage remaining at 3.1%).
Goals: retire at 62, target $8K/mo income.
Risk: moderate. Tax bracket: 24% federal.
```
This block is prepended to the system prompt on every request — not just when the user asks something profile-specific.

---

## Phase 2: Multi-Vertical Template System

Financial Advisor is the primary live vertical. Others shown as locked templates on landing page to demonstrate the "RAG template system for any vertical" pitch.

| Vertical | Status | Primary Use Case |
|----------|--------|-----------------|
| Financial Advisor | LIVE | BrightPlan demo — full personalization |
| Healthcare Benefits Coach | LOCKED | HR benefits navigation, FSA/HSA, plan comparison |
| Real Estate Advisor | LOCKED | Buy vs rent, mortgage math, 1031 exchange |
| Legal Self-Help | LOCKED | Contract basics, employment law, tenant rights |
| HR Benefits Coach | LOCKED | Total comp optimization, equity, 401k matching |

Locked verticals show teaser copy + "Coming Soon" state. No code needed — visual demo of the platform concept.

---

## Phase 2: Financial Wellness Score

6-dimension score (0-100), modeled after BrightPlan's patented 500-point score.

| Dimension | What It Measures |
|-----------|-----------------|
| Cash Flow | Emergency fund months + monthly surplus/deficit |
| Debt Ratio | Total debt service / gross income (28% mortgage / 36% total rule) |
| Retirement Track | On pace for target retirement income at target age |
| Protection | Life/disability/LTC coverage adequacy |
| Tax Efficiency | Roth vs traditional allocation, TLH usage, tax-advantaged account maximization |
| Estate Readiness | Will exists, beneficiaries current, key account POD designations |

Score displayed on /demo sidebar. Recalculates when profile is updated.

---

## VPS Infrastructure (all live)

```
Server:           root@72.60.43.168
SSH key:          ~/.ssh/id_ed25519
Project root:     /var/www/finops-ai-coach  (CLONED AND RUNNING)
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

## Phase 3: Product Launch Roadmap

**Objective:** Turn the BrightPlan demo into a shippable B2B/B2C financial wellness product.

**B2B vs B2C:** Start B2B. Employer buys seats (HR admin onboards, employees use). Higher LTV ($15–25/seat/mo × headcount), HR Insights page already built as buyer demo, and it mirrors BrightPlan's own go-to-market. Individual B2C ($19–29/mo) is Plan B if B2B sales cycle is too long.

---

### Sprint 1: Auth + Onboarding (Weeks 1–2)

- [ ] User authentication — NextAuth.js or Clerk. Email/password + Google OAuth.
- [ ] Employer admin vs employee role distinction in DB schema
- [ ] Protected routes: /demo, /prompt-lab, /insights require login
- [ ] 6-category profile intake wizard (wire the Phase 2 intake form to a real onboarding flow)
- [ ] Financial wellness score displayed on /demo sidebar after onboarding

### Sprint 2: Billing (Weeks 2–3)

- [ ] Stripe Checkout + webhooks
- [ ] Pricing: Individual $24/mo · Team (up to 25 seats) $199/mo · Enterprise (custom)
- [ ] Stripe Customer Portal for plan management / cancellation
- [ ] 14-day free trial gating (no credit card on trial)

### Sprint 3: Frontend Polish (Weeks 3–4)

- [ ] Landing page: real pricing section, "Request Demo" CTA above the fold
- [ ] Testimonials / social proof placeholder
- [ ] Mobile responsiveness audit — all 5 pages
- [ ] Demo page: loading states, error handling, empty states for new users
- [ ] HR Insights: real org-level wellness trend chart (replace static sparkline)
- [ ] Prompt Lab: URL-shareable result states (query params on ?q=&uid=)

### Sprint 4: Model Routing Implementation (Weeks 4–5)

- [ ] backend/services/llm.py: implement Haiku classifier → domain enum
- [ ] Modify rag.py to accept domain hint from classifier → targeted retrieval
- [ ] Async Opus evaluation: store eval scores in new `eval_results` table
- [ ] Wire eval scores to Prompt Lab display (already has ScoreCard UI)

### Sprint 5: Launch (Week 6)

- [ ] Make GitHub repo public (clean sensitive data first)
- [ ] Add FinCoach to maxevdigital.com portfolio
- [ ] Submit to ProductHunt
- [ ] LinkedIn post with demo video
- [ ] Email 3–5 target HR/benefits buyer contacts for early access

---

### Rocket Money Features — Decision

**Not in scope for Phase 3.** Rocket Money's core is bank account aggregation (Plaid), transaction categorization, and subscription cancellation. Our differentiation is AI advisory depth, not spend tracking.

**What we have:** Manually-entered profile (income, assets, goals). No bank connection.

**If Plaid is added (Phase 4+):**
- Plaid Link UI: ~$0.10–0.30/linked item/month
- Auto-populate income/assets/liabilities from real accounts
- Transaction categorization for cash flow scoring
- This becomes the "Pro" tier add-on ($5–10/month extra)
- Development effort: ~2–3 weeks for backend + UI
- Keep manual profile as fallback — Plaid is optional enhancement, not requirement

---

## V2 Reference — Active Portfolio Trader

Full spec at `docs/PORTFOLIO_TRADER_V2.md`. Summary:

- **Tier positioning:** Pro upgrade on top of V1 base subscription (+$15-20/month)
- **Core loop:** User adds holdings → RSS + market data ingested continuously → Haiku extracts tickers + scores materiality → Sonnet generates holding-specific alert suggestion → Opus validates async before delivery
- **New pages:** `/market` (holdings-filtered news dashboard + market snapshot) + `/alerts` (alert inbox)
- **New tables:** `user_holdings`, `news_items`, `alerts`
- **All V1 infrastructure unchanged** — news articles ingest into the same `document_chunks` table with `type: "news"` metadata, same 3-tier routing, same pgvector
- **Notification delivery:** In-app → email (Resend) → web push → SMS (Twilio, high-materiality only)
- **Guardrail:** "Research context, not advice" framing — ends every alert with disclaimer. Stays outside RIA registration requirements.
- **Start Phase 4 after Phase 3 (V1 launch) is complete.**

---

## Git Branch State

```
main      ← fully deployed, Phase 1 complete (frontend + backend + VPS)
develop   ← use as base for all Phase 2 branches
```

**Always branch from develop. Always PR to develop. main → production only.**

Phase 2 branches will follow pattern: `feat/kb-expansion`, `feat/model-routing`, `feat/user-intake`, etc.

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
