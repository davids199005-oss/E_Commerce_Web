from typing import Any


from datetime import datetime, timedelta, timezone

import jwt
from app.config.config import settings


class JwtUtil:
    @staticmethod
    def create_token(user_id: int) -> str:
        expiration_time: datetime = datetime.now(tz=timezone.utc) + timedelta(
            minutes=settings.JWT_EXPIRATION_TIME
        )

        payload: dict[str, Any] = {
            "sub": str(user_id),
            "exp": expiration_time,
        }

        return jwt.encode(
            payload=payload, key=settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
        )

    @staticmethod
    def decode_token(token: str) -> int | None:
        try:
            payload: Any = jwt.decode(
                jwt=token, key=settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
            )
            return int(payload["sub"])
        except jwt.InvalidTokenError:
            return None
