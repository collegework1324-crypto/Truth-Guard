"""
Dataset loader and ingestion pipeline for Truth Guard NLP model.
Handles downloading, caching, inspecting, and loading the fake news dataset.
"""

import os
import sys
import pandas as pd
import httpx
from typing import Tuple, Dict, Any

DATASET_NAME = "Fake or Real News Dataset"
DATASET_SOURCE = "https://raw.githubusercontent.com/lutzhamel/fake-news/master/data/fake_or_real_news.csv"
DATASET_LICENSE = "Open Access Public Research Dataset (CC BY 4.0 / Public Domain)"
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
DATASET_PATH = os.path.join(DATA_DIR, "fake_or_real_news.csv")


def ensure_dataset_exists() -> str:
    """
    Downloads fake_or_real_news.csv if not present locally.
    Returns path to local CSV file.
    """
    os.makedirs(DATA_DIR, exist_ok=True)
    if os.path.exists(DATASET_PATH) and os.path.getsize(DATASET_PATH) > 100000:
        print(f"[Dataset] Using cached dataset at: {DATASET_PATH} ({os.path.getsize(DATASET_PATH)} bytes)")
        return DATASET_PATH

    print(f"[Dataset] Downloading '{DATASET_NAME}' from {DATASET_SOURCE}...")
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    try:
        with httpx.Client(follow_redirects=True, headers=headers, timeout=60.0) as client:
            response = client.get(DATASET_SOURCE)
            response.raise_for_status()
            
            with open(DATASET_PATH, "wb") as f:
                f.write(response.content)
                
            print(f"[Dataset] Download complete: {DATASET_PATH} ({os.path.getsize(DATASET_PATH)} bytes)")
            return DATASET_PATH
    except Exception as e:
        print(f"[Dataset] Error downloading dataset: {e}")
        if os.path.exists(DATASET_PATH):
            os.remove(DATASET_PATH)
        raise RuntimeError(f"Failed to download dataset from {DATASET_SOURCE}: {e}")


def inspect_raw_dataset(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Computes summary metrics for raw dataset prior to preprocessing.
    """
    total_records = len(df)
    columns = list(df.columns)
    
    label_counts = df['label'].value_counts(dropna=False).to_dict() if 'label' in df.columns else {}
    missing_per_col = df.isnull().sum().to_dict()
    duplicates_count = int(df.duplicated(subset=['title', 'text']).sum()) if 'title' in df.columns and 'text' in df.columns else int(df.duplicated().sum())

    stats = {
        "dataset_name": DATASET_NAME,
        "dataset_source": DATASET_SOURCE,
        "license": DATASET_LICENSE,
        "total_records": total_records,
        "columns": columns,
        "label_counts": {str(k): int(v) for k, v in label_counts.items()},
        "missing_values": {k: int(v) for k, v in missing_per_col.items()},
        "duplicate_records": duplicates_count
    }
    return stats


def load_raw_dataset() -> Tuple[pd.DataFrame, Dict[str, Any]]:
    path = ensure_dataset_exists()
    print(f"[Dataset] Loading raw CSV from {path}...")
    df = pd.read_csv(path)
    stats = inspect_raw_dataset(df)
    return df, stats


if __name__ == "__main__":
    df, stats = load_raw_dataset()
    print("\n--- RAW DATASET METRICS ---")
    for k, v in stats.items():
        print(f"{k}: {v}")
