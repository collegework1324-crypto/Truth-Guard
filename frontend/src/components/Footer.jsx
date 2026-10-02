import React from 'react';
import { Shield, GitBranch, Cpu, Terminal } from 'lucide-react';

export const Footer = () => {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-color)',
      background: 'rgba(5, 7, 12, 0.95)',
      padding: '36px 28px',
      marginTop: '60px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={18} color="#00f2fe" />
          <span><strong>Truth Guard</strong> v1.0.0 — Multimodal NLP & Reliability-Gated Deep Learning Research System</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="font-mono">
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GitBranch size={14} color="#6366f1" /> Architecture: FastAPI + React + SQLAlchemy
          </span>
          <a
            href="/api/v1/docs"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <Terminal size={14} /> Swagger OpenAPI Docs
          </a>
        </div>
      </div>
    </footer>
  );
};
