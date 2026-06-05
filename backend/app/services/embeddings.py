"""
Embedding service with Redis cache.

OpenAI is used for embeddings (Anthropic has no embedding API).
text-embedding-3-small: $0.02/million tokens, 1536 dimensions.

Cache rationale: the same query ("should I max my 401k?") asked by
multiple demo users hits OpenAI once — subsequent calls return the
cached vector. TTL 1hr. Degrades gracefully if Redis is unavailable.
"""
import hashlib
import json
import logging

from openai import OpenAI
from app.config import settings

logger = logging.getLogger(__name__)

_client = OpenAI(api_key=settings.openai_api_key)
_redis = None


def _get_redis():
    """Lazy Redis connection — returns None if unavailable (graceful degrade)."""
    global _redis
    if _redis is not None:
        return _redis
    try:
        import redis as redis_lib
        r = redis_lib.from_url(settings.redis_url, decode_responses=False)
        r.ping()
        _redis = r
        return _redis
    except Exception:
        return None


def _cache_key(text: str) -> str:
    return f"embed:{hashlib.sha256(text.encode()).hexdigest()}"


def embed_text(text: str) -> list[float]:
    """Embed a single string. Returns a 1536-dim vector."""
    response = _client.embeddings.create(
        model=settings.embedding_model,
        input=text,
        dimensions=settings.embedding_dimensions,
    )
    return response.data[0].embedding


async def embed_text_cached(text: str) -> list[float]:
    """Embed with Redis cache. Falls back to direct API call if Redis is down."""
    r = _get_redis()
    if r:
        try:
            cached = r.get(_cache_key(text))
            if cached:
                return json.loads(cached)
        except Exception:
            logger.warning("Redis read failed, falling back to direct embed")

    embedding = embed_text(text)

    if r:
        try:
            r.setex(_cache_key(text), settings.embed_cache_ttl, json.dumps(embedding))
        except Exception:
            logger.warning("Redis write failed, embedding not cached")

    return embedding


def embed_batch(texts: list[str]) -> list[list[float]]:
    """Batch embed — more efficient than calling embed_text in a loop."""
    response = _client.embeddings.create(
        model=settings.embedding_model,
        input=texts,
        dimensions=settings.embedding_dimensions,
    )
    return [item.embedding for item in response.data]
