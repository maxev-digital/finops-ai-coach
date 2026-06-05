"""
Test configuration and shared fixtures.

Key principle: ALL paid API calls (Anthropic, OpenAI) are mocked.
Tests must never spend real money or require live API keys.
"""
import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from app.main import app
from app.database import get_db, Base


# ── Test database (uses the CI postgres service) ──────────────────────────────

@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest_asyncio.fixture(scope="session")
async def test_engine():
    """Session-scoped async engine pointing at the CI test database."""
    import os
    db_url = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://finops_test:finops_test@localhost:5432/finops_test",
    )
    engine = create_async_engine(db_url, echo=False)
    async with engine.begin() as conn:
        await conn.execute(__import__("sqlalchemy").text("CREATE EXTENSION IF NOT EXISTS vector"))
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture
async def db_session(test_engine):
    """Per-test async DB session that rolls back after each test."""
    async_session = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def client(db_session):
    """Async test client with DB dependency overridden."""
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


# ── Mocked AI clients ─────────────────────────────────────────────────────────

@pytest.fixture
def mock_anthropic_response():
    """Returns a callable that produces a fake Anthropic message response."""
    def _make_response(text: str = "This is a mock financial wellness response."):
        mock = MagicMock()
        mock.content = [MagicMock(text=text)]
        return mock
    return _make_response


@pytest.fixture
def mock_anthropic(mock_anthropic_response):
    """Patches the Anthropic client used in llm.py."""
    with patch("app.services.llm._client") as mock_client:
        mock_client.messages.create = MagicMock(
            return_value=mock_anthropic_response()
        )
        yield mock_client


@pytest.fixture
def mock_openai_embeddings():
    """Patches the OpenAI client used in embeddings.py."""
    with patch("app.services.embeddings._client") as mock_client:
        mock_embedding = MagicMock()
        mock_embedding.embedding = [0.1] * 1536
        mock_client.embeddings.create = MagicMock(
            return_value=MagicMock(data=[mock_embedding])
        )
        yield mock_client
