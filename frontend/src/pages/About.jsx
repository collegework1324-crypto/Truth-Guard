import React from 'react';
import { Info, BookOpen, Layers, Shield, Cpu, Sparkles, CheckCircle2, FileText, BarChart2 } from 'lucide-react';
import { ResearchTransparencyCard } from '../components/ResearchTransparencyCard';

export const About = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
      
      {/* HERO SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div className="badge-info font-mono" style={{ display: 'inline-block', marginBottom: '12px' }}>
          THEORETICAL FORMULATION & RESEARCH
        </div>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800 }} className="heading-serif">
          About <span className="gradient-text">Truth Guard</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '750px', margin: '14px auto 0 auto' }}>
          An empirical evaluation of multimodal misinformation detection using NLP text classification, vision-language semantic alignment, and reliability-gated fusion.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* SECTION 1: WHAT IS TRUTH GUARD & WHY MULTIMODAL */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '28px' }}>
          
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }} className="heading-serif">
              <Shield size={22} color="#00f2fe" /> 1. What is Truth Guard?
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Truth Guard is a specialized AI system engineered to analyze news headlines, textual articles, and supporting media assets. Rather than relying on a single modality, Truth Guard extracts linguistic features from text claims while evaluating semantic visual alignment between claims and uploaded images.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '10px' }} className="heading-serif">
              <Layers size={22} color="#4facfe" /> 2. Why Multimodal Misinformation Detection?
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Modern online misinformation frequently combines authentic images with out-of-context or fabricated headlines (out-of-context media attacks). Text-only models miss visual context, while raw image models cannot verify claim semantics. Multimodal integration provides a multi-faceted evidence signal.
            </p>
          </div>

        </div>

        {/* SECTION 2: MACHINE LEARNING PIPELINE & TEXT CLASSIFICATION */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }} className="heading-serif">
            <FileText size={24} color="#00f2fe" /> 3. Text Preprocessing & Supervised NLP Classification
          </h2>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.96rem', marginBottom: '20px' }}>
            The textual pipeline performs lowercasing, punctuation removal, stop-word filtering, and term frequency-inverse document frequency (TF-IDF) feature extraction. The extracted vector feeds into a supervised Logistic Regression classifier trained and evaluated on 6,306 deduplicated sample claims.
          </p>

          <div style={{
            background: 'rgba(4, 7, 17, 0.8)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '12px' }} className="font-mono">
              Canonical Held-out Test Set Metrics (N = 946)
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', textAlign: 'center' }} className="font-mono">
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ACCURACY</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#00f2fe' }}>93.13%</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>PRECISION</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#4facfe' }}>90.96%</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>RECALL</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>95.77%</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>F1-SCORE</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#a855f7' }}>93.31%</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>ROC-AUC</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>98.30%</div>
              </div>
            </div>
            
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '12px' }} className="font-mono">
              Confusion Matrix: True Negatives (TN) = 428 | False Positives (FP) = 45 | False Negatives (FN) = 20 | True Positives (TP) = 453
            </div>
          </div>
        </div>

        {/* SECTION 3: VISION-LANGUAGE SEMANTIC ALIGNMENT (CLIP) */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }} className="heading-serif">
            <Sparkles size={24} color="#4facfe" /> 4. Vision & Semantic Alignment (OpenAI CLIP)
          </h2>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.96rem', marginBottom: '16px' }}>
            To inspect image modality without making non-empirical authenticity claims, Truth Guard uses <strong>OpenAI CLIP (openai/clip-vit-base-patch32)</strong>. CLIP encodes both image and news text into normalized 512-dimensional vector embeddings, computing cosine similarity:
          </p>

          <div style={{
            background: 'rgba(4, 7, 17, 0.9)',
            border: '1px solid rgba(79, 172, 254, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--accent-blue)',
            marginBottom: '16px'
          }}>
            Similarity = cosine_similarity(E_text, E_image) = (E_text · E_image) / (||E_text|| ||E_image||) <br />
            Alignment Signal = clamp((Similarity - 0.12) / (0.28 - 0.12), 0, 1)
          </div>

          <div style={{
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '14px 18px',
            fontSize: '0.86rem',
            color: '#cbd5e1'
          }}>
            <strong>Research Note:</strong> Semantic alignment measures how strongly an image matches textual description. It does not establish whether an image is authentic or deepfaked by itself.
          </div>
        </div>

        {/* SECTION 4: RELIABILITY-GATED FUSION */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }} className="heading-serif">
            <Cpu size={24} color="#a855f7" /> 5. Reliability-Gated Baseline Fusion
          </h2>

          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.96rem', marginBottom: '16px' }}>
            Standard multimodal systems often assume equal modality reliability. Truth Guard formulates a dynamic gating layer that scales modality weight <span className="font-mono" style={{ color: 'var(--accent-cyan)' }}>α</span> based on textual prediction uncertainty versus visual signal discrepancy:
          </p>

          <div style={{
            background: 'rgba(4, 7, 17, 0.9)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '18px 22px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.92rem',
            color: '#c084fc',
            marginBottom: '16px'
          }}>
            h_t = NLP text fake probability score <br />
            h_v = Vision alignment discrepancy score <br />
            gate_input = (1.2 · (1.0 - |h_t - 0.5|)) - (0.8 · (1.0 - |h_v - 0.5|)) + 0.1 <br />
            α = sigmoid(gate_input) <br />
            P(Fake_fused) = α · h_t + (1 - α) · h_v
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            This prevents a weakly-aligned visual signal from overriding a strong, confident text classification.
          </p>
        </div>

        {/* REPLICATED RESEARCH TRANSPARENCY CARD */}
        <ResearchTransparencyCard detailed={true} />

      </div>
    </div>
  );
};
