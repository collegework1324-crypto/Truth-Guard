from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class FeedbackCreate(BaseModel):
    analysis_id: int
    rating: int = Field(..., ge=1, le=5, description="1 to 5 star rating")
    user_label: Optional[str] = Field(None, description="REAL or FAKE")
    comments: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    analysis_id: int
    rating: int
    user_label: Optional[str] = None
    comments: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
