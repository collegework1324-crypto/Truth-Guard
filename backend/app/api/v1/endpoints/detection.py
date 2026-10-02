import os
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import get_db
from app.engine.pipeline import pipeline_instance
from app.models.analysis import DetectionAnalysis
from app.schemas.detection import DetectionResponse

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"}

@router.post("/analyze", response_model=DetectionResponse, status_code=status.HTTP_200_OK)
async def analyze_multimodal(
    headline: str = Form(...),
    body: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    video: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db)
):
    if not headline or len(headline.strip()) < 3:
        raise HTTPException(status_code=400, detail="Headline must be at least 3 characters long")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    saved_image_path = None
    saved_video_path = None

    # Handle Image Upload Validation & Storage
    if image and image.filename:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(status_code=400, detail=f"Unsupported image file type: {image.content_type}")
        ext = os.path.splitext(image.filename)[1]
        unique_name = f"img_{uuid.uuid4().hex}{ext}"
        saved_image_path = os.path.join(settings.UPLOAD_DIR, unique_name)
        content = await image.read()
        with open(saved_image_path, "wb") as f:
            f.write(content)

    # Handle Video Upload Validation & Storage
    if video and video.filename:
        if video.content_type not in ALLOWED_VIDEO_TYPES:
            raise HTTPException(status_code=400, detail=f"Unsupported video file type: {video.content_type}")
        ext = os.path.splitext(video.filename)[1]
        unique_name = f"vid_{uuid.uuid4().hex}{ext}"
        saved_video_path = os.path.join(settings.UPLOAD_DIR, unique_name)
        content = await video.read()
        with open(saved_video_path, "wb") as f:
            f.write(content)

    # Run Detection Engine Pipeline
    result = pipeline_instance.run(
        headline=headline,
        body=body,
        image_path=saved_image_path,
        video_path=saved_video_path
    )

    # Save to Database History
    db_analysis = DetectionAnalysis(
        user_id=None,
        headline=headline,
        body=body,
        image_path=saved_image_path,
        video_path=saved_video_path,
        modalities_used=result["modalities_used"],
        prediction=result["prediction"],
        confidence=result["confidence"],
        text_signal=result["text_signal"],
        visual_signal=result["visual_signal"],
        video_signal=result["video_signal"],
        fusion_gate_alpha=result["fusion_gate_alpha"],
        fusion_method=result.get("fusion_method", "reliability_gated_baseline"),
        explanation=result["explanation"],
        processing_time_ms=result["processing_time_ms"]
    )
    
    db.add(db_analysis)
    db.commit()
    db.refresh(db_analysis)

    return db_analysis
