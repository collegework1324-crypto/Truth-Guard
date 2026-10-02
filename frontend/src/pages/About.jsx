import React from 'react';
import { Info, BookOpen, Layers, Shield, Cpu } from 'lucide-react';

export const About = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
          About & Research <span className="gradient-text">Methodology</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Theoretical background and architectural formulation for Truth Guard.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={22} color="#00f2fe" /> Reliability-Gated Multimodal Fusion
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '16px' }}>
            Standard multimodal architectures often concatenate feature vectors directly or assume equal modality reliability. Truth Guard implements a dynamic gating mechanism that evaluates modality reliability before combining representation vectors:
          </p>
          <div style={{
            background: 'rgba(10, 15, 28, 0.9)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.92rem',
            color: 'var(--accent-cyan)'
          }}>
            ht = NLP text representation score <br />
            hv = CV visual feature representation score <br />
            α = sigmoid(Wg · [ht; hv] + bg) <br />
            z = α · ht + (1 - α) · hv
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Layers size={22} color="#a855f7" /> Experimental Benchmarking Plan
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            This application captures raw runtime predictions, modality usage flags, and latency markers in the database, laying the groundwork for empirical evaluation (Accuracy, Precision, Recall, F1-Score, and ROC-AUC) across Text-Only, Text+Image, and Text+Video configurations.
          </p>
        </div>
      </div>
    </div>
  );
};
