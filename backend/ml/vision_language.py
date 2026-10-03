"""
Vision-Language Semantic Alignment Service for Truth Guard.
Uses pretrained OpenAI CLIP (clip-vit-base-patch32) to compute multi-modal 
image-text embedding cosine similarity and visual semantic evidence signals.
"""

import os
import time
import logging
import numpy as np
from PIL import Image
from typing import Dict, Any, Tuple, Optional

logger = logging.getLogger("truth_guard.ml.vision_language")

MODEL_ID = "openai/clip-vit-base-patch32"


class VisionLanguageRegistry:
    _instance: Optional['VisionLanguageRegistry'] = None

    def __init__(self):
        self.model = None
        self.processor = None
        self.is_loaded = False
        self.load_error = None
        self.model_name = MODEL_ID
        self.load_time_seconds = None

    @classmethod
    def get_instance(cls) -> 'VisionLanguageRegistry':
        if cls._instance is None:
            cls._instance = VisionLanguageRegistry()
        return cls._instance

    def load_artifacts(self) -> bool:
        """
        Loads pretrained CLIP model and processor lazily.
        """
        if self.is_loaded and self.model is not None:
            return True

        start_time = time.time()
        try:
            logger.info(f"[VisionLanguage] Loading pretrained CLIP model: {MODEL_ID}...")
            from transformers import CLIPProcessor, CLIPModel
            self.processor = CLIPProcessor.from_pretrained(MODEL_ID)
            self.model = CLIPModel.from_pretrained(MODEL_ID)
            self.model.eval()  # Set evaluation mode
            
            self.load_time_seconds = round(time.time() - start_time, 4)
            self.is_loaded = True
            self.load_error = None
            logger.info(f"[VisionLanguage] CLIP model successfully loaded in {self.load_time_seconds}s.")
            return True
        except Exception as e:
            self.is_loaded = False
            self.load_error = str(e)
            logger.error(f"[VisionLanguage] Failed to load CLIP model: {e}")
            return False

    def is_ready(self) -> bool:
        """
        Non-blocking readiness check.
        Returns True ONLY if CLIP model and processor are already loaded into memory.
        Does NOT trigger heavy artifact loading or network downloads.
        """
        return self.is_loaded and self.model is not None and self.processor is not None

    def get_status(self) -> Dict[str, Any]:
        """
        Returns readiness status for health check endpoint without triggering model loading.
        """
        return {
            "status": "ready" if self.is_ready() else "not_ready",
            "model_type": f"Pretrained CLIP ({MODEL_ID})",
            "artifact_availability": self.is_ready(),
            "load_time_seconds": self.load_time_seconds,
            "error": self.load_error
        }

    def compute_alignment(self, image_path: str, text: str) -> Dict[str, Any]:
        """
        Calculates exact L2-normalized Cosine Similarity between image & claim text embeddings.
        Returns visual signal dictionary.
        Loads CLIP model lazily on first access if not already loaded.
        """
        start_time = time.time()
        
        if not self.is_ready():
            self.load_artifacts()

        if not self.is_ready():
            return {
                "available": False,
                "error": f"Vision-Language model unavailable: {self.load_error}",
                "fake_score": 0.5,
                "real_score": 0.5
            }

        if not os.path.exists(image_path):
            return {
                "available": False,
                "error": f"Image file not found: {image_path}",
                "fake_score": 0.5,
                "real_score": 0.5
            }

        try:
            # 1. Safely load image
            with Image.open(image_path) as raw_img:
                raw_img.verify()
            
            with Image.open(image_path) as img:
                img = img.convert("RGB")
                width, height = img.size

                # 2. Preprocess text and image for CLIP
                # Truncate long text to CLIP max token limit (~77 tokens)
                clean_claim = text.strip()[:300] if text else "news photograph"
                
                inputs = self.processor(
                    text=[clean_claim],
                    images=img,
                    return_tensors="pt",
                    padding=True,
                    truncation=True
                )

                # 3. Extract normalized vision and text embeddings
                import torch
                with torch.no_grad():
                    img_out = self.model.get_image_features(pixel_values=inputs["pixel_values"])
                    txt_out = self.model.get_text_features(input_ids=inputs["input_ids"], attention_mask=inputs.get("attention_mask"))

                    image_features = getattr(img_out, "pooler_output", getattr(img_out, "image_embeds", img_out))
                    text_features = getattr(txt_out, "pooler_output", getattr(txt_out, "text_embeds", txt_out))

                    if not isinstance(image_features, torch.Tensor):
                        image_features = img_out[0]
                    if not isinstance(text_features, torch.Tensor):
                        text_features = txt_out[0]

                    # L2 Normalization
                    image_features = image_features / image_features.norm(dim=-1, keepdim=True)
                    text_features = text_features / text_features.norm(dim=-1, keepdim=True)
                    text_features = text_features / text_features.norm(dim=-1, keepdim=True)

                    # Exact Cosine Similarity (dot product of L2 normalized vectors)
                    raw_cosine_sim = float(torch.matmul(text_features, image_features.T)[0, 0].item())

                # 4. Compute transparent alignment signal
                # CLIP raw cosine similarities for random image-text pairs usually fall between [0.10, 0.20],
                # while well-aligned pairs score >= 0.25.
                # Formula: alignment_signal = clamp((raw_sim - 0.12) / (0.28 - 0.12), 0.0, 1.0)
                baseline_min = 0.12
                baseline_max = 0.28
                alignment_signal = float(np.clip((raw_cosine_sim - baseline_min) / (baseline_max - baseline_min), 0.0, 1.0))

                # 5. Visual fake likelihood score derived from semantic alignment evidence
                # High alignment -> image is consistent with claim -> lower visual discrepancy score
                # Low alignment -> image is contextually unrelated -> higher visual discrepancy score
                visual_fake_score = float(np.clip(1.0 - (alignment_signal * 0.7 + 0.15), 0.05, 0.95))
                visual_real_score = 1.0 - visual_fake_score

                inference_time_ms = round((time.time() - start_time) * 1000, 2)

                explanation = (
                    f"Strong visual-text semantic alignment detected ({alignment_signal:.2f}). "
                    f"The supplied image is semantically consistent with the news claim."
                    if alignment_signal >= 0.50 else
                    f"Weak visual-text semantic alignment detected ({alignment_signal:.2f}). "
                    f"The supplied image has weak semantic alignment with the supplied claim text."
                )

                return {
                    "available": True,
                    "model": MODEL_ID,
                    "embedding_dimension": image_features.shape[-1],
                    "image_text_similarity": round(raw_cosine_sim, 4),
                    "alignment_signal": round(alignment_signal, 4),
                    "fake_score": round(visual_fake_score, 4),
                    "real_score": round(visual_real_score, 4),
                    "width": width,
                    "height": height,
                    "representation": [round(raw_cosine_sim, 4), round(alignment_signal, 4), width, height],
                    "detail": explanation,
                    "processing_time_ms": inference_time_ms
                }
        except Exception as e:
            logger.warning(f"[VisionLanguage] Image processing failed for {image_path}: {e}")
            return {
                "available": False,
                "error": f"Invalid or corrupted image: {str(e)}",
                "fake_score": 0.5,
                "real_score": 0.5
            }


def get_vision_language_registry() -> VisionLanguageRegistry:
    return VisionLanguageRegistry.get_instance()
