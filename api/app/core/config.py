import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AuraLuxe — Women's Fashion E-Commerce"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "auraluxe-super-secret-jwt-key-for-fashion-store-2026-production-ready")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:////tmp/auraluxe.db" if os.getenv("VERCEL") else "sqlite:///./auraluxe.db"
    )
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
