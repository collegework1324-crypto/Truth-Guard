"""
Data Preprocessing Pipeline for Truth Guard NLP Machine Learning Model.
Cleans raw text data, combines title and text, removes duplicate records,
maps labels (FAKE -> 1, REAL -> 0), and splits into reproducible Train (70%),
Validation (15%), and Test (15%) sets without leakage.
"""

import re
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from typing import Tuple, Dict, Any


RANDOM_SEED = 42


def clean_text(text: str) -> str:
    """
    Normalizes input text for TF-IDF feature extraction.
    Converts to lowercase, strips extra whitespace, retains punctuation/alphanumerics.
    """
    if not isinstance(text, str) or not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'\s+', ' ', text)
    return text


def preprocess_dataset(df: pd.DataFrame) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Cleans, deduplicates, formats labels, and prepares dataset for modeling.
    Returns cleaned DataFrame and preprocessing statistics.
    """
    initial_count = len(df)
    
    # 1. Fill NA / missing values
    df['title'] = df['title'].fillna("").astype(str)
    df['text'] = df['text'].fillna("").astype(str)
    
    # 2. Combine title and text
    df['combined_text'] = df['title'] + " " + df['text']
    df['clean_text'] = df['combined_text'].apply(clean_text)
    
    # 3. Filter out empty or whitespace-only records
    df = df[df['clean_text'].str.len() >= 10].copy()
    count_after_empty_removal = len(df)
    
    # 4. Standardize binary label: 1 for FAKE, 0 for REAL
    def map_label(val):
        s = str(val).strip().upper()
        if s in ('FAKE', '1', '1.0'):
            return 1
        elif s in ('REAL', '0', '0.0'):
            return 0
        return np.nan
        
    df['numeric_label'] = df['label'].apply(map_label)
    df = df.dropna(subset=['numeric_label']).copy()
    df['numeric_label'] = df['numeric_label'].astype(int)
    
    # 5. Deduplicate records on clean_text
    df = df.drop_duplicates(subset=['clean_text'], keep='first').copy()
    count_after_dedup = len(df)
    
    processed_stats = {
        "initial_raw_records": initial_count,
        "after_empty_removal": count_after_empty_removal,
        "after_deduplication": count_after_dedup,
        "removed_duplicates": initial_count - count_after_dedup,
        "class_distribution_processed": {
            "FAKE (1)": int((df['numeric_label'] == 1).sum()),
            "REAL (0)": int((df['numeric_label'] == 0).sum())
        }
    }
    
    return df, processed_stats


def create_train_val_test_splits(
    df: pd.DataFrame, 
    seed: int = RANDOM_SEED
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, Dict[str, Any]]:
    """
    Splits cleaned dataset into 70% Train, 15% Validation, and 15% Test.
    Uses stratified sampling to preserve class distribution.
    """
    # 70% train, 30% temp (which will be split 50/50 into val and test -> 15% each)
    train_df, temp_df = train_test_split(
        df,
        test_size=0.30,
        random_state=seed,
        stratify=df['numeric_label']
    )
    
    val_df, test_df = train_test_split(
        temp_df,
        test_size=0.50,
        random_state=seed,
        stratify=temp_df['numeric_label']
    )
    
    split_stats = {
        "random_seed": seed,
        "train_samples": len(train_df),
        "validation_samples": len(val_df),
        "test_samples": len(test_df),
        "total_samples": len(df),
        "train_pct": round(len(train_df) / len(df) * 100, 2),
        "val_pct": round(len(val_df) / len(df) * 100, 2),
        "test_pct": round(len(test_df) / len(df) * 100, 2),
        "train_class_dist": train_df['numeric_label'].value_counts().to_dict(),
        "val_class_dist": val_df['numeric_label'].value_counts().to_dict(),
        "test_class_dist": test_df['numeric_label'].value_counts().to_dict()
    }
    
    return train_df, val_df, test_df, split_stats


if __name__ == "__main__":
    try:
        from ml.dataset import load_raw_dataset
    except ImportError:
        from backend.ml.dataset import load_raw_dataset
    raw_df, _ = load_raw_dataset()
    clean_df, p_stats = preprocess_dataset(raw_df)
    train_df, val_df, test_df, s_stats = create_train_val_test_splits(clean_df)
    
    print("\n--- PREPROCESSING STATS ---")
    for k, v in p_stats.items():
        print(f"{k}: {v}")
        
    print("\n--- SPLIT STATS ---")
    for k, v in s_stats.items():
        print(f"{k}: {v}")
