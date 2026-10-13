from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.contact import ContactSubmission
from app.schemas.contact import ContactCreate, ContactResponse

router = APIRouter()

@router.post("", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
def submit_contact(payload: ContactCreate, db: Session = Depends(get_db)):
    """
    Submits a research or general inquiry, storing it persistently in the database.
    """
    db_contact = ContactSubmission(
        name=payload.name.strip(),
        email=payload.email.strip(),
        subject=payload.subject.strip() if payload.subject else None,
        message=payload.message.strip()
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact
