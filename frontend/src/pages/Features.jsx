import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Image as ImageIcon, Video, Cpu, ShieldCheck, Eye, History, MessageSquare, Lock, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Features = () => {
  const navigate = useNavigate();

  const featureList = [
    {
      icon: FileText,
      color: '#00f2fe',
      title: 'Supervised NLP Text Analysis',
      subtitle: 'TF-IDF + Logistic Regression Model',
      description: 'Parses textual claims and headlines, extracting linguistic patterns, clickbait markers, and structural semantic signals with 93.13% held-out test accuracy.',
      link: '/detection'
    },
    {
      icon: ImageIcon,
      color: '#4facfe',
      title: 'Image-Text Semantic Alignment',
      subtitle: 'OpenAI CLIP ViT-B/32 Multimodal Encoder',
      description: 'Encodes images and news text into a shared 512-dimensional vector space to calculate cosine similarity and visual semantic alignment scores.',
      link: '/detection'
    },
    {
      icon: Video,
      color: '#a855f7',
      title: 'Video Frame Keyframe Sampling',
      subtitle: 'Temporal Frame Analysis',
      description: 'Extracts representative keyframes across video uploaded files to evaluate frame-to-frame continuity and cross-modality alignment.',
      link: '/detection'
    },
    {
      icon: Cpu,
      color: '#10b981',
      title: 'Reliability-Gated Multimodal Fusion',
      subtitle: 'Dynamic Sigmoid Gate (α)',
      description: 'Calculates dynamic modality weights to prevent noisy visual content from distorting strong text predictions.',
      link: '/detection'
    },
    {
      icon: Eye,
      color: '#f59e0b',
      title: 'Transparent Verdict Explanation',
      subtitle: 'Human-Readable Evidence Breakdown',
      description: 'Generates detailed step-by-step explanations for every verdict, showing individual modality probabilities and gate alpha parameters.',
      link: '/detection'
    },
    {
      icon: History,
      color: '#818cf8',
      title: 'Persistent Detection History',
      subtitle: 'PostgreSQL / SQLite Database Storage',
      description: 'Saves full analysis records with timestamps, processing latencies, modality usage flags, and prediction outputs.',
      link: '/history'
    },
    {
      icon: MessageSquare,
      color: '#ec4899',
      title: 'Active Feedback Loop',
      subtitle: 'Ground Truth User Review',
      description: 'Allows domain experts and users to rate predictions (1–5 stars) and submit ground truth corrections to audit model performance.',
      link: '/feedback'
    },
    {
      icon: Lock,
      color: '#38bdf8',
      title: 'JWT Authentication & Authorization',
      subtitle: 'Secure User Sessions',
      description: 'Role-based access control with bcrypt password hashing and JSON Web Token (JWT) bearer authentication.',
      link: '/auth'
    },
    {
      icon: ShieldAlert,
      color: '#f43f5e',
      title: 'Admin Metrics & System Telemetry',
      subtitle: 'Real-time Analytics Dashboard',
      description: 'Monitors database entity counts, prediction distributions, average latency, and model status indicators.',
      link: '/admin'
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 24px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div className="badge-info font-mono" style={{ display: 'inline-block', marginBottom: '12px' }}>
          TRUTH GUARD PLATFORM ARCHITECTURE
        </div>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800 }} className="heading-serif">
          Platform <span className="gradient-text">Features & Capabilities</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '720px', margin: '14px auto 0 auto' }}>
          Explore the full suite of multimodal analysis tools, security mechanisms, and research interfaces built into Truth Guard.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
        gap: '28px',
        marginBottom: '60px'
      }}>
        {featureList.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{
                  background: `${item.color}18`,
                  padding: '14px',
                  borderRadius: '14px',
                  width: 'fit-content',
                  marginBottom: '20px',
                  border: `1px solid ${item.color}40`
                }}>
                  <Icon size={26} color={item.color} />
                </div>

                <div style={{ fontSize: '0.76rem', color: item.color, fontWeight: 700, marginBottom: '6px' }} className="font-mono">
                  {item.subtitle}
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '12px' }} className="heading-serif">
                  {item.title}
                </h3>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.65, marginBottom: '24px' }}>
                  {item.description}
                </p>
              </div>

              <button 
                onClick={() => navigate(item.link)}
                className="btn-secondary" 
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.86rem' }}
              >
                Access Feature <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' }} className="heading-serif">
          Ready to verify a news claim?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px auto' }}>
          Open the Detection Workspace to analyze headlines, text articles, and supporting media with instant feedback.
        </p>

        <button onClick={() => navigate('/detection')} className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>
          Launch Detection Workspace <ArrowRight size={18} />
        </button>
      </div>

    </div>
  );
};
