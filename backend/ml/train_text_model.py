"""
Training Pipeline for Truth Guard NLP Fake News Detector.
Trains TF-IDF + Logistic Regression supervised classification model on news text.
Saves model artifacts and metadata to backend/ml/artifacts/
"""

import os
import time
import json
import joblib
import pandas as pd
from typing import Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

try:
    from ml.dataset import load_raw_dataset
    from ml.preprocess import preprocess_dataset, create_train_val_test_splits, RANDOM_SEED
except ImportError:
    from backend.ml.dataset import load_raw_dataset
    from backend.ml.preprocess import preprocess_dataset, create_train_val_test_splits, RANDOM_SEED


ARTIFACTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "artifacts")
VECTORIZER_PATH = os.path.join(ARTIFACTS_DIR, "text_tfidf_vectorizer.joblib")
MODEL_PATH = os.path.join(ARTIFACTS_DIR, "text_fake_news_model.joblib")
METADATA_PATH = os.path.join(ARTIFACTS_DIR, "text_model_metadata.json")


def train_model() -> Dict[str, Any]:
    """
    Executes end-to-end model training on dataset.
    Returns training report and saves joblib and json metadata.
    """
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    
    print("[Train] Step 1: Loading raw dataset...")
    raw_df, raw_stats = load_raw_dataset()
    
    print("[Train] Step 2: Preprocessing text and handling duplicates...")
    clean_df, prep_stats = preprocess_dataset(raw_df)
    
    print("[Train] Step 3: Creating 70/15/15 stratified train/val/test splits...")
    train_df, val_df, test_df, split_stats = create_train_val_test_splits(clean_df, seed=RANDOM_SEED)
    
    print(f"[Train] Training samples: {len(train_df)}, Val samples: {len(val_df)}, Test samples: {len(test_df)}")
    
    # Configure TF-IDF Vectorizer
    tfidf_config = {
        "max_features": 10000,
        "ngram_range": [1, 2],
        "stop_words": "english",
        "sublinear_tf": True
    }
    
    # Configure Logistic Regression Classifier
    model_config = {
        "C": 1.0,
        "max_iter": 1000,
        "random_state": RANDOM_SEED,
        "solver": "lbfgs",
        "class_weight": None
    }
    
    vectorizer = TfidfVectorizer(
        max_features=tfidf_config["max_features"],
        ngram_range=tuple(tfidf_config["ngram_range"]),
        stop_words=tfidf_config["stop_words"],
        sublinear_tf=tfidf_config["sublinear_tf"]
    )
    
    model = LogisticRegression(
        C=model_config["C"],
        max_iter=model_config["max_iter"],
        random_state=model_config["random_state"],
        solver=model_config["solver"]
    )
    
    start_time = time.time()
    
    print("[Train] Step 4: Fitting TF-IDF vectorizer on training text...")
    X_train_tfidf = vectorizer.fit_transform(train_df['clean_text'])
    
    print("[Train] Step 5: Training Logistic Regression model...")
    model.fit(X_train_tfidf, train_df['numeric_label'])
    
    training_duration = time.time() - start_time
    print(f"[Train] Model trained in {training_duration:.4f} seconds.")
    
    print("[Train] Step 6: Saving trained artifacts...")
    joblib.dump(vectorizer, VECTORIZER_PATH)
    joblib.dump(model, MODEL_PATH)
    
    metadata = {
        "model_type": "TF-IDF + Logistic Regression",
        "vectorizer": "TfidfVectorizer (max_features=10000, unigram+bigram, sublinear_tf)",
        "dataset": raw_stats["dataset_name"],
        "dataset_source": raw_stats["dataset_source"],
        "license": raw_stats["license"],
        "random_seed": RANDOM_SEED,
        "total_samples": split_stats["total_samples"],
        "train_samples": split_stats["train_samples"],
        "validation_samples": split_stats["validation_samples"],
        "test_samples": split_stats["test_samples"],
        "class_distribution": prep_stats["class_distribution_processed"],
        "tfidf_config": tfidf_config,
        "model_config": model_config,
        "training_time_seconds": round(training_duration, 4),
        "training_date": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "version": "1.0"
    }
    
    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"[Train] Metadata saved to {METADATA_PATH}")
    return metadata


if __name__ == "__main__":
    meta = train_model()
    print("\n--- TRAINING COMPLETE ---")
    print(json.dumps(meta, indent=2))
