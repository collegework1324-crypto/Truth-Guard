"""
Automated Multimodal Vision-Language Test Suite for Truth Guard (Task 3B).
Tests CLIP image-text semantic alignment, text-only processing, corrupted image handling,
very small image handling, and evaluates semantic influence on fused output.
"""

import os
import sys
import tempfile
import pytest
from PIL import Image, ImageDraw
from fastapi.testclient import TestClient

# Ensure backend root is on Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
try:
    from ml.vision_language import get_vision_language_registry
except ImportError:
    from backend.ml.vision_language import get_vision_language_registry

client = TestClient(app)


@pytest.fixture(scope="module")
def sample_images():
    """
    Creates temporary synthetic test images for reproducible automated testing.
    """
    temp_dir = tempfile.mkdtemp()
    
    # 1. Cat Image (Draw a simple brown cat-like silhouette on white canvas)
    cat_img_path = os.path.join(temp_dir, "cat_image.jpg")
    img_cat = Image.new("RGB", (400, 400), color=(255, 255, 255))
    draw = ImageDraw.Draw(img_cat)
    draw.ellipse([100, 100, 300, 300], fill=(139, 69, 19)) # Brown head
    draw.polygon([(100, 150), (140, 50), (180, 120)], fill=(139, 69, 19)) # Left ear
    draw.polygon([(220, 120), (260, 50), (300, 150)], fill=(139, 69, 19)) # Right ear
    img_cat.save(cat_img_path)

    # 2. Car Image (Draw a red rectangular car shape on blue canvas)
    car_img_path = os.path.join(temp_dir, "car_image.jpg")
    img_car = Image.new("RGB", (400, 400), color=(135, 206, 235))
    draw = ImageDraw.Draw(img_car)
    draw.rectangle([50, 200, 350, 320], fill=(255, 0, 0)) # Red car body
    draw.ellipse([80, 280, 150, 350], fill=(0, 0, 0)) # Wheel
    draw.ellipse([250, 280, 320, 350], fill=(0, 0, 0)) # Wheel
    img_car.save(car_img_path)

    # 3. Corrupted Image File
    corrupt_img_path = os.path.join(temp_dir, "corrupt_image.jpg")
    with open(corrupt_img_path, "wb") as f:
        f.write(b"NOT_AN_IMAGE_FILE_CORRUPTED_DATA_HEADER_BYTES_12345")

    # 4. Very Small Image (10x10)
    small_img_path = os.path.join(temp_dir, "small_image.png")
    img_small = Image.new("RGB", (10, 10), color=(0, 255, 0))
    img_small.save(small_img_path)

    yield {
        "cat": cat_img_path,
        "car": car_img_path,
        "corrupt": corrupt_img_path,
        "small": small_img_path,
        "dir": temp_dir
    }


def test_01_clip_registry_readiness():
    registry = get_vision_language_registry()
    # Explicitly load CLIP artifacts for automated vision test suite
    loaded = registry.load_artifacts()
    assert loaded == True
    assert registry.is_ready() == True
    status = registry.get_status()
    assert status["status"] == "ready"
    assert status["artifact_availability"] == True


def test_02_health_endpoint_extended():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["detection_engine"]["image_model"]["status"] == "ready"
    assert data["detection_engine"]["image_model"]["artifact_availability"] == True


def test_03_multimodal_test_a_relevant_image(sample_images):
    # TEST A: Text + Relevant Image
    headline = "A cute domestic cat resting on a soft blanket"
    body = "Feline behavior experts discuss why cats love cozy sleeping spots."
    
    with open(sample_images["cat"], "rb") as f:
        response = client.post(
            "/api/v1/detection/analyze",
            data={"headline": headline, "body": body},
            files={"image": ("cat.jpg", f, "image/jpeg")}
        )
        
    assert response.status_code == 200
    data = response.json()
    assert "image" in data["modalities_used"]
    assert data["visual_signal"]["available"] == True
    
    sim = data["visual_signal"]["image_text_similarity"]
    align = data["visual_signal"]["alignment_signal"]
    
    print(f"\n[TEST A - Relevant] Similarity: {sim}, Alignment: {align}, Prediction: {data['prediction']}, Conf: {data['confidence']}")
    assert sim is not None
    assert align > 0.30 # Semantic alignment should be positive for relevant cat image


def test_04_multimodal_test_b_unrelated_image(sample_images):
    # TEST B: Text + Unrelated Image (Cat text + Red Car Image)
    headline = "A cute domestic cat resting on a soft blanket"
    body = "Feline behavior experts discuss why cats love cozy sleeping spots."
    
    with open(sample_images["car"], "rb") as f:
        response = client.post(
            "/api/v1/detection/analyze",
            data={"headline": headline, "body": body},
            files={"image": ("car.jpg", f, "image/jpeg")}
        )
        
    assert response.status_code == 200
    data = response.json()
    assert "image" in data["modalities_used"]
    assert data["visual_signal"]["available"] == True
    
    sim = data["visual_signal"]["image_text_similarity"]
    align = data["visual_signal"]["alignment_signal"]
    
    print(f"[TEST B - Unrelated] Similarity: {sim}, Alignment: {align}, Prediction: {data['prediction']}, Conf: {data['confidence']}")
    assert sim is not None


def test_05_multimodal_test_c_different_subject_image(sample_images):
    # TEST C: Financial News + Red Car Image
    headline = "U.S. Federal Reserve Keeps Benchmark Interest Rates Unchanged"
    body = "Economic policy makers maintain interest rate targets following latest inflation report."
    
    with open(sample_images["car"], "rb") as f:
        response = client.post(
            "/api/v1/detection/analyze",
            data={"headline": headline, "body": body},
            files={"image": ("car.jpg", f, "image/jpeg")}
        )
        
    assert response.status_code == 200
    data = response.json()
    assert data["visual_signal"]["available"] == True


def test_06_multimodal_test_d_text_only():
    # TEST D: Text Only (No Image)
    headline = "Scientists Discover New Species of Deep Sea Coral in Pacific Ocean"
    body = "Marine biologists catalog rare marine life during oceanic expedition."
    
    response = client.post(
        "/api/v1/detection/analyze",
        data={"headline": headline, "body": body}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["modalities_used"] == ["text"]
    assert data["visual_signal"] is None or data["visual_signal"].get("available") == False


def test_07_multimodal_test_e_corrupted_image(sample_images):
    # TEST E: Corrupted Image
    headline = "Breaking News Story With Corrupted Image File"
    
    with open(sample_images["corrupt"], "rb") as f:
        response = client.post(
            "/api/v1/detection/analyze",
            data={"headline": headline},
            files={"image": ("corrupt.jpg", f, "image/jpeg")}
        )
        
    # API should not crash, must return 200 OK or handled state
    assert response.status_code == 200
    data = response.json()
    assert data["visual_signal"]["available"] == False
    assert "error" in data["visual_signal"] or "corrupted" in data["explanation"].lower() or "text" in data["modalities_used"]


def test_08_multimodal_test_f_very_small_image(sample_images):
    # TEST F: Very Small Image (10x10)
    headline = "Headline accompanied by a tiny 10x10 icon image"
    
    with open(sample_images["small"], "rb") as f:
        response = client.post(
            "/api/v1/detection/analyze",
            data={"headline": headline},
            files={"image": ("small.png", f, "image/png")}
        )
        
    assert response.status_code == 200
    data = response.json()
    assert data["visual_signal"]["available"] == True
    assert data["visual_signal"]["width"] == 10
    assert data["visual_signal"]["height"] == 10


def test_09_semantic_influence_comparison(sample_images):
    # PART 13: SEMANTIC INFLUENCE TEST
    # Same headline with Relevant vs Unrelated image
    claim_headline = "A cute domestic cat resting on a soft blanket"
    
    # 1. Relevant Image Run (Cat Image)
    with open(sample_images["cat"], "rb") as f:
        resp_rel = client.post(
            "/api/v1/detection/analyze",
            data={"headline": claim_headline},
            files={"image": ("cat.jpg", f, "image/jpeg")}
        ).json()
        
    # 2. Unrelated Image Run (Car Image)
    with open(sample_images["car"], "rb") as f:
        resp_unrel = client.post(
            "/api/v1/detection/analyze",
            data={"headline": claim_headline},
            files={"image": ("car.jpg", f, "image/jpeg")}
        ).json()

    rel_sim = resp_rel["visual_signal"]["image_text_similarity"]
    unrel_sim = resp_unrel["visual_signal"]["image_text_similarity"]
    
    rel_align = resp_rel["visual_signal"]["alignment_signal"]
    unrel_align = resp_unrel["visual_signal"]["alignment_signal"]

    print("\n--- PART 13: SEMANTIC INFLUENCE EXPERIMENT RESULTS ---")
    print(f"Claim: '{claim_headline}'")
    print(f"Relevant Image  -> Cosine Sim: {rel_sim:.4f}, Alignment Signal: {rel_align:.4f}, Alpha: {resp_rel['fusion_gate_alpha']}, Pred: {resp_rel['prediction']}")
    print(f"Unrelated Image -> Cosine Sim: {unrel_sim:.4f}, Alignment Signal: {unrel_align:.4f}, Alpha: {resp_unrel['fusion_gate_alpha']}, Pred: {resp_unrel['prediction']}")
    
    # Verify empirically that relevant image scores higher cosine similarity than unrelated image
    assert rel_sim > unrel_sim
    assert rel_align >= unrel_align


if __name__ == "__main__":
    pytest.main(["-v", __file__])
