"""
Multimodal Fusion Model Registry for Truth Guard.
Loads saved trained Logistic Regression multimodal fusion model artifacts if present.
Exposes readiness check and fallback handling.
"""

import os
import json
import joblib
import numpy as np
import logging
from typing import Dict, Any, Tuple, Optional

logger = logging.getLogger("truth_guard.ml.fusion")

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
FUSION_MODEL_PATH = os.path.join(ARTIFACTS_DIR, "multimodal_fusion_model.joblib")
FUSION_METADATA_PATH = os.path.join(ARTIFACTS_DIR, "multimodal_fusion_metadata.json")


class MultimodalFusionRegistry:
    _instance: Optional['MultimodalFusionRegistry'] = None

    def __init__(self):
        self.model = None
        self.metadata = None
        self.is_loaded = False
        self.load_error = None
        self.load_artifacts()

    @classmethod
    def get_instance(cls) -> 'MultimodalFusionRegistry':
        if cls._instance is None:
            cls._instance = MultimodalFusionRegistry()
        return cls._instance

    def load_artifacts(self) -> bool:
        """
        Loads pre-trained multimodal fusion model if joblib artifact exists
        AND metadata explicitly declares 'is_production_ready': true.
        """
        if not os.path.exists(FUSION_MODEL_PATH):
            self.model = None
            self.metadata = None
            self.is_loaded = False
            self.load_error = "Trainable fusion model artifact missing. Paired multimodal dataset required for empirical training."
            logger.info(f"[FusionRegistry] {self.load_error}")
            return False

        try:
            self.metadata = None
            if os.path.exists(FUSION_METADATA_PATH):
                with open(FUSION_METADATA_PATH, "r") as f:
                    self.metadata = json.load(f)

            # Strict production-readiness check: metadata MUST explicitly contain "is_production_ready": true
            is_prod_ready = isinstance(self.metadata, dict) and self.metadata.get("is_production_ready") is True
            if not is_prod_ready:
                self.model = None
                self.is_loaded = False
                self.load_error = (
                    "Multimodal fusion artifact is not marked production-ready ('is_production_ready': true). "
                    "Paired research dataset required for empirical training. Falling back to reliability-gated baseline."
                )
                logger.info(f"[FusionRegistry] {self.load_error}")
                return False

            self.model = joblib.load(FUSION_MODEL_PATH)
            self.is_loaded = True
            self.load_error = None
            logger.info("[FusionRegistry] Production-ready Trainable Multimodal Fusion model successfully loaded.")
            return True
        except Exception as e:
            self.model = None
            self.is_loaded = False
            self.load_error = str(e)
            logger.error(f"[FusionRegistry] Failed to load fusion model: {e}")
            return False

    def is_ready(self) -> bool:
        is_prod_ready = isinstance(self.metadata, dict) and self.metadata.get("is_production_ready") is True
        return self.is_loaded and self.model is not None and is_prod_ready

    def get_status(self) -> Dict[str, Any]:
        """
        Returns status metadata for health check endpoint.
        """
        return {
            "status": "ready" if self.is_ready() else "not_ready",
            "model_type": "Logistic Regression (Trainable Multimodal Fusion)",
            "artifact_availability": self.is_ready(),
            "fusion_method": "trainable_logistic_regression" if self.is_ready() else "reliability_gated_baseline",
            "error": self.load_error
        }

    def predict_fusion(self, p_fake_text: float, image_text_sim: float, alignment_sig: float) -> Tuple[float, float]:
        """
        Runs inference on feature vector X = [p_fake_text, image_text_sim, alignment_sig].
        Returns tuple: (multimodal_fake_prob, multimodal_real_prob)
        """
        if not self.is_ready():
            raise RuntimeError("Multimodal Fusion model is not loaded or ready.")

        X = np.array([[p_fake_text, image_text_sim, alignment_sig]])
        probs = self.model.predict_proba(X)[0]
        
        real_prob = float(probs[0])
        fake_prob = float(probs[1])
        
        return fake_prob, real_prob


def get_multimodal_fusion_registry() -> MultimodalFusionRegistry:
    return MultimodalFusionRegistry.get_instance()
