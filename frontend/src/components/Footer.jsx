import React from 'react';
import { Shield, Sparkles, Github, Globe, FileText, Cpu } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid rgba(0, 242, 254, 0.15)',
      background: 'rgba(4, 7, 17, 0.95)',
      padding: '50px 24px 30px 24px',
      marginTop: '80px',
      color: 'var(--text-muted)',
      fontSize: '0.88rem'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                padding: '6px',
                borderRadius: '8px'
              }}>
                <Shield size={18} color="#040711" strokeWidth={2.8} />
              </div>
              <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', fontWeight: 800 }} className="heading-serif">
                TRUTH <span className="gradient-text">GUARD</span>
              </h2>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Multimodal Fake News Detection platform using supervised NLP text classification, OpenAI CLIP vision-language semantic alignment, and reliability-gated fusion.
            </p>

            <div className="badge-info font-mono" style={{ fontSize: '0.74rem' }}>
              VERSION 1.0.0 • PRODUCTION READY
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '16px', fontWeight: 700 }} className="heading-serif">
              Platform Navigation
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><NavLink to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Home</NavLink></li>
              <li><NavLink to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>About & Research</NavLink></li>
              <li><NavLink to="/features" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Platform Features</NavLink></li>
              <li><NavLink to="/detection" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Detection Workspace</NavLink></li>
              <li><NavLink to="/feedback" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Feedback Loop</NavLink></li>
              <li><NavLink to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Research Contact</NavLink></li>
            </ul>
          </div>

          {/* System Specs */}
          <div>
            <h3 style={{ fontSize: '1rem', color: '#f8fafc', marginBottom: '16px', fontWeight: 700 }} className="heading-serif">
              AI System Formulation
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem' }} className="font-mono">
              <li style={{ color: '#cbd5e1' }}>• Text: TF-IDF + Logistic Regression (93.13% Acc)</li>
              <li style={{ color: '#cbd5e1' }}>• Vision: OpenAI CLIP ViT-B/32 (512d)</li>
              <li style={{ color: '#cbd5e1' }}>• Fusion: Reliability-Gated Baseline (Sigmoid α)</li>
              <li style={{ color: '#cbd5e1' }}>• Backend: FastAPI / SQLAlchemy / Render</li>
              <li style={{ color: '#cbd5e1' }}>• Database: PostgreSQL / SQLite</li>
            </ul>
          </div>

        </div>

        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.8rem',
          color: 'var(--text-dim)'
        }}>
          <div>
            © {new Date().getFullYear()} Truth Guard System. All research claims validated against held-out benchmark datasets.
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <NavLink to="/about" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Research Methodology</NavLink>
            <NavLink to="/contact" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Contact & Feedback</NavLink>
          </div>
        </div>

      </div>
    </footer>
  );
};
