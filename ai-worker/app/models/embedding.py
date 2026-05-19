# ═══════════════════════════════════════════════════
# SBERT Embedding Model — Singleton Wrapper
#
# Loads the sentence-transformers model once on startup
# and provides encode methods for CV/Job text.
#
# Model: paraphrase-multilingual-MiniLM-L12-v2
# - Supports Vietnamese + English (multilingual)
# - Output dimension: 384
# - Good balance of speed and accuracy
# ═══════════════════════════════════════════════════
from sentence_transformers import SentenceTransformer
import numpy as np


class EmbeddingModel:
    """Singleton wrapper for the SBERT model"""

    def __init__(self, model_name: str = 'paraphrase-multilingual-MiniLM-L12-v2'):
        print(f">>> Loading SBERT model: {model_name}")
        self.model = SentenceTransformer(model_name)
        self.dimension = 384  # Output dimension of MiniLM-L12
        print(f">>> SBERT model loaded successfully (dim={self.dimension})")

    def encode(self, texts: list[str]) -> np.ndarray:
        """
        Encode a list of texts into embedding vectors.
        
        Args:
            texts: List of text strings to encode
            
        Returns:
            numpy array of shape (len(texts), 384)
            Vectors are L2-normalized for cosine similarity
        """
        return self.model.encode(
            texts,
            show_progress_bar=False,
            normalize_embeddings=True,  # L2 normalize → cosine sim = dot product
            batch_size=32,
        )

    def encode_single(self, text: str) -> np.ndarray:
        """Encode a single text string"""
        return self.encode([text])[0]

    def encode_batch(self, texts: list[str], batch_size: int = 64) -> np.ndarray:
        """Encode large batches with progress bar"""
        return self.model.encode(
            texts,
            show_progress_bar=True,
            normalize_embeddings=True,
            batch_size=batch_size,
        )
