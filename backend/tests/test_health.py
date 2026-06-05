"""
Smoke tests — verify the app starts, routes register, and health endpoint responds.
These run without any AI service calls and establish a baseline for CI.
"""
import pytest
from httpx import AsyncClient


@pytest.mark.anyio
async def test_health_returns_ok(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "model" in data
    assert "env" in data


@pytest.mark.anyio
async def test_health_env_is_test(client: AsyncClient):
    response = await client.get("/health")
    assert response.json()["env"] == "test"


@pytest.mark.anyio
async def test_unknown_route_returns_404(client: AsyncClient):
    response = await client.get("/nonexistent-route")
    assert response.status_code == 404


@pytest.mark.anyio
async def test_openapi_schema_available(client: AsyncClient):
    """OpenAPI docs should be available in test/dev environments."""
    response = await client.get("/openapi.json")
    assert response.status_code == 200
    schema = response.json()
    assert schema["info"]["title"] == "FinOps AI Coach"
    assert schema["info"]["version"] == "0.1.0"
    # NOTE: router path assertions (/chat, /profile, /evaluate) are added
    # in test_api_chat.py / test_api_profile.py once endpoints are implemented
    # in the feat/rag-pipeline branch.
