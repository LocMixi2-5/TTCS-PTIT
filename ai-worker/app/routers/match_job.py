# ═══════════════════════════════════════════════════
# Match Job Router — So khớp CV với một vị trí cụ thể
#
# POST /api/ai/match-job
#   Nhận CV (PDF) + job_text → SBERT encode cả hai
#   → cosine similarity trực tiếp → trả về match_score + skills
# ═══════════════════════════════════════════════════
from fastapi import APIRouter, UploadFile, File, Form, Request, HTTPException
from typing import Optional
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

from app.services.cv_parser import extract_text_from_pdf
from app.services.text_processor import clean_text, extract_skills

router = APIRouter()


@router.post("/match-job")
async def match_cv_to_job(
    request: Request,
    file: Optional[UploadFile] = File(None),
    manual_text: Optional[str] = Form(None),
    job_text: str = Form(...),
):
    """
    So khớp CV với một vị trí tuyển dụng cụ thể.

    Args:
        file: CV PDF file
        manual_text: Hoặc text CV thủ công
        job_text: Full text của job (title + description + skills_desc)

    Returns:
        match_score: 0-100
        cv_skills_extracted: danh sách skills từ CV
        matched_skills: skills trùng khớp với job
    """
    model = request.app.state.model

    # 1. Parse CV
    if file and file.filename:
        raw_text = await extract_text_from_pdf(file)
    elif manual_text:
        raw_text = manual_text
    else:
        raise HTTPException(status_code=400, detail="Cần cung cấp file CV hoặc text CV")

    if not raw_text or len(raw_text.strip()) < 50:
        raise HTTPException(
            status_code=422,
            detail="Không thể đọc nội dung CV. Vui lòng đảm bảo file PDF có thể đọc được (không phải scan ảnh)."
        )

    # 2. Clean texts
    cv_cleaned = clean_text(raw_text)
    job_cleaned = clean_text(job_text)

    # 3. Extract CV skills
    cv_skills = extract_skills(raw_text)

    # 4. Encode both with SBERT
    cv_embedding = model.encode_single(cv_cleaned)
    job_embedding = model.encode_single(job_cleaned)

    # 5. Cosine similarity
    sim = cosine_similarity(
        cv_embedding.reshape(1, -1),
        job_embedding.reshape(1, -1)
    )[0][0]

    match_score = round(float(sim) * 100, 2)

    return {
        "match_score": match_score,
        "cv_skills_extracted": cv_skills,
        "raw_text_length": len(raw_text),
    }
