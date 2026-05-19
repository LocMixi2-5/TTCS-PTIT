# ═══════════════════════════════════════════════════
# Pinecone Vector Database Service
#
# Replaces the original cosine_similarity on numpy arrays
# with Pinecone's managed vector search:
# - Scales to millions of vectors
# - ANN search in ~10ms (vs O(n) brute-force)
# - Built-in metadata filtering
# - No infrastructure to manage
#
# Migration path from original code:
#   BEFORE: similarities = cosine_similarity(cv_embedding, job_embeddings)[0]
#   AFTER:  results = pinecone_service.search_similar(cv_embedding, top_k=20)
# ═══════════════════════════════════════════════════
from pinecone import Pinecone, ServerlessSpec
import numpy as np
from app.config import settings

DIMENSION = 384  # MiniLM-L12-v2 output dimension


class PineconeService:
    """Manages Pinecone vector database operations"""

    def __init__(self):
        self.pc: Pinecone | None = None
        self.index = None
        self.connected = False

    def connect(self):
        """Initialize Pinecone client and ensure index exists"""
        try:
            if not settings.PINECONE_API_KEY:
                print("⚠️  PINECONE_API_KEY not set — vector search disabled")
                print("   The worker will fall back to numpy cosine similarity")
                self.connected = False
                return

            self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)

            # Create index if it doesn't exist
            index_name = settings.PINECONE_INDEX_NAME
            existing_indexes = [idx.name for idx in self.pc.list_indexes()]

            if index_name not in existing_indexes:
                print(f">>> Creating Pinecone index '{index_name}'...")
                self.pc.create_index(
                    name=index_name,
                    dimension=DIMENSION,
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region=settings.PINECONE_ENVIRONMENT,
                    ),
                )
                print(f">>> Index '{index_name}' created successfully")

            self.index = self.pc.Index(index_name)
            self.connected = True
            stats = self.index.describe_index_stats()
            print(f">>> Connected to Pinecone index '{index_name}' "
                  f"({stats.total_vector_count} vectors)")

        except Exception as e:
            print(f"⚠️  Pinecone connection failed: {e}")
            print("   Falling back to numpy cosine similarity")
            self.connected = False

    def disconnect(self):
        """Cleanup Pinecone connection"""
        self.index = None
        self.connected = False

    def upsert_jobs(
        self,
        job_ids: list[int],
        embeddings: np.ndarray,
        metadata_list: list[dict],
        batch_size: int = 100,
    ):
        """
        Batch upsert job embeddings into Pinecone.

        Args:
            job_ids: List of job IDs (used as vector IDs)
            embeddings: numpy array of shape (n, 384)
            metadata_list: List of dicts with filterable fields
            batch_size: Number of vectors per upsert call
        """
        if not self.connected:
            raise RuntimeError("Pinecone not connected")

        vectors = []
        for i, (job_id, embedding, metadata) in enumerate(
            zip(job_ids, embeddings, metadata_list)
        ):
            vectors.append({
                "id": str(job_id),
                "values": embedding.tolist(),
                "metadata": metadata,
            })

            # Flush batch
            if len(vectors) >= batch_size:
                self.index.upsert(vectors=vectors)
                vectors = []

        # Flush remaining
        if vectors:
            self.index.upsert(vectors=vectors)

        print(f">>> Upserted {len(job_ids)} job embeddings into Pinecone")

    def search_similar(
        self,
        query_vector: np.ndarray,
        top_k: int = 20,
        filters: dict | None = None,
    ) -> list[dict]:
        """
        Search for similar jobs using vector similarity.

        This replaces:
            cosine_similarity(cv_embedding, job_embeddings)[0]
        With:
            Pinecone ANN search — scales to millions of vectors

        Args:
            query_vector: CV embedding vector (384-dim)
            top_k: Number of results to return
            filters: Optional metadata filters

        Returns:
            List of {job_id, score, metadata} dicts
        """
        if not self.connected:
            return []

        # Build Pinecone filter expression
        filter_dict = {}
        if filters:
            if filters.get("experience_level"):
                filter_dict["experience_level"] = {
                    "$eq": filters["experience_level"]
                }
            if filters.get("location"):
                filter_dict["location"] = {
                    "$eq": filters["location"]
                }

        results = self.index.query(
            vector=query_vector.tolist(),
            top_k=top_k,
            include_metadata=True,
            filter=filter_dict if filter_dict else None,
        )

        matched_jobs = []
        for match in results.matches:
            matched_jobs.append({
                "job_id": int(match.id),
                "score": float(match.score),
                "experience_level": match.metadata.get("experience_level", ""),
                "location": match.metadata.get("location", ""),
            })

        return matched_jobs

    def get_stats(self) -> dict:
        """Get index statistics"""
        if not self.connected:
            return {"connected": False, "total_vectors": 0}

        stats = self.index.describe_index_stats()
        return {
            "connected": True,
            "total_vectors": stats.total_vector_count,
            "dimension": stats.dimension,
        }
