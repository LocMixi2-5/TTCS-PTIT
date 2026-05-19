# ═══════════════════════════════════════════════════
# Pydantic Schemas — Request/Response Models
# ═══════════════════════════════════════════════════
from pydantic import BaseModel, Field
from typing import Optional


# ─── Match Request/Response ───────────────────────
class MatchRequest(BaseModel):
    """Request body for manual text matching (non-file)"""
    manual_text: str = Field(..., min_length=10, description="CV text content")
    top_k: int = Field(default=20, ge=1, le=100)
    min_score: float = Field(default=0.3, ge=0.0, le=1.0)
    experience_level: Optional[str] = None
    location: Optional[str] = None


class MatchedJob(BaseModel):
    """Single matched job result"""
    job_id: int
    match_score: float = Field(description="Match percentage 0-100")
    experience_level: Optional[str] = None
    location: Optional[str] = None


class MatchResponse(BaseModel):
    """Response from /match endpoint"""
    cv_skills_extracted: list[str] = []
    cv_embedding_dim: int
    total_matches: int
    raw_text: Optional[str] = None
    results: list[MatchedJob] = []


# ─── Job Indexing ─────────────────────────────────
class JobForIndexing(BaseModel):
    """Single job to be indexed into vector DB"""
    id: int
    title: str
    description: str
    skills_desc: Optional[str] = None
    experience_level: Optional[str] = "Not specified"
    location: Optional[str] = "Remote"
    cleaned_text: Optional[str] = None


class IndexRequest(BaseModel):
    """Request to batch index jobs"""
    jobs: list[JobForIndexing]


class IndexResponse(BaseModel):
    """Response from /jobs/index endpoint"""
    indexed_count: int
    message: str


# ─── Health Check ─────────────────────────────────
class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    vector_db_connected: bool
    total_vectors: int = 0
