from openai import OpenAI
from app.config import settings

_client = OpenAI(api_key=settings.openai_api_key)


def embed_text(text: str) -> list[float]:
    response = _client.embeddings.create(
        model=settings.embedding_model,
        input=text,
        dimensions=settings.embedding_dimensions,
    )
    return response.data[0].embedding


def embed_batch(texts: list[str]) -> list[list[float]]:
    response = _client.embeddings.create(
        model=settings.embedding_model,
        input=texts,
        dimensions=settings.embedding_dimensions,
    )
    return [item.embedding for item in response.data]
