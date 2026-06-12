import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import User
from app.schemas import WellnessScore
from app.services.wellness import compute_wellness_score

router = APIRouter(prefix="/wellness", tags=["wellness"])


@router.get("/{user_id}", response_model=WellnessScore)
async def get_wellness_score(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
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
        raise HTTPException(status_code=404, detail="User not found")

    score = compute_wellness_score(user)
    return WellnessScore(user_id=user_id, **score)
