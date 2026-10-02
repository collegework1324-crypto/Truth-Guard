from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.analysis import DetectionAnalysis
from app.models.feedback import Feedback
from app.models.user import User

router = APIRouter()

@router.get("/metrics")
def get_admin_metrics(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    total_analyses = db.query(DetectionAnalysis).count()
    real_count = db.query(DetectionAnalysis).filter(DetectionAnalysis.prediction == "REAL").count()
    fake_count = db.query(DetectionAnalysis).filter(DetectionAnalysis.prediction == "FAKE").count()
    total_feedback = db.query(Feedback).count()
    avg_processing_time = db.query(func.avg(DetectionAnalysis.processing_time_ms)).scalar() or 0.0

    return {
        "total_users": total_users,
        "total_analyses": total_analyses,
        "real_predictions": real_count,
        "fake_predictions": fake_count,
        "total_feedbacks": total_feedback,
        "avg_processing_time_ms": round(float(avg_processing_time), 2)
    }
