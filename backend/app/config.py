from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    anthropic_api_key: str
    openai_api_key: str
    database_url: str
    redis_url: str = "redis://localhost:6379/0"
    app_env: str = "development"
    cors_origins: str = "http://localhost:3000"

    # 3-tier model routing — update deliberately, never silently
    llm_model_classifier: str = "claude-haiku-4-5-20251001"  # domain routing, sub-100ms
    llm_model_generator: str = "claude-sonnet-4-6"           # hot path, streaming
    llm_model_evaluator: str = "claude-opus-4-8"             # async cross-model judge
    # Backward-compat alias used by health endpoint and legacy references
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


settings = Settings()  # type: ignore[call-arg]  # pydantic-settings loads from env, not constructor args
