from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.analysis import DetectionAnalysis
from app.models.feedback import Feedback
from app.schemas.feedback import FeedbackCreate, FeedbackResponse

router = APIRouter()

@router.post("", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def submit_feedback(feedback_in: FeedbackCreate, db: Session = Depends(get_db)):
    analysis = db.query(DetectionAnalysis).filter(DetectionAnalysis.id == feedback_in.analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Associated analysis record not found")

    feedback = Feedback(
        analysis_id=feedback_in.analysis_id,
        user_id=None,
        rating=feedback_in.rating,
        user_label=feedback_in.user_label,
        comments=feedback_in.comments
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback
