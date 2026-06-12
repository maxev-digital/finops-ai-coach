"""
Domain classifier — Haiku tier of the 3-tier model routing pipeline.

Determines which CFP domain(s) a user query touches so that vector retrieval
can be targeted to the most relevant document subset.  Sub-100ms, pure
classification — no generation.

Design decisions:
- Haiku chosen for cost and latency: domain routing is a classification task,
  not a generation task.  Spending Opus/Sonnet tokens here would be wasteful.
- Fails open: any exception returns "general" so the main pipeline is never
  blocked by a classifier failure.
- JSON prefill ("{") coerces deterministic JSON output without tool use.
"""
import json
import anthropic
from app.config import settings

_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

# Maps classifier output labels → document_name prefix used in pgvector table.
# None means no prefix filter — search the full corpus.
DOMAIN_PREFIX_MAP: dict[str, str | None] = {
    "tax":                  "tax_",
    "retirement_savings":   "retirement_",
    "retirement_income":    "income_",
    "investment":           "invest_",
    "estate":               "estate_",
    "insurance":            "insurance_",
    "healthcare":           "healthcare_",
    "education":            "education_",
    "debt":                 "debt_",
    "business":             "business_",
    "equity_compensation":  "equity_",
    "behavioral":           "behavior_",
    "life_stage":           "lifestage_",
    "government_benefits":  "govbenefit_",
    "irs_reference":        "irs_",
    "general":              None,
}

_CLASSIFY_SYSTEM = """\
You are a financial domain classifier. Return JSON only — no markdown, no prose.

Given a user query, identify the single primary CFP domain from this list:
tax, retirement_savings, retirement_income, investment, estate, insurance,
healthcare, education, debt, business, equity_compensation, behavioral,
life_stage, government_benefits, irs_reference, general

Use "general" when the query spans multiple domains or is ambiguous.

Return exactly: {"domain": "<domain_key>"}"""


async def classify_domain(query: str) -> str:
    """Return the CFP domain key for a query. Returns 'general' on any failure."""
    try:
        response = _client.messages.create(
            model=settings.llm_model_classifier,
            max_tokens=32,
            system=_CLASSIFY_SYSTEM,
            messages=[
                {"role": "user", "content": query},
                {"role": "assistant", "content": "{"},
            ],
        )
        for block in response.content:
            if hasattr(block, "text"):
                raw = "{" + block.text
                data = json.loads(raw)
                domain = data.get("domain", "general")
                return domain if domain in DOMAIN_PREFIX_MAP else "general"
    except Exception:
        pass
    return "general"


def domain_to_prefix(domain: str) -> str | None:
    """Return the document_name prefix for a domain, or None for full-corpus search."""
    return DOMAIN_PREFIX_MAP.get(domain)
