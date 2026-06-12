"""
Hybrid RAG pipeline — Phase 2.

Query pipeline per request:
  1. CLASSIFY (Haiku)   — determine CFP domain → targeted vector retrieval
  2. EMBED              — embed query (Redis cache for dedup)
  3. RETRIEVE           — pgvector cosine search, domain-filtered then full-corpus fallback
  4. PERSONALIZE        — build user context snapshot, inject into system prompt
  5. GENERATE (Sonnet)  — streaming response grounded in retrieved chunks

Two-part retrieval strategy:
  a. Vector search — pgvector cosine similarity over document_chunks
  b. Structured injection — user profile, goals, employer benefits from Postgres

The personalization context block is injected into the SYSTEM prompt for
every request — not just profile-specific questions.  This ensures all
responses reference the user's actual numbers even when they don't ask.
"""
import uuid
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models import User
from app.services.embeddings import embed_text_cached
from app.services import llm
from app.services.classifier import classify_domain, domain_to_prefix
from app.prompts.coach import SYSTEM_V1, SYSTEM_V2, USER_V1, USER_V2
from app.schemas import RetrievedChunk
from app.config import settings


# ── Vector search ─────────────────────────────────────────────────────────────

async def _vector_search(
    db: AsyncSession,
    query_embedding: list[float],
    top_k: int | None = None,
    domain_prefix: str | None = None,
) -> list[RetrievedChunk]:
    """
    pgvector cosine distance search.

    If domain_prefix is provided, searches within that document subset first.
    Falls back to full-corpus search if the filtered result set is smaller than
    top_k (prevents retrieval gaps for niche queries).
    """
    k = top_k or settings.retrieval_top_k
    emb_str = str(query_embedding)

    if domain_prefix:
        result = await db.execute(
            text("""
                SELECT document_name, content,
                       1 - (embedding <=> CAST(:emb AS vector)) AS similarity
                FROM document_chunks
                WHERE document_name LIKE :prefix
                ORDER BY embedding <=> CAST(:emb AS vector)
                LIMIT :k
            """),
            {"emb": emb_str, "k": k, "prefix": f"{domain_prefix}%"},
        )
        rows = result.fetchall()
        if len(rows) >= k:
            return [
                RetrievedChunk(
                    document_name=row.document_name,
                    content=row.content,
                    similarity=round(float(row.similarity), 4),
                )
                for row in rows
            ]
        # Filtered set too small — fall through to full-corpus search

    result = await db.execute(
        text("""
            SELECT document_name, content,
                   1 - (embedding <=> CAST(:emb AS vector)) AS similarity
            FROM document_chunks
            ORDER BY embedding <=> CAST(:emb AS vector)
            LIMIT :k
        """),
        {"emb": emb_str, "k": k},
    )
    rows = result.fetchall()
    return [
        RetrievedChunk(
            document_name=row.document_name,
            content=row.content,
            similarity=round(float(row.similarity), 4),
        )
        for row in rows
    ]


def _format_retrieved(chunks: list[RetrievedChunk]) -> str:
    return "\n\n".join(
        f"[{i}] Source: {c.document_name}\n{c.content}"
        for i, c in enumerate(chunks, 1)
    )


# ── Profile context formatters ────────────────────────────────────────────────

def _format_goals(user: User) -> str:
    if not user.goals:
        return "No goals set yet."
    lines = []
    for g in sorted(user.goals, key=lambda x: x.priority):
        target = float(g.target_amount or 0)
        current = float(g.current_amount or 0)
        pct = min(100, int(current / target * 100)) if target > 0 else 0
        lines.append(
            f"- {g.goal_type.replace('_', ' ').title()}: "
            f"${target:,.0f} target ({pct}% funded)"
            + (f" | Due: {g.target_date}" if g.target_date else "")
        )
    return "\n".join(lines)


def _format_benefits(user: User) -> str:
    b = user.benefits
    if not b:
        return "No employer benefits on file."
    parts = [f"Employer: {b.employer_name or 'On file'}"]
    if b.has_401k:
        parts.append(
            f"- 401(k): {float(b.match_percentage):.0f}% match "
            f"up to {float(b.match_limit_pct_of_salary):.0f}% of salary"
        )
    if b.has_hsa:
        parts.append(
            f"- HSA available: employer contributes "
            f"${float(b.hsa_employer_contribution):,.0f}/year"
        )
    if b.has_espp:
        parts.append(f"- ESPP: {float(b.espp_discount_pct):.0f}% discount on company stock")
    if not b.has_401k and not b.has_hsa and not b.has_espp:
        parts.append("- No tax-advantaged accounts detected")
    return "\n".join(parts)


def _build_personalization_context(user: User) -> str:
    """
    Build a structured user context block for injection into the system prompt.

    Injected on EVERY request — not just profile-specific questions.
    This ensures all responses reference the user's actual situation even when
    the question doesn't explicitly ask about their profile.
    """
    p = user.profile
    if not p:
        return (
            "EMPLOYEE PROFILE:\n"
            f"Name: {user.name} | Profile not yet configured — answer generally."
        )

    income = float(p.annual_income) if p.annual_income else 0
    monthly_income = income / 12
    monthly_savings = float(p.monthly_savings) if p.monthly_savings else 0
    savings_rate_pct = (monthly_savings / monthly_income * 100) if monthly_income > 0 else 0
    debt = float(p.total_debt) if p.total_debt else 0

    lines = [
        "EMPLOYEE PROFILE (always reference these specifics in your response):",
        f"Name: {user.name}",
        f"Age: {p.age or 'Unknown'} | Annual income: ${income:,.0f} | Risk tolerance: {p.risk_tolerance}",
        f"Monthly savings: ${monthly_savings:,.0f}/mo ({savings_rate_pct:.1f}% of income)",
        f"Emergency fund: {'Yes — ' + f'{float(p.emergency_fund_months):.1f} months' if p.has_emergency_fund else 'Not established'}",
        f"Retirement account: {'Yes' if p.has_retirement_account else 'No'} | Total debt: ${debt:,.0f}",
    ]
    if p.time_horizon_years:
        lines.append(f"Time horizon: {p.time_horizon_years} years")

    lines += [
        "",
        "FINANCIAL GOALS:",
        _format_goals(user),
        "",
        "EMPLOYER BENEFITS:",
        _format_benefits(user),
    ]
    return "\n".join(lines)


# ── Main pipeline ─────────────────────────────────────────────────────────────

async def get_rag_response(
    db: AsyncSession,
    user_id: uuid.UUID,
    query: str,
    prompt_version: str = "v2",
) -> dict:
    # 1. Load user with all relationships
    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(
            selectinload(User.profile),
            selectinload(User.goals),
            selectinload(User.benefits),
        )
    )
    user = result.scalar_one_or_none()
    if not user:
        raise ValueError(f"User {user_id} not found")

    # 2. Classify domain (Haiku) — fails open to "general"
    domain = await classify_domain(query)
    prefix = domain_to_prefix(domain)

    # 3. Embed query (Redis cache — same question won't hit OpenAI twice)
    query_embedding = await embed_text_cached(query)

    # 4. Domain-aware vector retrieval
    chunks = await _vector_search(db, query_embedding, domain_prefix=prefix)
    retrieved_context = _format_retrieved(chunks)

    # 5. Build personalization context (injected into system prompt for ALL versions)
    personalization_context = _build_personalization_context(user)

    p = user.profile

    # 6. Assemble prompt — personalization always in system, version determines structure
    if prompt_version == "v1":
        system = f"{SYSTEM_V1}\n\n{personalization_context}"
        user_message = USER_V1.format(
            retrieved_context=retrieved_context,
            query=query,
        )
    else:
        system = f"{SYSTEM_V2}\n\n{personalization_context}"
        user_message = USER_V2.format(
            user_name=user.name,
            age=p.age if p else "Unknown",
            annual_income=float(p.annual_income) if p and p.annual_income else 0,
            risk_tolerance=p.risk_tolerance if p else "unknown",
            emergency_fund_status=(
                f"{float(p.emergency_fund_months):.1f} months funded"
                if p and p.has_emergency_fund
                else "Not yet established"
            ),
            has_retirement_account="Yes" if p and p.has_retirement_account else "No",
            total_debt=float(p.total_debt) if p and p.total_debt else 0,
            monthly_savings=float(p.monthly_savings) if p and p.monthly_savings else 0,
            goals_context=_format_goals(user),
            benefits_context=_format_benefits(user),
            retrieved_context=retrieved_context,
            query=query,
        )

    # 7. Generate (Sonnet — hot path)
    response_text = await llm.generate(system, user_message, max_tokens=1200)

    return {
        "response": response_text,
        "sources": chunks,
        "prompt_version": prompt_version,
        "domain": domain,
    }
