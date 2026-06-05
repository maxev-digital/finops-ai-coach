import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import User, Profile, Goal, EmployerBenefit
from app.schemas import (
    UserCreate, UserOut,
    ProfileUpsert, ProfileOut,
    GoalCreate, GoalOut,
    BenefitUpsert, BenefitOut,
)

router = APIRouter(prefix="/profile", tags=["profile"])


@router.post("/users", response_model=UserOut, status_code=201)
async def create_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(name=payload.name, email=payload.email)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


@router.get("/users", response_model=list[UserOut])
async def list_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(User).options(
            selectinload(User.profile),
            selectinload(User.goals),
            selectinload(User.benefits),
        )
    )
    return result.scalars().all()


@router.get("/users/{user_id}", response_model=UserOut)
async def get_user(user_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
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
    return user


@router.put("/users/{user_id}/profile", response_model=ProfileOut)
async def upsert_profile(
    user_id: uuid.UUID,
    payload: ProfileUpsert,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Profile).where(Profile.user_id == user_id))
    profile = result.scalar_one_or_none()
    if profile:
        for k, v in payload.model_dump().items():
            setattr(profile, k, v)
    else:
        profile = Profile(user_id=user_id, **payload.model_dump())
        db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile


@router.post("/users/{user_id}/goals", response_model=GoalOut, status_code=201)
async def add_goal(
    user_id: uuid.UUID,
    payload: GoalCreate,
    db: AsyncSession = Depends(get_db),
):
    goal = Goal(user_id=user_id, **payload.model_dump())
    db.add(goal)
    await db.commit()
    await db.refresh(goal)
    return goal


@router.delete("/users/{user_id}/goals/{goal_id}", status_code=204)
async def delete_goal(
    user_id: uuid.UUID,
    goal_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == user_id)
    )
    goal = result.scalar_one_or_none()
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    await db.delete(goal)
    await db.commit()


@router.put("/users/{user_id}/benefits", response_model=BenefitOut)
async def upsert_benefits(
    user_id: uuid.UUID,
    payload: BenefitUpsert,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(EmployerBenefit).where(EmployerBenefit.user_id == user_id)
    )
    benefit = result.scalar_one_or_none()
    if benefit:
        for k, v in payload.model_dump().items():
            setattr(benefit, k, v)
    else:
        benefit = EmployerBenefit(user_id=user_id, **payload.model_dump())
        db.add(benefit)
    await db.commit()
    await db.refresh(benefit)
    return benefit
