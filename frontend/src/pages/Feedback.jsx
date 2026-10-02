import React from 'react';
import { MessageSquare, Star, CheckCircle } from 'lucide-react';

export const Feedback = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
          User Feedback & <span className="gradient-text">Model Refinement</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Direct ground truth corrections provided by domain experts and users to improve future model iterations.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '30px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MessageSquare size={18} color="#00f2fe" /> Active Feedback Loop
        </h3>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Feedback can be submitted directly from the Detection Workspace after analyzing any headline or media item.
          Each submission records your rating (1–5 stars), ground truth label, and qualitative notes into the <span className="font-mono">feedbacks</span> database table for research evaluation.
        </p>
      </div>
    </div>
  );
};
