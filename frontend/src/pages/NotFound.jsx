import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, FileQuestion } from 'lucide-react';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      maxWidth: '800px',
      margin: '80px auto',
      padding: '0 24px',
      textAlign: 'center'
    }}>
      <div className="glass-panel" style={{ padding: '60px 40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'rgba(0, 242, 254, 0.1)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          marginBottom: '24px'
        }}>
          <FileQuestion size={40} color="var(--accent-cyan)" />
        </div>

        <div className="badge-info font-mono" style={{ display: 'inline-block', marginBottom: '12px' }}>
          404 ERROR — PAGE NOT FOUND
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px' }} className="heading-serif">
          Route Not Located
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
          The verification coordinate you requested does not exist or may have been repositioned within the Truth Guard registry.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate(-1)} className="btn-secondary" style={{ padding: '12px 24px' }}>
            <ArrowLeft size={16} /> Go Back
          </button>
          <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 28px' }}>
            <Home size={16} /> Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};
