# ═══════════════════════════════════════════════════
# Match Router — CV Matching Endpoint
#
# POST /api/ai/match
#   Receive CV (PDF or text) → SBERT encode → Vector DB search
#   → Return ranked job matches with scores
#
# This endpoint replaces the entire Streamlit processing pipeline.
# ═══════════════════════════════════════════════════
from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException
from typing import Optional

router = APIRouter()


@router.post("/match")
async def match_cv(
    request: Request,
    file: Optional[UploadFile] = File(None),
    manual_text: Optional[str] = Form(None),
    top_k: int = Form(20),
    min_score: float = Form(0.3),
    experience_level: Optional[str] = Form(None),
    location: Optional[str] = Form(None),
):
    """
    Receive CV (PDF or text) → Process with SBERT → Search Vector DB → Return matches

    Accepts either:
    - A PDF file upload (cv_file field)
    - Manual text input (manual_text field)

    Returns:
    - cv_skills_extracted: Skills found in the CV
    - total_matches: Number of matching jobs
    - results: List of {job_id, match_score, experience_level, location}
    """
    from app.services.matching import MatchingService

    service = MatchingService(
        model=request.app.state.model,
        vector_db=request.app.state.vector_db,
    )

    # If Vector DB not connected, use fallback data
    if not request.app.state.vector_db.connected:
        if hasattr(request.app.state, 'fallback_data'):
            fb = request.app.state.fallback_data
            service.set_fallback_data(fb['job_ids'], fb['embeddings'], fb['metadata'])

    # Build filters
    filters = {}
    if experience_level:
        filters["experience_level"] = experience_level
    if location:
        filters["location"] = location

    try:
        result = await service.process_cv(
            file=file,
            manual_text=manual_text,
            top_k=top_k,
            min_score=min_score,
            filters=filters if filters else None,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")
