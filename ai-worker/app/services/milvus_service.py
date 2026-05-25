# ═══════════════════════════════════════════════════
# Milvus Vector Database Service
#
# Replaces Pinecone/Numpy with local Milvus Lite:
# - Uses pymilvus with uri="./milvus.db"
# - Auto-creates collection if not exists
# - Performs fast ANN search
# ═══════════════════════════════════════════════════
import os
from pymilvus import connections, FieldSchema, CollectionSchema, DataType, Collection, utility
import numpy as np
from app.config import settings

DIMENSION = 384  # MiniLM-L12-v2 output dimension
COLLECTION_NAME = "job_embeddings"

class MilvusService:
    """Manages Milvus (Lite) vector database operations"""

    def __init__(self):
        self.collection = None
        self.connected = False

    def connect(self):
        """Initialize Milvus connection and ensure collection exists"""
        try:
            db_path = os.path.join(os.path.dirname(__file__), '..', '..', 'milvus.db')
            print(f">>> Connecting to Milvus Lite at {db_path}...")
            connections.connect("default", uri=db_path)
            
            if not utility.has_collection(COLLECTION_NAME):
                print(f">>> Creating Milvus collection '{COLLECTION_NAME}'...")
                # Define Schema
                fields = [
                    FieldSchema(name="job_id", dtype=DataType.INT64, is_primary=True, description="Job ID from postgres"),
                    FieldSchema(name="embedding", dtype=DataType.FLOAT_VECTOR, dim=DIMENSION, description="SBERT embedding"),
                    FieldSchema(name="experience_level", dtype=DataType.VARCHAR, max_length=100, description="Experience Filter"),
                    FieldSchema(name="location", dtype=DataType.VARCHAR, max_length=100, description="Location Filter")
                ]
                schema = CollectionSchema(fields, "Job Embeddings Collection")
                self.collection = Collection(COLLECTION_NAME, schema)
                
                # Create Index
                index_params = {
                    "metric_type": "COSINE",
                    "index_type": "FLAT", # Since it's local prototyping, FLAT is perfect. Or HNSW.
                    "params": {}
                }
                self.collection.create_index(field_name="embedding", index_params=index_params)
                print(f">>> Collection '{COLLECTION_NAME}' created successfully")
            else:
                self.collection = Collection(COLLECTION_NAME)
                
            self.collection.load()
            self.connected = True
            print(f">>> Connected to Milvus collection '{COLLECTION_NAME}' (Entities: {self.collection.num_entities})")

        except Exception as e:
            print(f"[WARN] Milvus connection failed: {e}")
            print("   Falling back to numpy cosine similarity")
            self.connected = False

    def disconnect(self):
        """Cleanup connection"""
        if self.connected and self.collection:
            self.collection.release()
        connections.disconnect("default")
        self.connected = False

    def upsert_jobs(
        self,
        job_ids: list[int],
        embeddings: np.ndarray,
        metadata_list: list[dict],
        batch_size: int = 100,
    ):
        """
        Batch insert job embeddings into Milvus.
        """
        if not self.connected:
            raise RuntimeError("Milvus not connected")

        # Organize columns
        insert_data = [
            job_ids,
            embeddings.tolist(),
            [meta.get("experience_level", "") for meta in metadata_list],
            [meta.get("location", "") for meta in metadata_list]
        ]
        
        self.collection.insert(insert_data)
        self.collection.flush()
        print(f">>> Upserted {len(job_ids)} job embeddings into Milvus")

    def search_similar(
        self,
        query_vector: np.ndarray,
        top_k: int = 20,
        filters: dict | None = None,
    ) -> list[dict]:
        """
        Search for similar jobs in Milvus
        """
        if not self.connected:
            return []

        # Build Expression String
        expr = ""
        if filters:
            conds = []
            if filters.get("experience_level"):
                conds.append(f'experience_level == "{filters["experience_level"]}"')
            if filters.get("location"):
                conds.append(f'location == "{filters["location"]}"')
            expr = " and ".join(conds)

        search_params = {
            "metric_type": "COSINE",
            "params": {}
        }

        results = self.collection.search(
            data=[query_vector.tolist()],
            anns_field="embedding",
            param=search_params,
            limit=top_k,
            expr=expr if expr else None,
            output_fields=["experience_level", "location"]
        )

        matched_jobs = []
        for hits in results:
            for hit in hits:
                matched_jobs.append({
                    "job_id": hit.id,
                    "score": hit.distance, # COSINE distance
                    "experience_level": hit.entity.get("experience_level"),
                    "location": hit.entity.get("location"),
                })

        return matched_jobs

    def get_stats(self) -> dict:
        """Get collection statistics"""
        if not self.connected:
            return {"connected": False, "total_vectors": 0}

        return {
            "connected": True,
            "total_vectors": self.collection.num_entities,
            "dimension": DIMENSION,
        }
