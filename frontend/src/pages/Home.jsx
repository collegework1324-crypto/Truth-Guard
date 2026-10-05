import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Sparkles, ArrowRight, FileText, Image as ImageIcon, Video, Cpu, CheckCircle2, XCircle, Layers, Eye, MessageSquare, History } from 'lucide-react';
import { NewsTicker } from '../components/NewsTicker';
import { TruthGuardCore3D } from '../components/3d/TruthGuardCore3D';
import { ResearchTransparencyCard } from '../components/ResearchTransparencyCard';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%' }}>
      {/* Breaking News / AI Verification Ticker */}
      <NewsTicker />

      {/* HERO SECTION */}
      <section style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '60px 24px 80px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '40px',
        alignItems: 'center'
      }}>
        
        {/* HERO LEFT TEXT */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '30px',
            padding: '6px 16px',
            fontSize: '0.84rem',
            color: 'var(--accent-cyan)',
            marginBottom: '24px'
          }}>
            <Sparkles size={15} color="#00f2fe" />
            <span>Multimodal NLP + Computer Vision</span>
          </div>

          <h1 style={{ fontSize: '3.8rem', fontWeight: 800, lineHeight: 1.08, marginBottom: '24px' }} className="heading-serif">
            Truth Guard <br />
            <span className="gradient-text">Multimodal Fake News</span> <br />
            Detection System
          </h1>

          <p style={{ fontSize: '1.12rem', color: 'var(--text-muted)', maxWidth: '620px', lineHeight: 1.65, marginBottom: '36px' }}>
            Analyze textual claims and supporting media using supervised machine learning and OpenAI CLIP semantic visual alignment, backed by transparent evidence and a reliability-gated fusion gate for every result.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <button onClick={() => navigate('/detection')} className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
              Open Detection Workspace <ArrowRight size={18} />
            </button>
            <button onClick={() => navigate('/about')} className="btn-secondary" style={{ padding: '16px 30px', fontSize: '1rem' }}>
              Learn More
            </button>
          </div>

          {/* Floating TRUE / FALSE visual status indicators (OLD SITE SIGNATURE REPRODUCTION) */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="indicator-true">
              <CheckCircle2 size={18} color="#10b981" />
              <span>TRUE</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>Semantic consistency</span>
            </div>

            <div className="indicator-false">
              <XCircle size={18} color="#ef4444" />
              <span>FALSE</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>Contradictory evidence</span>
            </div>
          </div>
        </div>

        {/* HERO RIGHT: 3D TRUTH GUARD CORE */}
        <div style={{ position: 'relative' }}>
          <TruthGuardCore3D height="520px" interactive={true} />
        </div>

      </section>

      {/* FEATURES SECTION ("Purpose-built for multimodal truth") */}
      <section style={{ maxWidth: '1400px', margin: '40px auto 80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div className="badge-info font-mono" style={{ display: 'inline-block', marginBottom: '12px' }}>
            CORE SYSTEM CAPABILITIES
          </div>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800 }} className="heading-serif">
            Purpose-built for <span className="gradient-text">multimodal truth</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem', maxWidth: '680px', margin: '12px auto 0 auto' }}>
            Multiple evidence signals working together to catch what a single signal can miss.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '28px'
        }}>
          
          {/* CARD 1 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ background: 'rgba(0, 242, 254, 0.12)', padding: '14px', borderRadius: '14px', width: 'fit-content', marginBottom: '20px' }}>
              <FileText size={26} color="#00f2fe" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }} className="heading-serif">NLP Text Analysis</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              TF-IDF and Logistic Regression analyze textual evidence and estimate the probability of a fake-news classification (93.13% held-out test accuracy).
            </p>
          </div>

          {/* CARD 2 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ background: 'rgba(79, 172, 254, 0.12)', padding: '14px', borderRadius: '14px', width: 'fit-content', marginBottom: '20px' }}>
              <ImageIcon size={26} color="#4facfe" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }} className="heading-serif">Vision & Semantic Alignment</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              CLIP-based image-text semantic alignment measures how strongly uploaded visual content relates to the submitted claim in a shared 512d embedding space.
            </p>
          </div>

          {/* CARD 3 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ background: 'rgba(168, 85, 247, 0.12)', padding: '14px', borderRadius: '14px', width: 'fit-content', marginBottom: '20px' }}>
              <Cpu size={26} color="#a855f7" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }} className="heading-serif">Reliability-Gated Multimodal Fusion</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              Combines available evidence while preventing an unreliable or noisy visual signal from overriding a stronger textual representation.
            </p>
          </div>

          {/* CARD 4 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '14px', borderRadius: '14px', width: 'fit-content', marginBottom: '20px' }}>
              <Eye size={26} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }} className="heading-serif">Explainable Results</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              Every verdict comes with a transparent human-readable breakdown explaining why the AI reached its prediction, showing active signals and gate alpha.
            </p>
          </div>

          {/* CARD 5 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.12)', padding: '14px', borderRadius: '14px', width: 'fit-content', marginBottom: '20px' }}>
              <History size={26} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }} className="heading-serif">Detection History</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              Persistent storage in PostgreSQL/SQLite tracks all past detection requests, confidence scores, processing times, and modality parameters.
            </p>
          </div>

          {/* CARD 6 */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '14px', borderRadius: '14px', width: 'fit-content', marginBottom: '20px' }}>
              <MessageSquare size={26} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }} className="heading-serif">Feedback & Review</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.65 }}>
              Interactive ground truth ratings and qualitative feedback directly feed into model auditing for continuous research evaluation.
            </p>
          </div>

        </div>
      </section>

      {/* PIPELINE SECTION ("From article to verdict in four stages") */}
      <section style={{ maxWidth: '1400px', margin: '80px auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800 }} className="heading-serif">
            From article to verdict in <span className="gradient-text">four stages</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '12px auto 0 auto' }}>
            End-to-end detection flow processing text claims and supporting media.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          position: 'relative'
        }}>
          
          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '12px' }} className="font-mono">
              01
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }} className="heading-serif">INGEST</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              User submits news headline, article body, and optional image or video file into the workspace.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#4facfe', marginBottom: '12px' }} className="font-mono">
              02
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }} className="heading-serif">PREPROCESS</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Text normalization and model-specific media preparation (CLIP image resizing, RGB conversion).
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7', marginBottom: '12px' }} className="font-mono">
              03
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }} className="heading-serif">EXTRACT</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              TF-IDF text features and OpenAI CLIP ViT-B/32 512d semantic image-text representation.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '30px' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginBottom: '12px' }} className="font-mono">
              04
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }} className="heading-serif">PREDICT</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Supervised text prediction + available visual signal + reliability-gated verdict & confidence score.
            </p>
          </div>

        </div>
      </section>

      {/* RESEARCH TRANSPARENCY CARD */}
      <section style={{ maxWidth: '1400px', margin: '80px auto', padding: '0 24px' }}>
        <ResearchTransparencyCard detailed={true} />
      </section>

    </div>
  );
};
