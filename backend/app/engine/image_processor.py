import os
import time
from typing import Dict, Any, Optional
from PIL import Image

try:
    from ml.vision_language import get_vision_language_registry
except ImportError:
    from backend.ml.vision_language import get_vision_language_registry


class ImageProcessor:
    """
    Computer Vision & Vision-Language Analysis Engine for Truth Guard.
    Processes image files, analyzing visual metadata integrity and computing 
    pretrained CLIP vision-language semantic alignment against input claims.
    """
    def __init__(self):
        self.vl_registry = get_vision_language_registry()

    def analyze(self, image_path: str, text: Optional[str] = None) -> Dict[str, Any]:
        """
        Analyze uploaded image and compute semantic alignment with news claim text.
        """
        start_time = time.time()
        
        if not image_path or not os.path.exists(image_path):
            return {
                "available": False,
                "error": "Image file not found or not provided",
                "fake_score": 0.5,
                "real_score": 0.5
            }

        # 1. Validate image format & integrity using PIL
        try:
            with Image.open(image_path) as raw_img:
                raw_img.verify()
                
            with Image.open(image_path) as img:
                width, height = img.size
                format_type = img.format
                mode = img.mode

                exif_data = img._getexif() if hasattr(img, "_getexif") else None
                has_exif = exif_data is not None and len(exif_data) > 0
                is_low_res = (width * height) < (300 * 300)
        except Exception as e:
            return {
                "available": False,
                "error": f"Invalid or corrupted image: {str(e)}",
                "fake_score": 0.5,
                "real_score": 0.5
            }

        # 2. Compute Pretrained CLIP Vision-Language Semantic Alignment
        claim_text = text.strip() if text else "news photograph"
        vl_result = self.vl_registry.compute_alignment(image_path, claim_text)
        
        processing_time_ms = round((time.time() - start_time) * 1000, 2)

        if vl_result.get("available"):
            raw_cosine_sim = vl_result.get("image_text_similarity", 0.0)
            alignment_sig = vl_result.get("alignment_signal", 0.0)
            visual_fake_score = vl_result.get("fake_score", 0.5)
            visual_real_score = vl_result.get("real_score", 0.5)

            detail_text = (
                f"CLIP Model ({vl_result.get('model')}). "
                f"Cosine Similarity: {raw_cosine_sim:.4f}, Alignment Signal: {alignment_sig:.4f}. "
                f"Resolution: {width}x{height}, EXIF Present: {has_exif}. "
                f"{vl_result.get('detail')}"
            )

            return {
                "available": True,
                "model": vl_result.get("model", "openai/clip-vit-base-patch32"),
                "image_text_similarity": raw_cosine_sim,
                "alignment_signal": alignment_sig,
                "fake_score": visual_fake_score,
                "real_score": visual_real_score,
                "width": width,
                "height": height,
                "resolution": f"{width}x{height}",
                "format": format_type,
                "has_exif_metadata": has_exif,
                "is_low_res": is_low_res,
                "representation": [raw_cosine_sim, alignment_sig, float(width), float(height)],
                "detail": detail_text,
                "processing_time_ms": processing_time_ms
            }
        else:
            # Fallback to heuristic metadata check if CLIP model failed
            manipulation_score = 0.1
            if is_low_res:
                manipulation_score += 0.2
            if not has_exif:
                manipulation_score += 0.15
            visual_fake_score = min(max(manipulation_score, 0.05), 0.95)

            return {
                "available": True,
                "model": "Metadata Heuristic Fallback",
                "image_text_similarity": None,
                "alignment_signal": None,
                "fake_score": round(visual_fake_score, 4),
                "real_score": round(1.0 - visual_fake_score, 4),
                "width": width,
                "height": height,
                "resolution": f"{width}x{height}",
                "format": format_type,
                "has_exif_metadata": has_exif,
                "is_low_res": is_low_res,
                "representation": [0.0, 0.0, float(width), float(height)],
                "detail": f"CLIP unavailable ({vl_result.get('error')}). Resolution: {width}x{height}. EXIF: {has_exif}.",
                "processing_time_ms": processing_time_ms
            }
