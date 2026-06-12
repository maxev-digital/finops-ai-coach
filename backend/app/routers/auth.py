import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.models import User

router = APIRouter(tags=["auth"])
_pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RegisterBody(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class AuthUser(BaseModel):
    id: str
    name: str
    email: str


@router.post("/register", response_model=AuthUser)
async def register(body: RegisterBody, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        id=uuid.uuid4(),
        name=body.name,
        email=body.email,
        password_hash=_pwd.hash(body.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return AuthUser(id=str(user.id), name=user.name, email=user.email)


@router.post("/login", response_model=AuthUser)
async def login(body: LoginBody, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == body.email))
    user = result.scalar_one_or_none()
    if not user or not user.password_hash or not _pwd.verify(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return AuthUser(id=str(user.id), name=user.name, email=user.email)
