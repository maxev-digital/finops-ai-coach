from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str
    openai_api_key: str
    database_url: str
    redis_url: str = "redis://localhost:6379/0"
    app_env: str = "development"
    cors_origins: str = "http://localhost:3000"

    # Pinned model IDs — update deliberately, never silently
    llm_model: str = "claude-sonnet-4-6"
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536

    # RAG tuning
    retrieval_top_k: int = 5
    chunk_size: int = 800
    chunk_overlap: int = 100

    # Embedding cache TTL in seconds
    embed_cache_ttl: int = 3600

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def is_test(self) -> bool:
        return self.app_env == "test"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
