"""
Financial Wellness Score — 6-dimension 0-100 composite.

Modeled after BrightPlan's patented 500-point wellness score, simplified to
work with the data available in the current profile schema.

Each dimension scores 0-100.  The overall score is a weighted average.
Weights reflect the relative importance of each dimension for financial
stability (cash flow and retirement track carry the most weight).

No async, no DB calls — pure computation from loaded User model.
Call this after the user + relationships are already loaded.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models import User


@dataclass
class DimensionScore:
    name: str
    score: int           # 0-100
    label: str           # "Needs attention" | "Fair" | "Good" | "Excellent"
    detail: str          # one-line explanation of what drove the score
    weight: float        # contribution to overall (weights sum to 1.0)


def _label(score: int) -> str:
    if score >= 80:
        return "Excellent"
    if score >= 60:
        return "Good"
    if score >= 35:
        return "Fair"
    return "Needs attention"


def _cash_flow(user: "User") -> DimensionScore:
    """Emergency fund depth as a proxy for cash flow resilience."""
    p = user.profile
    months = float(p.emergency_fund_months) if p and p.has_emergency_fund else 0.0

    if months >= 6:
        score, detail = 100, f"{months:.1f}-month emergency fund (target: 6 months)"
    elif months >= 3:
        score, detail = 65, f"{months:.1f}-month fund — targeting 6 months"
    elif months >= 1:
        score, detail = 35, f"{months:.1f}-month fund — below the 3-month minimum"
    else:
        score, detail = 10, "No emergency fund on file — top financial priority"

    return DimensionScore("Cash Flow", score, _label(score), detail, weight=0.25)


def _debt_ratio(user: "User") -> DimensionScore:
    """Total debt relative to annual income (proxy for debt service burden)."""
    p = user.profile
    if not p:
        return DimensionScore("Debt Ratio", 50, "Fair", "No profile data", weight=0.20)

    income = float(p.annual_income) if p.annual_income else 0
    debt = float(p.total_debt) if p.total_debt else 0

    if income <= 0:
        ratio = 0.0
    else:
        ratio = debt / income  # e.g. 0.5 = debt equals 50% of annual income

    if debt == 0:
        score, detail = 100, "No debt recorded"
    elif ratio < 0.25:
        score, detail = 85, f"Debt is {ratio*100:.0f}% of annual income — low"
    elif ratio < 0.50:
        score, detail = 60, f"Debt is {ratio*100:.0f}% of annual income — manageable"
    elif ratio < 1.0:
        score, detail = 35, f"Debt is {ratio*100:.0f}% of annual income — elevated"
    else:
        score, detail = 10, f"Debt exceeds annual income ({ratio*100:.0f}%) — urgent focus"

    return DimensionScore("Debt Ratio", score, _label(score), detail, weight=0.20)


def _retirement_track(user: "User") -> DimensionScore:
    """Retirement account presence + savings rate as retirement readiness proxy."""
    p = user.profile
    if not p:
        return DimensionScore("Retirement Track", 10, _label(10), "No profile data", weight=0.25)

    has_account = p.has_retirement_account
    income = float(p.annual_income) if p.annual_income else 0
    monthly_savings = float(p.monthly_savings) if p.monthly_savings else 0
    monthly_income = income / 12 if income > 0 else 0
    savings_rate = (monthly_savings / monthly_income) if monthly_income > 0 else 0

    if not has_account:
        score, detail = 10, "No retirement account — opening one is the single highest-ROI move"
    elif savings_rate >= 0.15:
        score, detail = 100, f"Saving {savings_rate*100:.1f}%/mo with retirement account — on track"
    elif savings_rate >= 0.10:
        score, detail = 80, f"Saving {savings_rate*100:.1f}%/mo — solid, target 15% including employer match"
    elif savings_rate >= 0.05:
        score, detail = 55, f"Saving {savings_rate*100:.1f}%/mo — increase to at least capture full employer match"
    elif savings_rate > 0:
        score, detail = 35, f"Saving {savings_rate*100:.1f}%/mo — below the minimum recommended 5%"
    else:
        score, detail = 20, "Retirement account on file but no monthly savings recorded"

    return DimensionScore("Retirement Track", score, _label(score), detail, weight=0.25)


def _benefits_utilization(user: "User") -> DimensionScore:
    """Employer benefit enrollment as a proxy for tax efficiency + protection."""
    b = user.benefits
    if not b:
        return DimensionScore(
            "Benefits Utilization", 20, _label(20),
            "No employer benefits on file — may be self-employed or not yet entered",
            weight=0.10,
        )

    active = sum([b.has_401k, b.has_hsa, b.has_espp])
    score_map = {0: 20, 1: 50, 2: 75, 3: 100}
    score = score_map[active]

    enrolled = [x for x, flag in [("401k", b.has_401k), ("HSA", b.has_hsa), ("ESPP", b.has_espp)] if flag]
    if enrolled:
        detail = f"Enrolled in: {', '.join(enrolled)}"
    else:
        detail = "No tax-advantaged accounts enrolled — leaving employer benefits on the table"

    return DimensionScore("Benefits Utilization", score, _label(score), detail, weight=0.10)


def _goal_progress(user: "User") -> DimensionScore:
    """Average funding progress across all active goals."""
    goals = user.goals
    if not goals:
        return DimensionScore(
            "Goal Progress", 50, "Fair",
            "No goals set — add goals to track progress",
            weight=0.10,
        )

    funded_pcts = []
    for g in goals:
        target = float(g.target_amount) if g.target_amount else 0
        current = float(g.current_amount) if g.current_amount else 0
        if target > 0:
            funded_pcts.append(min(1.0, current / target))

    if not funded_pcts:
        return DimensionScore("Goal Progress", 40, "Fair", "Goals set but no target amounts", weight=0.10)

    avg_pct = sum(funded_pcts) / len(funded_pcts)

    if avg_pct >= 0.75:
        score, detail = 95, f"{avg_pct*100:.0f}% average goal funding — nearly there"
    elif avg_pct >= 0.50:
        score, detail = 75, f"{avg_pct*100:.0f}% average goal funding — solid progress"
    elif avg_pct >= 0.25:
        score, detail = 55, f"{avg_pct*100:.0f}% average goal funding — building momentum"
    else:
        score, detail = 30, f"{avg_pct*100:.0f}% average goal funding — early stage"

    return DimensionScore("Goal Progress", score, _label(score), detail, weight=0.10)


def _tax_protection(user: "User") -> DimensionScore:
    """Estimated tax efficiency + protection from available data.

    Full scoring requires Phase 2 intake data (Roth vs. traditional split,
    life/disability insurance, estate documents).  Proxy scoring until then.
    """
    p = user.profile
    b = user.benefits
    score = 30  # base

    if b and b.has_hsa:
        score += 20   # HSA = triple tax advantage
    if b and b.has_401k:
        score += 20   # tax-deferred savings
    if p and p.risk_tolerance not in ("unknown", "", None):
        score += 15   # documented risk tolerance = deliberate allocation
    if p and p.time_horizon_years:
        score += 15   # time horizon set = investment strategy exists

    score = min(100, score)
    detail = "Estimated from available data — full score requires Phase 2 profile intake"
    return DimensionScore("Tax & Protection", score, _label(score), detail, weight=0.10)


# ── Public API ────────────────────────────────────────────────────────────────

def compute_wellness_score(user: "User") -> dict:
    """Return overall and per-dimension wellness scores for a loaded User."""
    dimensions = [
        _cash_flow(user),
        _debt_ratio(user),
        _retirement_track(user),
        _benefits_utilization(user),
        _goal_progress(user),
        _tax_protection(user),
    ]

    overall = round(sum(d.score * d.weight for d in dimensions))

    return {
        "overall": overall,
        "overall_label": _label(overall),
        "dimensions": [
            {
                "name": d.name,
                "score": d.score,
                "label": d.label,
                "detail": d.detail,
                "weight": d.weight,
            }
            for d in dimensions
        ],
    }
