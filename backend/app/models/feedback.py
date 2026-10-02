import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("detection_analyses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    rating = Column(Integer, nullable=False) # 1-5 or thumbs up/down
    user_label = Column(String(20), nullable=True) # REAL / FAKE ground truth provided by user
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    analysis = relationship("DetectionAnalysis", back_populates="feedbacks")
    user = relationship("User", back_populates="feedbacks")
