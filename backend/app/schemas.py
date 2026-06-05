from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

FIDUCIARY_DISCLAIMER = (
    "This is general financial wellness education only — not personalized financial, "
    "tax, or investment advice. Consult a licensed financial advisor for decisions "
    "specific to your situation."
)


# ── Profile ───────────────────────────────────────────────────────────────────

class ProfileUpsert(BaseModel):
    age: int | None = None
    annual_income: float | None = None
    risk_tolerance: str = "moderate"
    primary_goal: str | None = None
    time_horizon_years: int | None = None
    has_emergency_fund: bool = False
    emergency_fund_months: float = 0
    has_retirement_account: bool = False
    total_debt: float = 0
    monthly_savings: float = 0


class ProfileOut(ProfileUpsert):
    id: UUID
    user_id: UUID
    model_config = {"from_attributes": True}


class GoalCreate(BaseModel):
    goal_type: str
    description: str | None = None
    target_amount: float | None = None
    current_amount: float = 0
    target_date: str | None = None
    priority: int = 1


class GoalOut(GoalCreate):
    id: UUID
    user_id: UUID
    model_config = {"from_attributes": True}


class BenefitUpsert(BaseModel):
    employer_name: str | None = None
    has_401k: bool = False
    match_percentage: float = 0
    match_limit_pct_of_salary: float = 0
    has_hsa: bool = False
    hsa_employer_contribution: float = 0
    has_espp: bool = False
    espp_discount_pct: float = 0
    pto_days: int = 0


class BenefitOut(BenefitUpsert):
    id: UUID
    user_id: UUID
    model_config = {"from_attributes": True}


class UserCreate(BaseModel):
    name: str
    email: EmailStr


class UserOut(BaseModel):
    id: UUID
    name: str
    email: str
    created_at: datetime
    profile: ProfileOut | None = None
    goals: list[GoalOut] = []
    benefits: BenefitOut | None = None
    model_config = {"from_attributes": True}


# ── Chat ─────────────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    user_id: UUID
    message: str
    conversation_id: UUID | None = None
    prompt_version: str = "v2"


class RetrievedChunk(BaseModel):
    document_name: str
    content: str
    similarity: float


class ChatResponse(BaseModel):
    response: str
    conversation_id: UUID
    sources: list[RetrievedChunk]
    disclaimer: str = FIDUCIARY_DISCLAIMER


# ── Evaluation ───────────────────────────────────────────────────────────────

class EvalRequest(BaseModel):
    user_id: UUID
    query: str


class PromptScore(BaseModel):
    relevance: float
    actionability: float
    personalization: float
    safety: float
    overall: float
    reasoning: str


class EvalResponse(BaseModel):
    query: str
    v1_response: str
    v2_response: str
    v1_scores: PromptScore
    v2_scores: PromptScore
    winner: str
    improvement_summary: str
