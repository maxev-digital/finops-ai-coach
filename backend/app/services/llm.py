import anthropic
from app.config import settings

_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)


async def generate(system_prompt: str, user_message: str, max_tokens: int = 1024) -> str:
    response = _client.messages.create(
        model=settings.llm_model,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )
    return response.content[0].text


async def generate_json(system_prompt: str, user_message: str, max_tokens: int = 1024) -> dict:
    """Prefill assistant turn with '{' to coerce JSON output reliably."""
    import json
    response = _client.messages.create(
        model=settings.llm_model,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": "{"},
        ],
    )
    return json.loads("{" + response.content[0].text)
