import React, { useState, useEffect } from 'react';
import { ShieldAlert, BarChart2, Activity, Users, FileCheck, RefreshCw } from 'lucide-react';
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
            System <span className="gradient-text">Metrics & Monitoring</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Real-time telemetry, database entity counts, prediction distributions, and average processing latency.
          </p>
        </div>

        <button onClick={fetchMetrics} className="btn-secondary" style={{ padding: '8px 14px' }}>
          <RefreshCw size={14} /> Refresh Metrics
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <RefreshCw className="animate-spin" size={32} color="var(--accent-cyan)" />
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Querying system telemetry...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Analyses</span>
              <FileCheck size={20} color="#00f2fe" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }} className="font-mono">
              {metrics?.total_analyses ?? 0}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>REAL vs FAKE Split</span>
              <BarChart2 size={20} color="#4facfe" />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', gap: '16px' }} className="font-mono">
              <span style={{ color: '#10b981' }}>R: {metrics?.real_predictions ?? 0}</span>
              <span style={{ color: '#ef4444' }}>F: {metrics?.fake_predictions ?? 0}</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Avg Latency</span>
              <Activity size={20} color="#a855f7" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-purple)' }} className="font-mono">
              {metrics?.avg_processing_time_ms ?? 0} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>ms</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Registered Users</span>
              <Users size={20} color="#6366f1" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800 }} className="font-mono">
              {metrics?.total_users ?? 0}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
