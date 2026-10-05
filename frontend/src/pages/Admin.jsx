import React, { useState, useEffect } from 'react';
import { ShieldAlert, BarChart2, Activity, Users, FileCheck, RefreshCw, Cpu, Database, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { getAdminMetrics } from '../api/client';

export const Admin = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await getAdminMetrics();
      setMetrics(data);
    } catch (err) {
      console.error("Failed to fetch admin metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="badge-info font-mono" style={{ display: 'inline-block', marginBottom: '8px' }}>
            ADMINISTRATIVE TELEMETRY
          </div>
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800 }} className="heading-serif">
            System Metrics & <span className="gradient-text">Model Status</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem' }}>
            Real-time telemetry, database entity counts, prediction distributions, and active model status.
          </p>
        </div>

        <button onClick={fetchMetrics} className="btn-secondary" style={{ padding: '10px 20px' }}>
          <RefreshCw size={16} /> Refresh Telemetry
        </button>
      </div>

      {/* MODEL STATUS AUDIT PANEL (MANDATORY REQUIREMENT) */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }} className="heading-serif">
          <Cpu size={20} color="#00f2fe" /> Model Readiness Audit
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          <div style={{ background: 'rgba(12, 19, 36, 0.7)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>NLP Text Model</span>
              <span className="badge-real" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>READY</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>TF-IDF + Logistic Regression (93.13% Acc)</p>
          </div>

          <div style={{ background: 'rgba(12, 19, 36, 0.7)', border: '1px solid rgba(0, 242, 254, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Vision CLIP Encoder</span>
              <span className="badge-info" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>READY</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>OpenAI CLIP ViT-B/32 512d Alignment</p>
          </div>

          <div style={{ background: 'rgba(12, 19, 36, 0.7)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Learned Multimodal Fusion</span>
              <span style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
                NOT PRODUCTION READY
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Synthetic artifact disabled; dataset pending</p>
          </div>

          <div style={{ background: 'rgba(12, 19, 36, 0.7)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>Current Production Fusion</span>
              <span style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
                RELIABILITY GATE
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sigmoid dynamic weighting baseline</p>
          </div>

        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <RefreshCw className="animate-spin" size={32} color="var(--accent-cyan)" />
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Querying database telemetry...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }} className="font-mono">Total Analyses</span>
              <FileCheck size={22} color="#00f2fe" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800 }} className="font-mono">
              {metrics?.total_analyses ?? 0}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }} className="font-mono">REAL vs FAKE Split</span>
              <BarChart2 size={22} color="#4facfe" />
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', gap: '20px' }} className="font-mono">
              <span style={{ color: '#10b981' }}>R: {metrics?.real_predictions ?? 0}</span>
              <span style={{ color: '#ef4444' }}>F: {metrics?.fake_predictions ?? 0}</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }} className="font-mono">Avg Processing Latency</span>
              <Activity size={22} color="#a855f7" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-purple)' }} className="font-mono">
              {metrics?.avg_processing_time_ms ?? 0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ms</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }} className="font-mono">Registered Users</span>
              <Users size={22} color="#6366f1" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800 }} className="font-mono">
              {metrics?.total_users ?? 0}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
