from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class DetectionRequest(BaseModel):
    headline: str = Field(..., min_length=3, description="Headline of the news item")
    body: Optional[str] = Field(None, description="Body content of the news article")

class TextSignal(BaseModel):
    consistency_score: float
    sentiment_score: float
    suspicious_patterns: List[str]
    coherence_score: float
    detail: str

class VisualSignal(BaseModel):
    visual_consistency_score: float
    generic_media_flag: bool
    text_image_mismatch_score: float
    extracted_features_summary: str
    detail: str

class VideoSignal(BaseModel):
    sampled_frames_count: int
    frame_level_consistency: float
    anomaly_detected: bool
    aggregated_score: float
    detail: str

class DetectionResponse(BaseModel):
    id: int
    headline: str
    body: Optional[str] = None
    prediction: str # "REAL" or "FAKE"
    confidence: float # 0.0 to 1.0
    modalities_used: List[str]
    
    text_signal: Optional[Dict[str, Any]] = None
    visual_signal: Optional[Dict[str, Any]] = None
    video_signal: Optional[Dict[str, Any]] = None
    fusion_gate_alpha: Optional[float] = None
    fusion_method: Optional[str] = "reliability_gated_baseline"
    
    explanation: str
    processing_time_ms: float
    created_at: datetime

    class Config:
        from_attributes = True
