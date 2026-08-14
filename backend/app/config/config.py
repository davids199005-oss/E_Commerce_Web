from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
ENV_FILE = PROJECT_ROOT / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding="utf-8")
    # MySQL Database Configuration
    MYSQL_DATABASE: str
    MYSQL_PASSWORD: str
    MYSQL_ROOT_PASSWORD: str
    MYSQL_HOST: str
    MYSQL_PORT: int
    MYSQL_USER: str

    # Redis Configuration
    REDIS_HOST: str
    REDIS_PORT: int

    # JWT Configuration
    JWT_SECRET: str
    JWT_ALGORITHM: str
    JWT_EXPIRATION_TIME: int

    # OpenAI API Key
    OPENAI_API_KEY: str


# Create a singleton instance of the settings
settings = Settings()
