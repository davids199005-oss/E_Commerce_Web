from decimal import Decimal
import json
from typing import Any

import redis
from redis.client import Redis

from app.config.config import settings


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

    def set_json(self, key: str, value: list[Any] | dict[str, Any], ttl_seconds: int) -> None:
        self.client.set(name=key, value=json.dumps(obj=value, default=_json_default), ex=ttl_seconds)

    def delete(self, key: str) -> None:
        self.client.delete(key)


cache_client: CacheClient = CacheClient()
