from pydantic import BaseModel, Field
from typing import Dict, Any

class HealthResponse(BaseModel):
    status: str = Field(..., example="healthy")
    project: str = Field(..., example="Truth Guard")
    version: str = Field(..., example="1.0.0")
    environment: str = Field(..., example="development")
    timestamp: str = Field(..., example="2026-10-02T13:45:00Z")
    database: Dict[str, Any] = Field(..., example={"connected": True, "engine": "sqlite"})
    detection_engine: Dict[str, Any] = Field(..., example={"status": "ready", "nlp_model": "active", "cv_model": "active"})

class SystemMetrics(BaseModel):
    total_analyses: int
    real_count: int
    fake_count: int
    feedback_count: int
