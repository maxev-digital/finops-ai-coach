import json
import anthropic
from anthropic.types import TextBlock
from app.config import settings

_client = anthropic.Anthropic(api_key=settings.anthropic_api_key)


def _extract_text(response: anthropic.types.Message) -> str:
    """Return the text from the first TextBlock in a response.

    The Anthropic SDK response.content is a union of TextBlock, ToolUseBlock,
    ThinkingBlock, and RedactedThinkingBlock. Only TextBlock has .text — mypy
    correctly rejects a blind content[0].text access. We filter explicitly.
    """
    for block in response.content:
        if isinstance(block, TextBlock):
            return block.text
    raise ValueError(f"No TextBlock in Anthropic response (got: {[type(b).__name__ for b in response.content]})")


async def generate(system_prompt: str, user_message: str, max_tokens: int = 1024) -> str:
    response = _client.messages.create(
        model=settings.llm_model,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[{"role": "user", "content": user_message}],
    )
    return _extract_text(response)


async def generate_json(system_prompt: str, user_message: str, max_tokens: int = 1024) -> dict:
    """Prefill assistant turn with '{' to coerce JSON output reliably."""
    response = _client.messages.create(
        model=settings.llm_model,
        max_tokens=max_tokens,
        system=system_prompt,
        messages=[
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": "{"},
        ],
    )
    return json.loads("{" + _extract_text(response))
