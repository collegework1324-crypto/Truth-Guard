import React, { useState, useEffect } from 'react';
import { Activity, Database, Cpu, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { checkHealth } from '../api/client';

export const HealthStatusBadge = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await checkHealth();
      setHealth(data);
      setError(null);
    } catch (err) {
      setError("Backend Offline");
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000); // Ping every 15s
    return () => clearInterval(interval);
  }, []);

  if (loading && !health && !error) {
    return (
      <div className="badge-info flex items-center gap-2" style={{ padding: '6px 12px' }}>
        <RefreshCw className="animate-spin" size={14} />
        <span>Connecting to Backend...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="badge-fake flex items-center gap-2" style={{ padding: '6px 12px' }}>
        <AlertTriangle size={14} />
        <span>Backend Disconnected</span>
      </div>
    );
  }

  return (
    <div 
      className="glass-panel" 
      style={{ 
        padding: '6px 14px', 
        fontSize: '0.82rem', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '12px',
        border: '1px solid rgba(0, 242, 254, 0.25)',
        background: 'rgba(10, 15, 28, 0.8)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ 
          width: '8px', 
          height: '8px', 
          borderRadius: '50%', 
          backgroundColor: health?.status === 'healthy' ? '#10b981' : '#f59e0b',
          boxShadow: health?.status === 'healthy' ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
        }} />
        <span style={{ fontWeight: 600, color: '#f8fafc' }}>
          {health?.status === 'healthy' ? 'System Operational' : 'Degraded State'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#94a3b8' }} className="font-mono">
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Database Status">
          <Database size={13} color="#00f2fe" /> DB: {health?.database?.engine || 'SQLite'}
        </span>
        <span>|</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }} title="Gated Fusion Engine Status">
          <Cpu size={13} color="#a855f7" /> Fusion: Ready
        </span>
      </div>
    </div>
  );
};
