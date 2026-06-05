from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas import EvalRequest, EvalResponse
from app.services.evaluation import run_evaluation

router = APIRouter(prefix="/evaluate", tags=["evaluation"])


@router.post("", response_model=EvalResponse)
async def evaluate_prompts(
    req: EvalRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Run the same query through V1 (naive) and V2 (production) prompts,
    then score both with Claude-as-judge. Used by the /prompt-lab page
    to demonstrate prompt engineering impact.
    """
    return await run_evaluation(db, req.user_id, req.query)
