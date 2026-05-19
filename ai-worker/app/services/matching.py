# ═══════════════════════════════════════════════════
# Matching Service — Orchestrates the CV → Job matching pipeline
#
# This is the core AI pipeline that replaces the Streamlit app logic:
#
# Original flow (app.py):
#   1. extract_text_from_pdf(uploaded_file)
#   2. cv_cleaned = clean_text(cv_full_text)
#   3. cv_embedding = model.encode([cv_cleaned])
#   4. similarities = cosine_similarity(cv_embedding, job_embeddings)[0]
#   5. top_indices = np.argsort(similarities)[::-1][:top_k]
#
# New flow (this service):
#   1. extract_text_from_pdf(file)  — same logic, async
#   2. clean_text(raw_text)         — same function, ported
#   3. extract_skills(raw_text)     — NEW: keyword extraction
#   4. model.encode_single(cleaned) — same SBERT model
#   5. vector_db.search_similar()    — NEW: replaces cosine_similarity
#   6. Filter by min_score          — same concept
# ═══════════════════════════════════════════════════
from fastapi import UploadFile
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.services.cv_parser import extract_text_from_pdf
from app.services.text_processor import clean_text, extract_skills
from app.models.embedding import EmbeddingModel
from app.services.milvus_service import MilvusService


class MatchingService:
    """Orchestrates the complete CV matching pipeline"""

    def __init__(self, model: EmbeddingModel, vector_db: MilvusService):
        self.model = model
        self.vector_db = vector_db
        # Fallback: store job embeddings in memory if Vector DB not available
        self._fallback_embeddings: np.ndarray | None = None
        self._fallback_job_ids: list[int] = []
        self._fallback_metadata: list[dict] = []

    def set_fallback_data(self, job_ids: list[int], embeddings: np.ndarray,
                          metadata: list[dict]):
        """Store job data in memory for numpy fallback search"""
        self._fallback_embeddings = embeddings
        self._fallback_job_ids = job_ids
        self._fallback_metadata = metadata
        print(f">>> Fallback data loaded: {len(job_ids)} jobs in memory")

    def _fallback_search(self, query_vector: np.ndarray, top_k: int = 20,
                         filters: dict | None = None) -> list[dict]:
        """
        Numpy cosine similarity fallback when Vector DB is not available.
        This is the same algorithm as the original matching_engine.py
        """
        if self._fallback_embeddings is None:
            return []

        # cosine_similarity returns shape (1, n_jobs)
        similarities = cosine_similarity(
            query_vector.reshape(1, -1),
            self._fallback_embeddings
        )[0]

        # Get top-k indices
        top_indices = np.argsort(similarities)[::-1][:top_k * 2]  # Get extra for filtering

        results = []
        for idx in top_indices:
            if len(results) >= top_k:
                break

            meta = self._fallback_metadata[idx] if idx < len(self._fallback_metadata) else {}

            # Apply filters
            if filters:
                if filters.get("experience_level"):
                    if meta.get("experience_level", "").lower() != filters["experience_level"].lower():
                        continue
                if filters.get("location"):
                    if filters["location"].lower() not in meta.get("location", "").lower():
                        continue

            results.append({
                "job_id": self._fallback_job_ids[idx],
                "score": float(similarities[idx]),
                "experience_level": meta.get("experience_level", ""),
                "location": meta.get("location", ""),
            })

        return results

    async def process_cv(
        self,
        file: UploadFile | None = None,
        manual_text: str | None = None,
        top_k: int = 20,
        min_score: float = 0.3,
        filters: dict | None = None,
    ) -> dict:
        """
        Complete CV processing pipeline:

        1. Parse PDF → raw text (or use manual input)
        2. Clean text (normalize)
        3. Extract skills keywords
        4. Encode to 384-dim vector with SBERT
        5. Search Vector DB (or fallback to numpy) for similar jobs
        6. Filter by min_score and return results

        Args:
            file: Uploaded PDF file (optional)
            manual_text: Raw CV text (optional, alternative to file)
            top_k: Number of top results
            min_score: Minimum similarity score (0-1)
            filters: Optional filters (experience_level, location)

        Returns:
            Dict with cv_skills_extracted, results, etc.
        """
        # Step 1: Get raw text
        if file:
            raw_text = await extract_text_from_pdf(file)
        elif manual_text:
            raw_text = manual_text
        else:
            raise ValueError("Either file or manual_text must be provided")

        # Step 2: Clean text
        cleaned = clean_text(raw_text)

        # Step 3: Extract skills
        cv_skills = extract_skills(raw_text)

        # Step 4: Encode with SBERT
        cv_embedding = self.model.encode_single(cleaned)

        # Step 5: Search for similar jobs
        if self.vector_db.connected:
            # Use Vector DB search (production)
            raw_results = self.vector_db.search_similar(
                cv_embedding, top_k=top_k, filters=filters
            )
        else:
            # Fallback to numpy cosine similarity (development/demo)
            raw_results = self._fallback_search(
                cv_embedding, top_k=top_k, filters=filters
            )

        # Step 6: Filter by min_score and format
        results = []
        for r in raw_results:
            if r["score"] >= min_score:
                results.append({
                    "job_id": r["job_id"],
                    "match_score": round(r["score"] * 100, 2),
                    "experience_level": r["experience_level"],
                    "location": r["location"],
                })

        return {
            "cv_skills_extracted": cv_skills,
            "cv_embedding_dim": len(cv_embedding),
            "total_matches": len(results),
            "raw_text": raw_text[:2000] if raw_text else None,  # Return first 2000 chars
            "results": results,
        }
