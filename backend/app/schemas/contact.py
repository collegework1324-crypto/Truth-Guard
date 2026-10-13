from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class ContactCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    email: EmailStr
    subject: Optional[str] = Field(None, max_length=300)
    message: str = Field(..., min_length=5, max_length=5000)

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    created_at: datetime

    class Config:
        from_attributes = True
