import React from 'react';
import { ShieldCheck, Activity, Radio } from 'lucide-react';

export const NewsTicker = () => {
  return (
    <div style={{
      background: 'rgba(4, 7, 17, 0.95)',
      borderBottom: '1px solid rgba(0, 242, 254, 0.15)',
      padding: '6px 20px',
      overflow: 'hidden',
      fontSize: '0.8rem',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      fontFamily: 'var(--font-mono)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        background: 'rgba(0, 242, 254, 0.15)',
        border: '1px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '4px',
        padding: '2px 8px',
        color: 'var(--accent-cyan)',
        fontWeight: 700,
        fontSize: '0.72rem',
        flexShrink: 0,
        letterSpacing: '0.05em'
      }}>
        <Radio size={12} className="animate-pulse-glow" color="#00f2fe" />
        LIVE AI VERIFICATION
      </div>

      <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', position: 'relative' }}>
        <div className="animate-ticker" style={{ display: 'inline-flex', gap: '30px' }}>
          <span style={{ color: '#cbd5e1' }}>
            <strong style={{ color: 'var(--accent-cyan)' }}>Truth Guard v1.0:</strong> Multimodal Fake News Detection System active with supervised NLP & OpenAI CLIP alignment.
          </span>
          <span style={{ color: '#cbd5e1' }}>
            • <strong style={{ color: '#4facfe' }}>NLP Text Model:</strong> 93.13% Accuracy on canonical held-out dataset (TF-IDF + Logistic Regression).
          </span>
          <span style={{ color: '#cbd5e1' }}>
            • <strong style={{ color: '#a855f7' }}>Vision-Language:</strong> CLIP ViT-B/32 cosine similarity for claim-image semantic consistency.
          </span>
          <span style={{ color: '#cbd5e1' }}>
            • <strong style={{ color: '#10b981' }}>Reliability Gate:</strong> Sigmoid dynamic weighting prevents noisy visual signals from overriding text evidence.
          </span>
          
          {/* Duplicate set for infinite ticker loop */}
          <span style={{ color: '#cbd5e1' }}>
            <strong style={{ color: 'var(--accent-cyan)' }}>Truth Guard v1.0:</strong> Multimodal Fake News Detection System active with supervised NLP & OpenAI CLIP alignment.
          </span>
          <span style={{ color: '#cbd5e1' }}>
            • <strong style={{ color: '#4facfe' }}>NLP Text Model:</strong> 93.13% Accuracy on canonical held-out dataset (TF-IDF + Logistic Regression).
          </span>
          <span style={{ color: '#cbd5e1' }}>
            • <strong style={{ color: '#a855f7' }}>Vision-Language:</strong> CLIP ViT-B/32 cosine similarity for claim-image semantic consistency.
          </span>
          <span style={{ color: '#cbd5e1' }}>
            • <strong style={{ color: '#10b981' }}>Reliability Gate:</strong> Sigmoid dynamic weighting prevents noisy visual signals from overriding text evidence.
          </span>
        </div>
      </div>
    </div>
  );
};
