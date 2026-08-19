from pathlib import Path
from typing import ClassVar

from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT: Path = Path(__file__).resolve().parent.parent.parent.parent
ENV_FILE: Path = PROJECT_ROOT / ".env"


# Global Settings
class Settings(BaseSettings):
    model_config: ClassVar[SettingsConfigDict] = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding="utf-8",
    )

    # MySQL Configuration
    MYSQL_DATABASE: str
    MYSQL_PASSWORD: str
    MYSQL_ROOT_PASSWORD: str
    MYSQL_HOST: str
    MYSQL_PORT: int
    MYSQL_USER: str

    # Redis Configuration
    REDIS_HOST: str
    REDIS_PORT: int
    ITEMS_CACHE_KEY: str
    ITEMS_CACHE_TTL_SECONDS: int

    # JWT Configuration
    JWT_SECRET: str
    JWT_ALGORITHM: str
    JWT_EXPIRATION_TIME: int

    # OpenAI Configuration
    OPENAI_API_KEY: str
    OPENAI_MODEL: str

    # Rate Limit Configuration
    RATE_LIMIT_WINDOW_SECONDS: int
    RATE_LIMIT_MAX_REQUESTS: int

    # Chat Configuration
    MAX_PROMPTS_PER_DAY: int
    CHAT_PROMPTS_KEY_PREFIX: str

    def __init__(self) -> None:
        super().__init__()


settings: Settings = Settings()
