"""
Hybrid RAG pipeline.

Two-part retrieval strategy:
1. Vector search — pgvector cosine similarity over document_chunks
2. Structured injection — user profile, goals, employer benefits from Postgres

The hybrid approach ensures user-specific context is always present
even when it wouldn't surface through semantic search alone.
"""
import uuid
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models import User, DocumentChunk
from app.services.embeddings import embed_text_cached
from app.services import llm
from app.prompts.coach import SYSTEM_V1, SYSTEM_V2, USER_V1, USER_V2
from app.schemas import RetrievedChunk
from app.config import settings


# ── Vector search ─────────────────────────────────────────────────────────────

async def _vector_search(
    db: AsyncSession,
    query_embedding: list[float],
    top_k: int | None = None,
) -> list[RetrievedChunk]:
    """
    Raw pgvector cosine distance query.
    <=> is the cosine distance operator — lower value = more similar.
    We convert to similarity score: 1 - distance.
    """
    k = top_k or settings.retrieval_top_k
    result = await db.execute(
        text("""
            SELECT document_name, content,
                   1 - (embedding <=> CAST(:emb AS vector)) AS similarity
            FROM document_chunks
            ORDER BY embedding <=> CAST(:emb AS vector)
            LIMIT :k
        """),
        {"emb": str(query_embedding), "k": k},
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


# ── Main pipeline ─────────────────────────────────────────────────────────────

async def get_rag_response(
    db: AsyncSession,
    user_id: uuid.UUID,
    query: str,
    prompt_version: str = "v2",
) -> dict:
    # Load user with all relationships
    result = await db.execute(
        select(User)
        .where(User.id == user_id)
        .options(
            *[
                __import__("sqlalchemy.orm", fromlist=["selectinload"]).selectinload(rel)
                for rel in [User.profile, User.goals, User.benefits]
            ]
        )
    )
    user = result.scalar_one_or_none()
    if not user:
        raise ValueError(f"User {user_id} not found")

    # Embed query (cached — same question won't hit OpenAI twice)
    query_embedding = await embed_text_cached(query)

    # Vector search
    chunks = await _vector_search(db, query_embedding)
    retrieved_context = _format_retrieved(chunks)

    p = user.profile

    # Build prompt for requested version
    if prompt_version == "v1":
        system = SYSTEM_V1
        user_message = USER_V1.format(
            retrieved_context=retrieved_context,
            query=query,
        )
    else:
        system = SYSTEM_V2
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

    response_text = await llm.generate(system, user_message, max_tokens=1200)

    return {
        "response": response_text,
        "sources": chunks,
        "prompt_version": prompt_version,
    }
