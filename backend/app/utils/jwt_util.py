from datetime import datetime, timezone, timedelta
import jwt

from app.config.config import settings


class JwtUtil:
    @staticmethod
    def create_token(user_id: int) -> str:
        expiration_time = datetime.now(tz=timezone.utc) + timedelta(
            minutes=settings.JWT_EXPIRATION_TIME
        )

        payload: dict = {
            "sub": str(user_id),
            "exp": expiration_time,
        }

        return jwt.encode(
            payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM
        )

    @staticmethod
    def decode_token(token: str) -> int | None:
        try:
            payload = jwt.decode(
                token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM]
            )
            return int(payload["sub"])
        except jwt.InvalidTokenError:
            return None
