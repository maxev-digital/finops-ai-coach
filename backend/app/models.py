import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Numeric, Boolean, DateTime, ForeignKey, Text, ARRAY
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from app.database import Base
from app.config import settings


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    profile: Mapped["Profile | None"] = relationship(back_populates="user", uselist=False)
    goals: Mapped[list["Goal"]] = relationship(back_populates="user")
    benefits: Mapped["EmployerBenefit | None"] = relationship(back_populates="user", uselist=False)
    conversations: Mapped[list["Conversation"]] = relationship(back_populates="user")


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    age: Mapped[int | None] = mapped_column(Integer)
    annual_income: Mapped[float | None] = mapped_column(Numeric(12, 2))
    risk_tolerance: Mapped[str] = mapped_column(String(20), default="moderate")
    primary_goal: Mapped[str | None] = mapped_column(String(100))
    time_horizon_years: Mapped[int | None] = mapped_column(Integer)
    has_emergency_fund: Mapped[bool] = mapped_column(Boolean, default=False)
    emergency_fund_months: Mapped[float] = mapped_column(Numeric(4, 1), default=0)
    has_retirement_account: Mapped[bool] = mapped_column(Boolean, default=False)
    total_debt: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    monthly_savings: Mapped[float] = mapped_column(Numeric(10, 2), default=0)

    user: Mapped["User"] = relationship(back_populates="profile")


class Goal(Base):
    __tablename__ = "goals"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    goal_type: Mapped[str] = mapped_column(String(50))
    description: Mapped[str | None] = mapped_column(String(255))
    target_amount: Mapped[float | None] = mapped_column(Numeric(12, 2))
    current_amount: Mapped[float] = mapped_column(Numeric(12, 2), default=0)
    target_date: Mapped[str | None] = mapped_column(String(20))
    priority: Mapped[int] = mapped_column(Integer, default=1)

    user: Mapped["User"] = relationship(back_populates="goals")


class EmployerBenefit(Base):
    __tablename__ = "employer_benefits"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    employer_name: Mapped[str | None] = mapped_column(String(100))
    has_401k: Mapped[bool] = mapped_column(Boolean, default=False)
    match_percentage: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    match_limit_pct_of_salary: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    has_hsa: Mapped[bool] = mapped_column(Boolean, default=False)
    hsa_employer_contribution: Mapped[float] = mapped_column(Numeric(10, 2), default=0)
    has_espp: Mapped[bool] = mapped_column(Boolean, default=False)
    espp_discount_pct: Mapped[float] = mapped_column(Numeric(5, 2), default=0)
    pto_days: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped["User"] = relationship(back_populates="benefits")


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"))
    title: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship(back_populates="conversations")
    messages: Mapped[list["Message"]] = relationship(
        back_populates="conversation",
        order_by="Message.created_at",
    )


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("conversations.id"))
    role: Mapped[str] = mapped_column(String(10))
    content: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    retrieved_sources: Mapped[list[str]] = mapped_column(ARRAY(Text), default=list)
    prompt_version: Mapped[str] = mapped_column(String(10), default="v2")

    conversation: Mapped["Conversation"] = relationship(back_populates="messages")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_name: Mapped[str] = mapped_column(String(255))
    chunk_index: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text)
    # pgvector column — dimensions must match embedding model output
    embedding: Mapped[list[float]] = mapped_column(Vector(settings.embedding_dimensions))
    metadata_: Mapped[dict] = mapped_column("metadata", JSONB, default=dict)
