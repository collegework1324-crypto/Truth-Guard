import datetime
from sqlalchemy import Column, Integer, String, Text, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class DetectionAnalysis(Base):
    __tablename__ = "detection_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Inputs
    headline = Column(String(500), nullable=False)
    body = Column(Text, nullable=True)
    image_path = Column(String(500), nullable=True)
    video_path = Column(String(500), nullable=True)
    modalities_used = Column(JSON, nullable=False) # e.g. ["text", "image"]

    # Results
    prediction = Column(String(20), nullable=False) # REAL / FAKE
    confidence = Column(Float, nullable=False) # 0.0 - 1.0
    
    # Modality Signal Details
    text_signal = Column(JSON, nullable=True)
    visual_signal = Column(JSON, nullable=True)
    video_signal = Column(JSON, nullable=True)
    fusion_gate_alpha = Column(Float, nullable=True)
    fusion_method = Column(String(50), nullable=True, default="reliability_gated_baseline")

    # Explanation & Research Metadata
    explanation = Column(Text, nullable=False)
    processing_time_ms = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="analyses")
    feedbacks = relationship("Feedback", back_populates="analysis", cascade="all, delete-orphan")
