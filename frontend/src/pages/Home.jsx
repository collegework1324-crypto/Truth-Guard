import React from 'react';
import { Shield, Sparkles, ArrowRight, FileText, Image as ImageIcon, Video, Cpu, CheckCircle } from 'lucide-react';

export const Home = ({ onNavigate }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', margin: '40px 0 60px 0' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 242, 254, 0.1)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '30px',
          padding: '6px 16px',
          fontSize: '0.85rem',
          color: 'var(--accent-cyan)',
          marginBottom: '20px'
        }}>
          <Sparkles size={14} />
          <span>Multimodal Fake News Detection System</span>
        </div>

        <h1 style={{ fontSize: '3.2rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '20px' }}>
          Unmask Falsehoods with <br />
          <span className="gradient-text">Reliability-Gated Multimodal AI</span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 36px auto' }}>
          Truth Guard integrates NLP text semantics, computer vision spatial features, and video frame-level temporal analysis into a unified reliability-aware gate architecture.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button onClick={() => onNavigate('workspace')} className="btn-primary" style={{ padding: '14px 32px', fontSize: '1.05rem' }}>
            Open Detection Workspace <ArrowRight size={18} />
          </button>
          <button onClick={() => onNavigate('about')} className="btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            Research Methodology
          </button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px',
        margin: '60px 0'
      }}>
        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '16px' }}>
            <FileText size={24} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>NLP Text Signal</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Analyzes headline-body semantic consistency, sensationalist clickbait indicators, structural coherence, and linguistic patterns.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ background: 'rgba(0, 242, 254, 0.15)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '16px' }}>
            <ImageIcon size={24} color="#00f2fe" />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Visual Feature Extraction</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Inspects image spatial properties, EXIF metadata integrity, re-encoding artifacts, aspect ratio anomalies, and text-image alignment.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '16px' }}>
            <Video size={24} color="#c084fc" />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Video Temporal Sampling</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Performs frame-level keyframe sampling, frame-to-frame continuity analysis, and temporal score aggregation across video streams.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '30px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px', width: 'fit-content', marginBottom: '16px' }}>
            <Cpu size={24} color="#34d399" />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>Reliability-Gated Fusion</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Dynamically computes modality weight <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>α = sigmoid(W_g [h_t; h_v] + b_g)</span> to balance modality reliability instead of equal weight assumptions.
          </p>
        </div>
      </div>
    </div>
  );
};
