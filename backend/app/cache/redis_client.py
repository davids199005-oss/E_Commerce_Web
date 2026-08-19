import json
from decimal import Decimal
from typing import Any, Protocol, cast

import redis
from redis.client import Pipeline, Redis

from app.config.config import settings


class _PipelineFactory(Protocol):
    def pipeline(self, transaction: bool = True) -> Pipeline: ...


def _json_default(value: object) -> float:
    if isinstance(value, Decimal):
        return float(value)
    raise TypeError(f"Type {type(value).__name__} is not JSON serializable")


class CacheClient:
    def __init__(self) -> None:
        self.client: Redis = redis.Redis(
            host=settings.REDIS_HOST,
            port=settings.REDIS_PORT,
            decode_responses=True,
        )

    def get_json(self, key: str) -> list[dict[str, Any]] | dict[str, Any] | None:
        cached_value: bytes | str | None = self.client.get(name=key)
        if cached_value is None:
            return None
        return json.loads(s=cached_value)

    def set_json(
        self, key: str, value: list[Any] | dict[str, Any], ttl_seconds: int
    ) -> None:
        self.client.set(
            name=key, value=json.dumps(obj=value, default=_json_default), ex=ttl_seconds
        )

    def delete(self, key: str) -> None:
        self.client.delete(key)

    def increment_with_expiry(self, key: str, amount: int, ttl_seconds: int) -> int:
        client: _PipelineFactory = cast(_PipelineFactory, self.client)
        with client.pipeline() as pipeline:
            pipeline.incr(name=key, amount=amount)
            pipeline.expire(name=key, time=ttl_seconds, nx=True)
            results: list[Any] = pipeline.execute()
            return int(results[0])

    def get_int(self, key: str) -> int:
        value: bytes | str | None = self.client.get(name=key)
        return int(value) if value is not None else 0


cache_client: CacheClient = CacheClient()
