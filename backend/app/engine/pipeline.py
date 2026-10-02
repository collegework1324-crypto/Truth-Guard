import time
from typing import Dict, Any, Optional
from app.engine.text_processor import TextProcessor
from app.engine.image_processor import ImageProcessor
from app.engine.video_processor import VideoProcessor
from app.engine.fusion import ReliabilityGatedFusion

class DetectionPipeline:
    """
    Multimodal Truth Guard Pipeline.
    Coordinates supervised NLP classification, CLIP vision-language semantic alignment,
    modality analysis, gated & trainable fusion, confidence scoring, and explanation generation.
    """
    def __init__(self):
        self.text_processor = TextProcessor()
        self.image_processor = ImageProcessor()
        self.video_processor = VideoProcessor()
        self.fusion_engine = ReliabilityGatedFusion()

    def run(
        self, 
        headline: str, 
        body: Optional[str] = None, 
        image_path: Optional[str] = None, 
        video_path: Optional[str] = None
    ) -> Dict[str, Any]:
        start_time = time.time()
        modalities_used = ["text"]
        full_claim = f"{headline} {body}" if body else headline

        # 1. Supervised NLP Text Modality Processing
        text_signal = self.text_processor.analyze(headline, body)

        # 2. Vision-Language Image Modality Processing
        visual_signal = None
        if image_path:
            visual_signal = self.image_processor.analyze(image_path, text=full_claim)
            if visual_signal.get("available"):
                modalities_used.append("image")

        # 3. Video Modality Processing Baseline
        video_signal = None
        if video_path:
            video_signal = self.video_processor.analyze(video_path)
            if video_signal.get("available"):
                modalities_used.append("video")

        # 4. Multimodal Fusion (Trainable or Reliability-Gated Baseline)
        fake_score, confidence, alpha, fusion_method = self.fusion_engine.fuse(text_signal, visual_signal, video_signal)

        # 5. Classification (REAL / FAKE)
        prediction = "FAKE" if fake_score >= 0.5 else "REAL"
        normalized_confidence = round(0.50 + (confidence * 0.49), 4)

        # 6. Explanation Generation with Vision-Language Semantic Safety
        explanation_parts = []
        
        # NLP Model Signal Details
        ml_prob = text_signal.get("model_probability")
        if ml_prob is not None:
            explanation_parts.append(f"Supervised NLP model P(Fake) is {round(ml_prob * 100, 1)}%.")

        # Vision-Language Alignment Details
        if visual_signal and visual_signal.get("available"):
            sim = visual_signal.get("image_text_similarity")
            align_sig = visual_signal.get("alignment_signal")
            if sim is not None and align_sig is not None:
                if align_sig >= 0.50:
                    explanation_parts.append(
                        f"Vision-Language analysis detected strong semantic consistency between the image and news claim "
                        f"(cosine similarity: {sim:.4f}, alignment signal: {align_sig:.4f})."
                    )
                else:
                    explanation_parts.append(
                        f"Vision-Language analysis detected weak semantic alignment between the image and news claim "
                        f"(cosine similarity: {sim:.4f}, alignment signal: {align_sig:.4f})."
                    )

        if prediction == "FAKE":
            explanation_parts.append(f"The item was classified as FAKE with {round(normalized_confidence * 100, 1)}% fused confidence ({fusion_method}).")
            if text_signal.get("suspicious_patterns"):
                patterns_str = ", ".join([f"'{p}'" for p in text_signal['suspicious_patterns']])
                explanation_parts.append(f"Sensationalist text patterns identified: {patterns_str}.")
        else:
            explanation_parts.append(f"The item was classified as REAL with {round(normalized_confidence * 100, 1)}% fused confidence ({fusion_method}).")

        explanation = " ".join(explanation_parts)
        processing_time_ms = round((time.time() - start_time) * 1000, 2)

        return {
            "prediction": prediction,
            "confidence": normalized_confidence,
            "modalities_used": modalities_used,
            "fusion_gate_alpha": round(alpha, 4),
            "fusion_method": fusion_method,
            "text_signal": text_signal,
            "visual_signal": visual_signal,
            "video_signal": video_signal,
            "explanation": explanation,
            "processing_time_ms": processing_time_ms
        }

# Global pipeline instance
pipeline_instance = DetectionPipeline()
