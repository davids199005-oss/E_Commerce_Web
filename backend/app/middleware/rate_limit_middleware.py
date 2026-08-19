from collections.abc import Awaitable, Callable

from fastapi import Request, Response, status
from fastapi.responses import JSONResponse
from starlette.concurrency import run_in_threadpool
from starlette.datastructures import Address
from starlette.middleware.base import BaseHTTPMiddleware

from app.cache.redis_client import cache_client
from app.config.config import settings
from app.utils.jwt_util import JwtUtil

EXCLUDED_PATHS = frozenset[str]({"/", "/docs", "/redoc", "/openapi.json"})
RATE_LIMIT_KEY_PREFIX: str = "rate:limit"


class RateLimitMiddleware(BaseHTTPMiddleware):
    @staticmethod
    def _resolve_identity(request: Request) -> str:
        header: str | None = request.headers.get("Authorization")
        if header is not None and header.startswith("Bearer "):
            user_id: int | None = JwtUtil.decode_token(
                token=header.removeprefix("Bearer ")
            )
            if user_id is not None:
                return f"user:{user_id}"

        client: Address | None = request.client
        return f"ip:{client.host}" if client is not None else "ip:unknown"

    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        if request.url.path in EXCLUDED_PATHS:
            return await call_next(request)

        key: str = f"{RATE_LIMIT_KEY_PREFIX}:{self._resolve_identity(request)}"
        used: int = await run_in_threadpool(
            func=cache_client.increment_with_expiry,
            key=key,
            amount=1,
            ttl_seconds=settings.RATE_LIMIT_WINDOW_SECONDS,
        )

        if used > settings.RATE_LIMIT_MAX_REQUESTS:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"detail": "Too many requests. Please slow down."},
                headers={"Retry-After": str(settings.RATE_LIMIT_WINDOW_SECONDS)},
            )

        return await call_next(request)
