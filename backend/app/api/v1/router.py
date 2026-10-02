from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, detection, history, feedback, admin

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(detection.router, prefix="/detection", tags=["Detection Engine"])
api_router.include_router(history.router, prefix="/history", tags=["Analysis History"])
api_router.include_router(feedback.router, prefix="/feedback", tags=["Feedback"])
api_router.include_router(admin.router, prefix="/admin", tags=["Admin & Metrics"])
