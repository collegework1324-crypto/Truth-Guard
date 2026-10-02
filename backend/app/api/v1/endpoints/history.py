from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.analysis import DetectionAnalysis
from app.schemas.detection import DetectionResponse

router = APIRouter()

@router.get("", response_model=List[DetectionResponse])
def get_history(
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    prediction: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(DetectionAnalysis)
    if prediction:
        query = query.filter(DetectionAnalysis.prediction == prediction.upper())
    
    analyses = query.order_by(DetectionAnalysis.created_at.desc()).offset(offset).limit(limit).all()
    return analyses

@router.get("/{analysis_id}", response_model=DetectionResponse)
def get_analysis_by_id(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(DetectionAnalysis).filter(DetectionAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis record not found")
    return analysis
