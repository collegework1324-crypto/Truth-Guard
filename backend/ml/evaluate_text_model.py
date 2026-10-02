"""
Model Evaluation Pipeline for Truth Guard NLP Model.
Evaluates trained model exclusively on the held-out test set (15%).
Calculates Accuracy, Precision, Recall, F1-Score, ROC-AUC, and Confusion Matrix.
Saves metrics JSON, evaluation TXT report, and confusion matrix image.
"""

import os
import json
import joblib
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from typing import Dict, Any

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

try:
    from ml.dataset import load_raw_dataset
    from ml.preprocess import preprocess_dataset, create_train_val_test_splits, RANDOM_SEED
except ImportError:
    from backend.ml.dataset import load_raw_dataset
    from backend.ml.preprocess import preprocess_dataset, create_train_val_test_splits, RANDOM_SEED


ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
VECTORIZER_PATH = os.path.join(ARTIFACTS_DIR, "text_tfidf_vectorizer.joblib")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "text_fake_news_model.joblib")
METRICS_PATH = os.path.join(ARTIFACTS_DIR, "text_model_metrics.json")
EVAL_TXT_PATH = os.path.join(ARTIFACTS_DIR, "text_model_evaluation.txt")
CONF_MATRIX_IMG_PATH = os.path.join(ARTIFACTS_DIR, "confusion_matrix.png")


def evaluate_model() -> Dict[str, Any]:
    """
    Loads saved model artifacts and evaluates strictly on the 15% test set.
    """
    if not os.path.exists(VECTORIZER_PATH) or not os.path.exists(MODEL_PATH):
        raise FileNotFoundError("Model artifacts not found! Run train_text_model.py first.")
        
    print("[Evaluate] Loading vectorizer and trained model...")
    vectorizer = joblib.load(VECTORIZER_PATH)
    model = joblib.load(MODEL_PATH)
    
    print("[Evaluate] Loading raw dataset and replicating split...")
    raw_df, _ = load_raw_dataset()
    clean_df, _ = preprocess_dataset(raw_df)
    _, _, test_df, split_stats = create_train_val_test_splits(clean_df, seed=RANDOM_SEED)
    
    print(f"[Evaluate] Held-out test set size: {len(test_df)} samples.")
    
    X_test_tfidf = vectorizer.transform(test_df['clean_text'])
    y_test = test_df['numeric_label'].values
    
    # Predict labels and fake probabilities (column index 1 = FAKE)
    y_pred = model.predict(X_test_tfidf)
    y_prob = model.predict_proba(X_test_tfidf)[:, 1]
    
    acc = float(accuracy_score(y_test, y_pred))
    prec = float(precision_score(y_test, y_pred))
    rec = float(recall_score(y_test, y_pred))
    f1 = float(f1_score(y_test, y_pred))
    auc = float(roc_auc_score(y_test, y_prob))
    cm = confusion_matrix(y_test, y_pred).tolist()
    
    tn, fp, fn, tp = confusion_matrix(y_test, y_pred).ravel()
    
    metrics = {
        "evaluation_dataset_split": "test",
        "test_samples": len(test_df),
        "accuracy": round(acc, 4),
        "precision": round(prec, 4),
        "recall": round(rec, 4),
        "f1_score": round(f1, 4),
        "roc_auc": round(auc, 4),
        "confusion_matrix": {
            "true_negatives_real": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives_fake": int(tp)
        },
        "raw_confusion_matrix_2x2": cm
    }
    
    # Save metrics JSON
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"[Evaluate] Metrics saved to {METRICS_PATH}")
    
    # Save human-readable text report
    report_text = f"""==================================================
TRUTH GUARD NLP MODEL EVALUATION REPORT
==================================================
Model Architecture : TF-IDF + Logistic Regression
Target Modality    : Text (Headline + Article Body)
Evaluation Set     : Held-out Test Set (15% of dataset)
Test Sample Count  : {len(test_df)} articles
Random Seed        : {RANDOM_SEED}

PERFORMANCE METRICS:
--------------------------------------------------
Accuracy  : {acc:.4f} ({acc * 100:.2f}%)
Precision : {prec:.4f} ({prec * 100:.2f}%)
Recall    : {rec:.4f} ({rec * 100:.2f}%)
F1-Score  : {f1:.4f} ({f1 * 100:.2f}%)
ROC-AUC   : {auc:.4f} ({auc * 100:.2f}%)

CONFUSION MATRIX:
--------------------------------------------------
True Negatives (Actual REAL, Predicted REAL): {tn}
False Positives (Actual REAL, Predicted FAKE): {fp}
False Negatives (Actual FAKE, Predicted REAL): {fn}
True Positives (Actual FAKE, Predicted FAKE): {tp}

DETAILED CLASSIFICATION REPORT:
--------------------------------------------------
{classification_report(y_test, y_pred, target_names=['REAL (0)', 'FAKE (1)'])}
==================================================
"""
    with open(EVAL_TXT_PATH, "w") as f:
        f.write(report_text)
    print(f"[Evaluate] Evaluation report saved to {EVAL_TXT_PATH}")
    
    # Plot and save Confusion Matrix Image
    fig, ax = plt.subplots(figsize=(6, 5))
    cax = ax.matshow(cm, cmap=plt.cm.Blues, alpha=0.8)
    fig.colorbar(cax)
    
    for i in range(2):
        for j in range(2):
            ax.text(j, i, str(cm[i][j]), va='center', ha='center', fontsize=14, fontweight='bold')
            
    ax.set_xticks([0, 1])
    ax.set_yticks([0, 1])
    ax.set_xticklabels(['REAL', 'FAKE'], fontsize=12)
    ax.set_yticklabels(['REAL', 'FAKE'], fontsize=12)
    plt.xlabel('Predicted Label', fontsize=12)
    plt.ylabel('True Label', fontsize=12)
    plt.title('Truth Guard NLP Model - Confusion Matrix', fontsize=13, pad=15)
    plt.tight_layout()
    plt.savefig(CONF_MATRIX_IMG_PATH, dpi=300)
    plt.close()
    print(f"[Evaluate] Confusion matrix plot saved to {CONF_MATRIX_IMG_PATH}")
    
    return metrics


if __name__ == "__main__":
    m = evaluate_model()
    print("\n--- EVALUATION COMPLETE ---")
    print(json.dumps(m, indent=2))
