"""
Model Registry & Inference Manager for Truth Guard NLP Model.
Loads saved TF-IDF vectorizer and Logistic Regression artifacts for production inference.
Exposes model readiness, lazy loading, and inference methods without retraining.
"""

import os
import json
import joblib
import logging
from typing import Dict, Any, Tuple, Optional

logger = logging.getLogger("truth_guard.ml")

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
VECTORIZER_PATH = os.path.join(ARTIFACTS_DIR, "text_tfidf_vectorizer.joblib")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "text_fake_news_model.joblib")
METADATA_PATH = os.path.join(ARTIFACTS_DIR, "text_model_metadata.json")
METRICS_PATH = os.path.join(ARTIFACTS_DIR, "text_model_metrics.json")


class TextModelRegistry:
    _instance: Optional['TextModelRegistry'] = None

    def __init__(self):
        self.vectorizer = None
        self.model = None
        self.metadata = None
        self.metrics = None
        self.is_loaded = False
        self.load_error = None
        self.load_artifacts()

    @classmethod
    def get_instance(cls) -> 'TextModelRegistry':
        if cls._instance is None:
            cls._instance = TextModelRegistry()
        return cls._instance

    def load_artifacts(self) -> bool:
        """
        Loads saved joblib artifacts and metadata JSON if present.
        """
        if not os.path.exists(VECTORIZER_PATH) or not os.path.exists(MODEL_PATH):
            self.is_loaded = False
            self.load_error = "Model artifact files missing. Training required."
            logger.warning(f"[ModelRegistry] {self.load_error}")
            return False

        try:
            self.vectorizer = joblib.load(VECTORIZER_PATH)
            self.model = joblib.load(MODEL_PATH)
            
            if os.path.exists(METADATA_PATH):
                with open(METADATA_PATH, "r") as f:
                    self.metadata = json.load(f)
                    
            if os.path.exists(METRICS_PATH):
                with open(METRICS_PATH, "r") as f:
                    self.metrics = json.load(f)

            self.is_loaded = True
            self.load_error = None
            logger.info("[ModelRegistry] Text ML model artifacts successfully loaded.")
            return True
        except Exception as e:
            self.is_loaded = False
            self.load_error = str(e)
            logger.error(f"[ModelRegistry] Failed to load model artifacts: {e}")
            return False

    def is_ready(self) -> bool:
        return self.is_loaded and self.vectorizer is not None and self.model is not None

    def get_status(self) -> Dict[str, Any]:
        """
        Returns status metadata for health check endpoint.
        """
        return {
            "status": "ready" if self.is_ready() else "not_ready",
            "model_type": self.metadata.get("model_type", "TF-IDF + Logistic Regression") if self.metadata else "TF-IDF + Logistic Regression",
            "artifact_availability": self.is_ready(),
            "version": self.metadata.get("version", "1.0") if self.metadata else "1.0",
            "error": self.load_error
        }

    def predict(self, text: str) -> Tuple[float, float]:
        """
        Runs inference on cleaned text.
        Returns tuple: (fake_probability, real_probability)
        """
        if not self.is_ready():
            raise RuntimeError("Text ML model is not loaded or ready.")

        # Transform single input text
        X_tfidf = self.vectorizer.transform([text])
        probabilities = self.model.predict_proba(X_tfidf)[0]
        
        real_prob = float(probabilities[0])
        fake_prob = float(probabilities[1])
        
        return fake_prob, real_prob


# Singleton convenience getter
def get_text_model_registry() -> TextModelRegistry:
    return TextModelRegistry.get_instance()
