# ═══════════════════════════════════════════════════
# FastAPI Main Entry Point — AI Worker Service
#
# This service handles all AI/ML operations:
# - SBERT text encoding (paraphrase-multilingual-MiniLM-L12-v2)
# - CV parsing and skill extraction
# - Vector similarity search (Pinecone or numpy fallback)
# - Job batch indexing
#
# Architecture:
#   React Frontend → Node.js API Gateway → THIS SERVICE
#   (Port 5173)      (Port 3000)           (Port 8000)
#
# Startup sequence:
#   1. Load SBERT model into GPU/CPU memory
#   2. Connect to Pinecone (or enable numpy fallback)
#   3. Load fallback job data from PostgreSQL (if needed)
#   4. Start accepting requests from Node.js
# ═══════════════════════════════════════════════════
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import numpy as np

from app.config import settings
from app.models.embedding import EmbeddingModel
from app.services.milvus_service import MilvusService
from app.services.text_processor import clean_text
from app.routers import match, jobs, match_job


def load_fallback_jobs(model: EmbeddingModel) -> dict | None:
    """
    Load jobs from PostgreSQL and encode them for numpy fallback.
    Used when Pinecone is not configured (local development).
    """
    try:
        import psycopg2
        conn = psycopg2.connect(settings.DATABASE_URL)
        cur = conn.cursor()
        cur.execute("""
            SELECT id, title, description, skills_desc, experience_level, location, cleaned_text
            FROM jobs
            WHERE is_active = true
            ORDER BY id
            LIMIT 5000
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()

        if not rows:
            print(">>> No jobs found in PostgreSQL. Run 'npm run seed' first.")
            return None

        print(f">>> Loading {len(rows)} jobs from PostgreSQL for fallback search...")

        job_ids = []
        texts = []
        metadata = []

        for row in rows:
            job_id, title, desc, skills_desc, exp_level, location, cleaned = row
            job_ids.append(job_id)
            text = cleaned or clean_text(f"{desc or ''} {skills_desc or ''}")
            texts.append(text)
            metadata.append({
                "title": title or "",
                "experience_level": exp_level or "Not specified",
                "location": location or "Remote",
            })

        # Batch encode all jobs
        print(">>> Encoding jobs with SBERT (this may take a moment)...")
        embeddings = model.encode_batch(texts, batch_size=64)

        print(f">>> [OK] Fallback data ready: {len(job_ids)} jobs encoded")
        return {
            "job_ids": job_ids,
            "embeddings": embeddings,
            "metadata": metadata,
        }

    except Exception as e:
        print(f">>> [WARN] Could not load fallback data: {e}")
        return None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifecycle:
    - Startup: Load SBERT model + Connect to Pinecone
    - Shutdown: Disconnect from Pinecone
    """
    print("=" * 55)
    print("  [AI] AI Worker Service - Starting up...")
    print("=" * 55)

    # 1. Load SBERT model
    app.state.model = EmbeddingModel(settings.SBERT_MODEL_NAME)

    # 2. Connect to Milvus
    app.state.vector_db = MilvusService()
    app.state.vector_db.connect()

    # 3. Sync Milvus or load fallback data
    fallback = load_fallback_jobs(app.state.model)
    if fallback:
        app.state.fallback_data = fallback
        if app.state.vector_db.connected and app.state.vector_db.collection.num_entities == 0:
            print(">>> Milvus is empty! Syncing data from PostgreSQL...")
            app.state.vector_db.upsert_jobs(fallback["job_ids"], fallback["embeddings"], fallback["metadata"])

    print("=" * 55)
    print("  [OK] AI Worker ready to receive requests")
    print(f"  [DB] Vector DB: {'Connected' if app.state.vector_db.connected else 'Fallback mode (numpy)'}")
    print("=" * 55)

    yield  # Server is running

    # Shutdown
    print(">>> Shutting down AI Worker...")
    app.state.vector_db.disconnect()


# ─── Create FastAPI App ───────────────────────────
app = FastAPI(
    title="Job Recommender AI Worker",
    description="AI processing service: SBERT encoding, CV parsing, vector similarity search",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — Allow Node.js backend to call this service
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ────────────────────────────
app.include_router(match.router, prefix="/api/ai", tags=["Matching"])
app.include_router(jobs.router, prefix="/api/ai", tags=["Jobs Indexing"])
app.include_router(match_job.router, prefix="/api/ai", tags=["Job Match"])


# ─── Health Check ─────────────────────────────────
@app.get("/health", tags=["Health"])
async def health():
    """Health check endpoint for monitoring"""
    db_stats = app.state.vector_db.get_stats() if app.state.vector_db else {}
    return {
        "status": "healthy",
        "service": "ai-worker",
        "model_loaded": hasattr(app.state, 'model') and app.state.model is not None,
        "vector_db_connected": app.state.vector_db.connected if app.state.vector_db else False,
        "total_vectors": db_stats.get("total_vectors", 0),
        "fallback_mode": hasattr(app.state, 'fallback_data'),
    }


@app.get("/api/ai/stats", tags=["Health"])
async def stats():
    """Detailed statistics endpoint"""
    db_stats = app.state.vector_db.get_stats() if app.state.vector_db else {}
    fallback_count = 0
    if hasattr(app.state, 'fallback_data'):
        fallback_count = len(app.state.fallback_data.get('job_ids', []))

    return {
        "vector_db": db_stats,
        "fallback_jobs_loaded": fallback_count,
        "model": {
            "name": settings.SBERT_MODEL_NAME,
            "dimension": settings.EMBEDDING_DIMENSION,
        },
    }


# ─── Entry Point ──────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
