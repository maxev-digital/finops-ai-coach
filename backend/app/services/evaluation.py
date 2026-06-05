"""
Prompt evaluation service — LLM-as-judge pattern.

Runs the same query through V1 (naive) and V2 (production) prompts,
then uses Claude to score both on four dimensions relevant to a
fiduciary financial wellness product.
"""
import uuid
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.rag import get_rag_response
from app.services import llm
from app.prompts.coach import SYSTEM_JUDGE, USER_JUDGE
from app.schemas import EvalResponse, PromptScore


async def run_evaluation(
    db: AsyncSession,
    user_id: uuid.UUID,
    query: str,
) -> EvalResponse:
    # Run both prompt versions against the same query
    v1_result, v2_result = (
        await get_rag_response(db, user_id, query, prompt_version="v1"),
        await get_rag_response(db, user_id, query, prompt_version="v2"),
    )

    # Ask Claude to judge both responses
    judge_message = USER_JUDGE.format(
        query=query,
        v1_response=v1_result["response"],
        v2_response=v2_result["response"],
    )
    scores = await llm.generate_json(SYSTEM_JUDGE, judge_message, max_tokens=600)

    def _score(d: dict) -> PromptScore:
        return PromptScore(
            relevance=float(d.get("relevance", 0)),
            actionability=float(d.get("actionability", 0)),
            personalization=float(d.get("personalization", 0)),
            safety=float(d.get("safety", 0)),
            overall=float(d.get("overall", 0)),
            reasoning=str(d.get("reasoning", "")),
        )

    return EvalResponse(
        query=query,
        v1_response=v1_result["response"],
        v2_response=v2_result["response"],
        v1_scores=_score(scores["v1"]),
        v2_scores=_score(scores["v2"]),
        winner=scores.get("winner", "v2"),
        improvement_summary=scores.get("improvement_summary", ""),
    )
