"""
Automated Test Suite for Task 3C-FIX Trainable Multimodal Fusion Production Safety.
Verifies that synthetic/non-research fusion artifacts do NOT activate production model inference,
and tests explicit is_production_ready controls (TEST A through TEST E).
"""

import os
import sys
import json
import tempfile
import pytest
import pandas as pd
from PIL import Image
from fastapi.testclient import TestClient

# Ensure backend root is on Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
try:
    from ml.fusion_registry import get_multimodal_fusion_registry, FUSION_METADATA_PATH
    from ml.train_fusion_model import train_multimodal_fusion
except ImportError:
    from backend.ml.fusion_registry import get_multimodal_fusion_registry, FUSION_METADATA_PATH
    from backend.ml.train_fusion_model import train_multimodal_fusion

client = TestClient(app)


@pytest.fixture(scope="module")
def test_image_file():
    temp_dir = tempfile.mkdtemp()
    img_path = os.path.join(temp_dir, "test_fusion_image.jpg")
    img = Image.new("RGB", (200, 200), color=(0, 128, 255))
    img.save(img_path)
    yield img_path


def test_A_existing_synthetic_artifact_not_ready():
    """TEST A: Existing synthetic fusion artifact does NOT make is_ready() true."""
    registry = get_multimodal_fusion_registry()
    registry.load_artifacts()
    assert registry.is_ready() is False
    assert registry.get_status()["status"] == "not_ready"
    assert registry.get_status()["fusion_method"] == "reliability_gated_baseline"


def test_B_missing_is_production_ready_flag():
    """TEST B: Missing is_production_ready -> is_ready() == False."""
    registry = get_multimodal_fusion_registry()
    
    # Save dummy metadata missing 'is_production_ready'
    dummy_meta = {"model_type": "Logistic Regression", "train_samples": 10}
    with open(FUSION_METADATA_PATH, "w") as f:
        json.dump(dummy_meta, f)
        
    registry.load_artifacts()
    assert registry.is_ready() is False
    assert registry.get_status()["status"] == "not_ready"


def test_C_false_is_production_ready_flag():
    """TEST C: is_production_ready = false -> is_ready() == False."""
    registry = get_multimodal_fusion_registry()
    
    dummy_meta = {"model_type": "Logistic Regression", "is_production_ready": False}
    with open(FUSION_METADATA_PATH, "w") as f:
        json.dump(dummy_meta, f)
        
    registry.load_artifacts()
    assert registry.is_ready() is False


def test_D_true_is_production_ready_flag():
    """TEST D: is_production_ready = true -> is_ready() can become True."""
    synthetic_df = pd.DataFrame({
        'p_fake_text': [0.85, 0.12, 0.90, 0.05, 0.75, 0.10, 0.88, 0.15, 0.82, 0.08],
        'image_text_similarity': [0.15, 0.28, 0.10, 0.26, 0.14, 0.27, 0.12, 0.29, 0.16, 0.25],
        'alignment_signal': [0.18, 0.85, 0.05, 0.92, 0.20, 0.88, 0.10, 0.95, 0.22, 0.82],
        'label': [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
    })
    
    # Train with explicit is_production_ready=True
    train_multimodal_fusion(synthetic_df, is_production_ready=True)
    registry = get_multimodal_fusion_registry()
    registry.load_artifacts()
    assert registry.is_ready() is True
    assert registry.get_status()["status"] == "ready"
    assert registry.get_status()["fusion_method"] == "trainable_logistic_regression"

    # Reset metadata back to is_production_ready=False to keep production safe
    train_multimodal_fusion(synthetic_df, is_production_ready=False)
    registry.load_artifacts()
    assert registry.is_ready() is False


def test_E_fallback_to_reliability_gated_baseline(test_image_file):
    """TEST E: When trainable fusion is unavailable/not production-ready, inference uses reliability_gated_baseline."""
    registry = get_multimodal_fusion_registry()
    registry.load_artifacts()
    assert registry.is_ready() is False

    with open(test_image_file, "rb") as f:
        response = client.post(
            "/api/v1/detection/analyze",
            data={"headline": "Scientists Discover Rare Marine Species in Deep Sea Trench"},
            files={"image": ("test.jpg", f, "image/jpeg")}
        )
    assert response.status_code == 200
    data = response.json()
    assert data["visual_signal"]["available"] is True
    assert data["fusion_method"] == "reliability_gated_baseline"
    assert "image_text_similarity" in data["visual_signal"]
    assert "alignment_signal" in data["visual_signal"]


if __name__ == "__main__":
    pytest.main(["-v", __file__])
