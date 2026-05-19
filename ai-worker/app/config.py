# ═══════════════════════════════════════════════════
# Configuration — Environment Variables
# ═══════════════════════════════════════════════════
from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    # SBERT Model
    SBERT_MODEL_NAME: str = "paraphrase-multilingual-MiniLM-L12-v2"
    EMBEDDING_DIMENSION: int = 384

    # Pinecone Vector Database
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX_NAME: str = "job-embeddings"
    PINECONE_ENVIRONMENT: str = "us-east-1"  # Pinecone serverless region

    # PostgreSQL (for reading job metadata)
    DATABASE_URL: str = "postgresql://postgres:123456@localhost:5432/job_recommender"

    # Processing
    MAX_JOBS_PER_BATCH: int = 100
    DEFAULT_TOP_K: int = 20
    DEFAULT_MIN_SCORE: float = 0.3

    class Config:
        env_file = "../../.env"
        env_file_encoding = "utf-8"
        extra = "ignore"  # Ignore extra env vars


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
