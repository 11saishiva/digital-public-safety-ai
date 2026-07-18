from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str
    VERSION: str

    API_PREFIX: str

    HOST: str

    PORT: int

    DEBUG: bool

    DATABASE_URL: str

    UPLOAD_DIR: str

    MODEL_DIR: str

    LOG_DIR: str

    MAX_UPLOAD_SIZE_MB: int

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
    )


settings = Settings()
