from datetime import datetime, timedelta, timezone
from app.cache.redis_client import cache_client
from app.exceptions.app_exceptions import RateLimitError
from app.config.config import settings


class ChatLimitService:
    @staticmethod
    def _build_key(user_id: int) -> str:
        today: str = datetime.now(tz=timezone.utc).strftime(format="%Y-%m-%d")
        return f"{settings.CHAT_PROMPTS_KEY_PREFIX}:{user_id}:{today}"

    @staticmethod
    def _seconds_until_midnight() -> int:
        now: datetime = datetime.now(tz=timezone.utc)
        next_midnight: datetime = (now + timedelta(days=1)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        return int((next_midnight - now).total_seconds())

    @staticmethod
    def get_used_prompts(user_id: int) -> int:
        return cache_client.get_int(key=ChatLimitService._build_key(user_id))


    @staticmethod
    def consume_prompt(user_id: int) -> int:
        used: int = cache_client.increment_with_expiry(
            key=ChatLimitService._build_key(user_id),
            amount=1,
            ttl_seconds=ChatLimitService._seconds_until_midnight(),
        )
        if used > settings.MAX_PROMPTS_PER_DAY:
            raise RateLimitError(
                f"Daily prompt limit reached ({settings.MAX_PROMPTS_PER_DAY} per day). "
                f"Try again tomorrow."
            )
        return used

    @staticmethod
    def refund_prompt(user_id: int) -> None:
        cache_client.increment_with_expiry(
            key=ChatLimitService._build_key(user_id),
            amount=-1,
            ttl_seconds=ChatLimitService._seconds_until_midnight(),
        )