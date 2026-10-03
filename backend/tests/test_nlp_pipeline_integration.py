"""
Integration test script for Truth Guard Task 3A NLP Machine Learning Pipeline.
Verifies FastAPI app startup, Health endpoint, Detection endpoint with 3 distinct news examples,
direct vs API inference consistency, Database persistence, and History endpoint.
"""

import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is on Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
try:
    from ml.model_registry import get_text_model_registry
except ImportError:
    from backend.ml.model_registry import get_text_model_registry

client = TestClient(app)


def test_01_model_registry_status():
    registry = get_text_model_registry()
    assert registry.is_ready() == True
    status = registry.get_status()
    assert status["status"] == "ready"
    assert status["artifact_availability"] == True
    assert status["model_type"] == "TF-IDF + Logistic Regression"


def test_02_health_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"]["connected"] == True
    assert data["detection_engine"]["status"] == "ready"
    assert data["detection_engine"]["text_model"]["status"] == "ready"
    assert data["detection_engine"]["text_model"]["artifact_availability"] == True


def test_03_detection_analyze_three_examples():
    # Example 1: Sensationalist Fake News Headline & Body
    ex1_headline = "BREAKING: Secret Alien Technology Discovered in Ocean Trench Proves Earth is Hollow"
    ex1_body = "Shocking new footage leaked by anonymous whistleblowers proves government conspiracy to hide miracle ocean energy."
    
    resp1 = client.post("/api/v1/detection/analyze", data={"headline": ex1_headline, "body": ex1_body})
    assert resp1.status_code == 200
    data1 = resp1.json()
    assert data1["prediction"] in ["FAKE", "REAL"]
    assert "text_signal" in data1
    assert data1["text_signal"]["is_ml_used"] == True
    assert data1["text_signal"]["model_type"] == "TF-IDF + Logistic Regression"
    assert "model_probability" in data1["text_signal"]
    
    # Direct model verification comparison
    direct_fake_prob, _ = get_text_model_registry().predict(f"{ex1_headline} {ex1_body}")
    assert round(direct_fake_prob, 4) == data1["text_signal"]["model_probability"]
    
    # Example 2: Real News Article (from dataset real articles)
    ex2_headline = "Daniel Radcliffe Rights Himself After Harry Potter"
    ex2_body = "Daniel Radcliffe is a good actor who starred in Harry Potter and has moved on to theater and film roles in London."
    
    resp2 = client.post("/api/v1/detection/analyze", data={"headline": ex2_headline, "body": ex2_body})
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["prediction"] in ["REAL", "FAKE"]
    assert data2["text_signal"]["is_ml_used"] == True

    # Example 3: Sensationalist Clickbait Claim
    ex3_headline = "Miracle Cure Found! Doctors Expose Hidden Secret to End All Aging Instantly"
    ex3_body = "Big pharma does not want you to know about this mindblowing banned miracle remedy that guarantees instant youth."
    
    resp3 = client.post("/api/v1/detection/analyze", data={"headline": ex3_headline, "body": ex3_body})
    assert resp3.status_code == 200
    data3 = resp3.json()
    assert data3["text_signal"]["is_ml_used"] == True
    assert "model_probability" in data3["text_signal"]


def test_04_history_endpoint_persistence():
    response = client.get("/api/v1/history/")
    assert response.status_code == 200
    history = response.json()
    assert len(history) >= 1
    first_item = history[0]
    assert "text_signal" in first_item
    assert "prediction" in first_item


def test_05_lightweight_health_check_no_clip_loading():
    import time
    try:
        from ml.vision_language import VisionLanguageRegistry
    except ImportError:
        from backend.ml.vision_language import VisionLanguageRegistry
    
    # Create fresh registry without calling load_artifacts()
    fresh_vl = VisionLanguageRegistry()
    assert fresh_vl.is_loaded is False
    
    # Verify get_status() completes instantly without loading model weights
    t0 = time.time()
    status_dict = fresh_vl.get_status()
    elapsed_ms = (time.time() - t0) * 1000.0
    
    assert status_dict["status"] == "not_ready"
    assert status_dict["artifact_availability"] is False
    assert fresh_vl.is_loaded is False
    assert elapsed_ms < 100.0  # Must complete instantly (< 100ms)


if __name__ == "__main__":
    pytest.main(["-v", __file__])
