import math
from typing import Dict, Any, Tuple, Optional

try:
    from ml.fusion_registry import get_multimodal_fusion_registry
except ImportError:
    from backend.ml.fusion_registry import get_multimodal_fusion_registry


class ReliabilityGatedFusion:
    """
    Multimodal Fusion Engine for Truth Guard.
    Supports both:
    1. Trainable Multimodal Logistic Regression Fusion (when trained artifact & image exist)
    2. Reliability-Gated Baseline Fusion (alpha-gated fallback baseline)
    """
    def __init__(self):
        # Weights Wg for text signal reliability vs visual signal reliability
        self.w_text = 1.2
        self.w_visual = 0.8
        self.bias_g = 0.1
        self.fusion_registry = get_multimodal_fusion_registry()

    def sigmoid(self, x: float) -> float:
        return 1.0 / (1.0 + math.exp(-x))

    def fuse(
        self, 
        text_signal: Dict[str, Any], 
        visual_signal: Optional[Dict[str, Any]] = None, 
        video_signal: Optional[Dict[str, Any]] = None
    ) -> Tuple[float, float, float, str]:
        """
        Calculates final combined prediction (fake score), confidence score, gate alpha, and fusion method name.
        Returns: (final_fake_score, confidence, alpha, fusion_method)
        """
        ht = text_signal.get("fake_score", 0.5)

        # 1. Text Only Case
        if (not visual_signal or not visual_signal.get("available")) and (not video_signal or not video_signal.get("available")):
            alpha = 1.0
            final_fake_score = ht
            confidence = abs(final_fake_score - 0.5) * 2.0  # Scale to [0, 1]
            return final_fake_score, confidence, alpha, "text_only_baseline"

        # 2. Text + Visual (Image) Case
        if visual_signal and visual_signal.get("available"):
            sim = visual_signal.get("image_text_similarity")
            align_sig = visual_signal.get("alignment_signal")

            # Try Trainable Multimodal Fusion first if artifact exists
            if self.fusion_registry.is_ready() and sim is not None and align_sig is not None:
                try:
                    multi_fake_prob, _ = self.fusion_registry.predict_fusion(ht, sim, align_sig)
                    alpha = 0.50 # Equal weight balanced multimodal feature output
                    confidence = abs(multi_fake_prob - 0.5) * 2.0
                    return multi_fake_prob, confidence, alpha, "trainable_logistic_regression"
                except Exception:
                    pass

            # Fallback to Reliability-Gated Baseline Fusion
            hv = visual_signal.get("fake_score", 0.5)
            gate_input = (self.w_text * (1.0 - abs(ht - 0.5))) - (self.w_visual * (1.0 - abs(hv - 0.5))) + self.bias_g
            alpha = self.sigmoid(gate_input)
            
            final_fake_score = alpha * ht + (1.0 - alpha) * hv
            confidence = abs(final_fake_score - 0.5) * 2.0
            return final_fake_score, confidence, alpha, "reliability_gated_baseline"

        # 3. Text + Video Case Baseline
        if video_signal and video_signal.get("available"):
            hv = video_signal.get("fake_score", 0.5)
            gate_input = (self.w_text * (1.0 - abs(ht - 0.5))) - (self.w_visual * (1.0 - abs(hv - 0.5))) + self.bias_g
            alpha = self.sigmoid(gate_input)
            
            final_fake_score = alpha * ht + (1.0 - alpha) * hv
            confidence = abs(final_fake_score - 0.5) * 2.0
            return final_fake_score, confidence, alpha, "reliability_gated_baseline"

        return ht, abs(ht - 0.5) * 2.0, 1.0, "reliability_gated_baseline"
