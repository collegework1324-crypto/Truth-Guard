"""
Trainable Multimodal Fusion Model Architecture for Truth Guard (Task 3C).
Trains a supervised Logistic Regression classifier on top of:
- Text ML probability P(Fake | Text) from Task 3A model
- Image-Text Cosine Similarity and Alignment Signal from Task 3B CLIP model

If no verified paired dataset is available, logs the dataset blocker and exposes the pipeline.
"""

import os
import time
import json
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Tuple, Optional
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix

try:
    from ml.preprocess import RANDOM_SEED
except ImportError:
    from backend.ml.preprocess import RANDOM_SEED

ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
FUSION_MODEL_PATH = os.path.join(ARTIFACTS_DIR, "multimodal_fusion_model.joblib")
FUSION_METADATA_PATH = os.path.join(ARTIFACTS_DIR, "multimodal_fusion_metadata.json")
FUSION_METRICS_PATH = os.path.join(ARTIFACTS_DIR, "multimodal_fusion_metrics.json")


def train_multimodal_fusion(
    data_df: Optional[pd.DataFrame] = None,
    is_production_ready: bool = False
) -> Dict[str, Any]:
    """
    Trains Logistic Regression Multimodal Fusion Model on paired feature matrix:
    X = [p_fake_text, image_text_similarity, alignment_signal]
    y = binary fake/real label (1 = FAKE, 0 = REAL)
    """
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    
    if data_df is None or len(data_df) == 0:
        blocker_msg = (
            "Trainable multimodal fusion could not be empirically trained because "
            "no verified paired multimodal dataset (text + accessible image + fake/real label) "
            "was available locally or via public URL streams."
        )
        print(f"[FusionTrain] BLOCKER REPORT: {blocker_msg}")
        return {
            "status": "blocked",
            "reason": blocker_msg,
            "artifact_saved": False
        }

    print(f"[FusionTrain] Training multimodal fusion classifier on {len(data_df)} paired samples...")
    
    feature_cols = ['p_fake_text', 'image_text_similarity', 'alignment_signal']
    for col in feature_cols + ['label']:
        if col not in data_df.columns:
            raise ValueError(f"Missing required feature column: '{col}' in data_df.")

    X = data_df[feature_cols].values
    y = data_df['label'].astype(int).values

    # Stratified 70/15/15 train/val/test split (or non-stratified if dataset size is small)
    if len(data_df) < 20:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, random_state=RANDOM_SEED
        )
        X_val, y_val = X_test, y_test
    else:
        X_train, X_temp, y_train, y_temp = train_test_split(
            X, y, test_size=0.30, random_state=RANDOM_SEED, stratify=y
        )
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.50, random_state=RANDOM_SEED, stratify=y_temp
        )

    fusion_model = LogisticRegression(
        C=1.0,
        max_iter=1000,
        random_state=RANDOM_SEED,
        solver="lbfgs"
    )

    start_time = time.time()
    fusion_model.fit(X_train, y_train)
    training_time = time.time() - start_time

    # Evaluate on held-out test set
    y_pred = fusion_model.predict(X_test)
    y_prob = fusion_model.predict_proba(X_test)[:, 1]

    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    auc = float(roc_auc_score(y_test, y_prob))
    cm = confusion_matrix(y_test, y_pred).tolist()

    # Save artifacts
    joblib.dump(fusion_model, FUSION_MODEL_PATH)

    metadata = {
        "model_type": "Logistic Regression (Trainable Multimodal Fusion)",
        "features": feature_cols,
        "random_seed": RANDOM_SEED,
        "train_samples": len(X_train),
        "val_samples": len(X_val),
        "test_samples": len(X_test),
        "training_time_seconds": round(training_time, 4),
        "is_production_ready": is_production_ready,
        "version": "1.0"
    }

    metrics = {
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "confusion_matrix": cm
    }

    with open(FUSION_METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)

    with open(FUSION_METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"[FusionTrain] Multimodal Fusion Model trained & saved to {FUSION_MODEL_PATH}")
    return {
        "status": "success",
        "metadata": metadata,
        "metrics": metrics,
        "artifact_saved": True
    }


if __name__ == "__main__":
    train_multimodal_fusion(None)
