.PHONY: dev test lint typecheck db-init ingest seed fmt

# ── Development ──────────────────────────────────────────────────────────────

dev:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# ── Database ─────────────────────────────────────────────────────────────────

db-init:
	python -c "import asyncio; from app.database import init_db; asyncio.run(init_db())"

ingest:
	python -m ingest.pipeline

seed:
	python ../scripts/seed_demo_data.py

# ── Testing ───────────────────────────────────────────────────────────────────

test:
	pytest tests/ -v --tb=short

test-cov:
	pytest tests/ -v --tb=short --cov=app --cov-report=term-missing

# ── Code Quality ──────────────────────────────────────────────────────────────

lint:
	ruff check app/ tests/ ingest/

lint-fix:
	ruff check --fix app/ tests/ ingest/

fmt:
	ruff format app/ tests/ ingest/

typecheck:
	mypy app/ --ignore-missing-imports
