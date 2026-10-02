import re
from typing import Dict, Any, List
try:
    from ml.model_registry import get_text_model_registry
    from ml.preprocess import clean_text
except ImportError:
    from backend.ml.model_registry import get_text_model_registry
    from backend.ml.preprocess import clean_text


class TextProcessor:
    """
    NLP Text Analysis Engine for Truth Guard.
    Integrates trained TF-IDF + Logistic Regression Machine Learning model 
    for primary fake news classification, supplemented by linguistic indicators 
    and headline-body consistency analysis.
    """
    def __init__(self):
        # Clickbait / exaggeration patterns commonly found in fake news headlines
        self.suspicious_words = [
            "shocking", "unbelievable", "secret", "miracle", "they don't want you to know",
            "conspiracy", "guaranteed", "mindblowing", "you won't believe", "banned",
            "exposed", "proven", "hidden truth", "breakthrough", "urgent warning"
        ]
        self.model_registry = get_text_model_registry()

    def preprocess_text(self, text: str) -> str:
        """Clean and normalize input text."""
        return clean_text(text)

    def analyze(self, headline: str, body: str = None) -> Dict[str, Any]:
        """
        Processes text using trained Machine Learning model for primary prediction,
        supported by stylistic heuristics and headline-body consistency metrics.
        """
        full_text = f"{headline} {body}" if body else headline
        cleaned_input = self.preprocess_text(full_text)
        
        clean_headline = self.preprocess_text(headline)
        clean_body = self.preprocess_text(body) if body else ""

        # 1. Primary Machine Learning Inference (TF-IDF + Logistic Regression)
        is_ml_used = False
        model_probability = None
        
        if self.model_registry.is_ready():
            try:
                model_fake_prob, model_real_prob = self.model_registry.predict(cleaned_input)
                is_ml_used = True
                model_probability = round(model_fake_prob, 4)
                text_fake_score = model_probability
                text_real_score = round(model_real_prob, 4)
            except Exception as e:
                is_ml_used = False
                text_fake_score = 0.5
                text_real_score = 0.5
        else:
            is_ml_used = False
            text_fake_score = 0.5
            text_real_score = 0.5

        # 2. Supplementary Heuristic Analysis (Linguistic Signals)
        detected_patterns = []
        for word in self.suspicious_words:
            if word in clean_headline or word in clean_body:
                detected_patterns.append(word)

        caps_ratio = sum(1 for c in headline if c.isupper()) / max(len(headline), 1)
        exclamation_count = headline.count("!") + (body.count("!") if body else 0)

        # 3. Headline-Body Consistency (Jaccard similarity baseline)
        consistency_score = 1.0
        if clean_body:
            headline_words = set(re.findall(r'\w+', clean_headline))
            body_words = set(re.findall(r'\w+', clean_body))
            if headline_words and body_words:
                intersection = headline_words.intersection(body_words)
                consistency_score = len(intersection) / max(len(headline_words), 1)

        # Fallback to heuristic score only if ML model is missing/failed
        if not is_ml_used:
            fake_signals = 0.0
            if detected_patterns:
                fake_signals += min(len(detected_patterns) * 0.2, 0.4)
            if caps_ratio > 0.3:
                fake_signals += 0.2
            if exclamation_count > 2:
                fake_signals += 0.15
            if clean_body and consistency_score < 0.15:
                fake_signals += 0.35
            text_fake_score = min(max(fake_signals, 0.05), 0.95)
            text_real_score = 1.0 - text_fake_score

        # Feature vector for reliability gated fusion
        text_representation = [
            round(text_fake_score, 4),
            round(consistency_score, 4),
            round(caps_ratio, 4),
            float(len(detected_patterns))
        ]

        detail_msg = (
            f"ML Model Probability P(Fake): {model_probability:.4f}. " if is_ml_used 
            else "Heuristic fallback active. "
        ) + f"Analyzed {len(cleaned_input.split())} words. Found {len(detected_patterns)} sensationalist patterns."

        return {
            "fake_score": round(text_fake_score, 4),
            "real_score": round(text_real_score, 4),
            "model_probability": model_probability,
            "is_ml_used": is_ml_used,
            "model_type": "TF-IDF + Logistic Regression" if is_ml_used else "Heuristic Rule Baseline",
            "consistency_score": round(consistency_score, 4),
            "caps_ratio": round(caps_ratio, 4),
            "suspicious_patterns": detected_patterns,
            "representation": text_representation,
            "detail": detail_msg
        }
