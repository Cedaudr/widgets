from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Kravio Support Dashboard API"
    app_version: str = "1.0.0"
    api_prefix: str = "/api"

    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "widgets_dashboard"
    mongodb_timeout_ms: int = 5000

    seed_on_startup: bool = True
    cors_origins: str = "*"


settings = Settings()
