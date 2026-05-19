# ═══════════════════════════════════════════════════
# Jobs Router — Batch Index Jobs Into Vector Database
#
# POST /api/ai/jobs/index
#   Receive job data → Encode with SBERT → Store in Pinecone
#
# This converts jobs from PostgreSQL into searchable vectors.
# ═══════════════════════════════════════════════════
from fastapi import APIRouter, Request, HTTPException
from app.models.schemas import IndexRequest, IndexResponse
from app.services.text_processor import clean_text

router = APIRouter()


@router.post("/jobs/index", response_model=IndexResponse)
async def index_jobs(request: Request, body: IndexRequest):
    """
    Batch encode and index jobs into Pinecone.

    This endpoint:
    1. Receives a batch of job records (from PostgreSQL)
    2. Cleans and combines text fields
    3. Encodes them with SBERT (384-dim vectors)
    4. Upserts into VectorDB (Milvus) for similarity search

    Called by Node.js backend during initial data migration
    or when new jobs are added.
    """
    model = request.app.state.model
    vector_db = request.app.state.vector_db

    if len(body.jobs) == 0:
        raise HTTPException(status_code=400, detail="No jobs to index")

    try:
        # 1. Prepare texts for encoding
        job_ids = []
        texts = []
        metadata_list = []

        for job in body.jobs:
            job_ids.append(job.id)

            # Combine fields for embedding (same as original matching_engine.py)
            full_text = f"{job.description} {job.skills_desc or ''}"
            cleaned = job.cleaned_text or clean_text(full_text)
            texts.append(cleaned)

            metadata_list.append({
                "title": job.title[:200],
                "experience_level": job.experience_level or "Not specified",
                "location": job.location or "Remote",
            })

        # 2. Batch encode with SBERT
        print(f">>> Encoding {len(texts)} jobs with SBERT...")
        embeddings = model.encode_batch(texts)

        # 3. Upsert into Vector DB
        if vector_db.connected:
            vector_db.upsert_jobs(job_ids, embeddings, metadata_list)
        else:
            # Store in memory fallback
            import numpy as np
            if hasattr(request.app.state, 'fallback_data'):
                fb = request.app.state.fallback_data
                fb['job_ids'].extend(job_ids)
                fb['embeddings'] = np.vstack([fb['embeddings'], embeddings])
                fb['metadata'].extend(metadata_list)
            else:
                request.app.state.fallback_data = {
                    'job_ids': job_ids,
                    'embeddings': embeddings,
                    'metadata': metadata_list,
                }
            print(f">>> Stored {len(job_ids)} job embeddings in memory (fallback mode)")

        return IndexResponse(
            indexed_count=len(job_ids),
            message=f"Successfully indexed {len(job_ids)} jobs",
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Indexing failed: {str(e)}"
        )


@router.post("/encode")
async def encode_text(request: Request, text: str):
    """Encode a single text and return the vector (utility endpoint)"""
    model = request.app.state.model
    vector = model.encode_single(text)
    return {
        "dimension": len(vector),
        "vector": vector.tolist(),
    }
