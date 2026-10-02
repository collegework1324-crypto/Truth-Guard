import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router
import app.models # Ensure models are loaded before table creation

# Create database tables automatically
Base.metadata.create_all(bind=engine)

# Ensure uploads directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Multimodal Fake News Detection System Using Reliability-Gated Fusion and NLP",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount upload static files directory
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Mount API V1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API Engine",
        "docs_url": f"{settings.API_V1_STR}/docs",
        "health_check": f"{settings.API_V1_STR}/health"
    }
