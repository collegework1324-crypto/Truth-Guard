import React from 'react';
import { ShieldCheck, Info, FileText, Sparkles, Cpu, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ResearchTransparencyCard = ({ detailed = false }) => {
  return (
    <div className="glass-panel" style={{ padding: detailed ? '32px' : '24px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(0, 242, 254, 0.15)', padding: '8px', borderRadius: '10px' }}>
            <ShieldCheck size={20} color="#00f2fe" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }} className="heading-serif">
              Research Transparency & Benchmark Metrics
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Empirical held-out validation results & system formulation disclosures
            </p>
          </div>
        </div>

        <div className="badge-info font-mono" style={{ fontSize: '0.76rem' }}>
          VERIFIED PROJECT ARTIFACTS
        </div>
      </div>

      {/* Held-out Text NLP Model Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(0, 242, 254, 0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Accuracy</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-cyan)' }} className="font-mono">93.13%</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(79, 172, 254, 0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precision</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#4facfe' }} className="font-mono">90.96%</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recall</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }} className="font-mono">95.77%</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(168, 85, 247, 0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>F1-Score</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#a855f7' }} className="font-mono">93.31%</div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ROC-AUC</div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }} className="font-mono">98.30%</div>
        </div>
      </div>

      {/* Mandatory Scope Note */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        fontSize: '0.86rem',
        color: '#cbd5e1',
        lineHeight: 1.6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
          <Info size={16} /> Dataset-Specific Held-Out Evaluation Disclosure
        </div>
        <p style={{ marginBottom: '10px' }}>
          The metrics above represent held-out evaluation performance on the project's canonical NLP dataset (6,306 deduplicated samples: 4,414 train / 946 val / 946 test). Confusion Matrix: TN=428, FP=45, FN=20, TP=453. <em>These are dataset-specific benchmarks and are not presented as universal real-world accuracy.</em>
        </p>

        {detailed && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Sparkles size={16} color="#00f2fe" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#00f2fe' }}>CLIP Semantic Alignment:</strong> OpenAI CLIP ViT-B/32 computes 512-dimensional embeddings for text-image similarity. <em>Semantic alignment measures how strongly an uploaded image relates to text; it does NOT prove image authenticity or detect deepfakes by itself.</em>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Cpu size={16} color="#a855f7" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: '#a855f7' }}>Multimodal Fusion Architecture:</strong> Production runs <span className="font-mono">reliability_gated_baseline</span>. Learned fusion is explicitly disabled in production because a paired multimodal training dataset is not available.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
