from datetime import datetime, timezone
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.core.config import settings
from app.core.database import get_db
from app.schemas.health import HealthResponse

try:
    from ml.model_registry import get_text_model_registry
    from ml.vision_language import get_vision_language_registry
    from ml.fusion_registry import get_multimodal_fusion_registry
except ImportError:
    from backend.ml.model_registry import get_text_model_registry
    from backend.ml.vision_language import get_vision_language_registry
    from backend.ml.fusion_registry import get_multimodal_fusion_registry

router = APIRouter()

@router.get("/health", response_model=HealthResponse, status_code=status.HTTP_200_OK)
def check_health(db: Session = Depends(get_db)):
    """
    Real health check endpoint.
    Verifies database connectivity, ML text model status, CLIP vision-language status,
    multimodal fusion status, detection engine readiness, environment, and server timestamp.
    """
    db_connected = False
    db_engine_name = "unknown"
    
    try:
        result = db.execute(text("SELECT 1")).scalar()
        if result == 1:
            db_connected = True
            db_engine_name = db.bind.dialect.name
    except Exception as e:
        db_connected = False

    text_model_info = get_text_model_registry().get_status()
    image_model_info = get_vision_language_registry().get_status()
    fusion_model_info = get_multimodal_fusion_registry().get_status()

    is_healthy = db_connected and text_model_info.get("status") == "ready"

    return HealthResponse(
        status="healthy" if is_healthy else "degraded",
        project=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc).isoformat(),
        database={
            "connected": db_connected,
            "engine": db_engine_name
        },
        detection_engine={
            "status": "ready" if text_model_info.get("status") == "ready" else "degraded",
            "text_model": text_model_info,
            "image_model": image_model_info,
            "multimodal_fusion_model": fusion_model_info,
            "nlp_branch": "active",
            "cv_branch": "active",
            "video_branch": "active",
            "gated_fusion": "active"
        }
    )
