import React, { useState, useEffect } from 'react';
import { RefreshCw, Server, Database, Cpu, Shield, AlertCircle } from 'lucide-react';
import { checkHealth } from '../api/client';
import { TruthGuardCore3D } from './3d/TruthGuardCore3D';

export const RenderWakeupOverlay = ({ children }) => {
  const [status, setStatus] = useState('checking'); // 'checking', 'waking', 'ready', 'timeout'
  const [step, setStep] = useState(1);
  const [retryCount, setRetryCount] = useState(0);

  const checkBackendHealth = async () => {
    try {
      setStep(1); // Connecting to API
      const healthData = await checkHealth();
      
      if (healthData && (healthData.status === 'healthy' || healthData.status === 'degraded')) {
        setStep(4); // Ready
        setTimeout(() => {
          setStatus('ready');
        }, 600);
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    let isMounted = true;
    let timerId = null;
    let attempts = 0;
    const maxAttempts = 12; // 12 * 4s = 48 seconds max retry window

    const runHealthCheckLoop = async () => {
      const isSuccess = await checkBackendHealth();
      if (isSuccess || !isMounted) return;

      // Backend waking up
      setStatus('waking');

      const interval = setInterval(async () => {
        if (!isMounted) return;
        attempts += 1;
        setRetryCount(attempts);

        if (attempts <= 3) setStep(1); // Connecting to API
        else if (attempts <= 6) setStep(2); // Connecting to database
        else setStep(3); // Loading detection engine

        const success = await checkBackendHealth();
        if (success) {
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setStatus('timeout');
        }
      }, 4000);

      timerId = interval;
    };

    runHealthCheckLoop();

    return () => {
      isMounted = false;
      if (timerId) clearInterval(timerId);
    };
  }, []);

  const handleManualRetry = () => {
    setStatus('waking');
    setRetryCount(0);
    setStep(1);
    checkBackendHealth().then((ok) => {
      if (!ok) {
        // restart loop
        window.location.reload();
      }
    });
  };

  if (status === 'ready') {
    return <>{children}</>;
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(4, 7, 17, 0.96)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      color: '#f8fafc'
    }}>
      <div style={{ width: '100%', maxWidth: '640px', textAlign: 'center' }}>
        
        {/* 3D Visual in Loading overlay */}
        <div style={{ height: '260px', marginBottom: '20px' }}>
          <TruthGuardCore3D height="260px" interactive={false} />
        </div>

        {status === 'timeout' ? (
          <div className="glass-panel" style={{ padding: '36px' }}>
            <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 16px auto' }} />
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '10px' }} className="heading-serif">
              Truth Guard Engine Timeout
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
              The Render backend is taking longer than expected to respond to the initial health check.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
              <button onClick={handleManualRetry} className="btn-primary">
                <RefreshCw size={16} /> Retry Health Check
              </button>
              <button onClick={() => setStatus('ready')} className="btn-secondary">
                Continue to App
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }} className="heading-serif">
              Truth Guard is <span className="gradient-text">waking up</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '28px' }}>
              Starting the AI detection engine and loading NLP & CLIP models on Render cloud server...
            </p>

            {/* Health Check Status Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left', marginBottom: '28px' }}>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                background: step >= 1 ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: step >= 1 ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid transparent',
                color: step >= 1 ? '#00f2fe' : 'var(--text-dim)'
              }}>
                <Server size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, flex: 1 }}>1. Connecting to API Endpoint</span>
                {step === 1 && <RefreshCw size={14} className="animate-spin" />}
                {step > 1 && <span>✓</span>}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                background: step >= 2 ? 'rgba(79, 172, 254, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: step >= 2 ? '1px solid rgba(79, 172, 254, 0.3)' : '1px solid transparent',
                color: step >= 2 ? '#4facfe' : 'var(--text-dim)'
              }}>
                <Database size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, flex: 1 }}>2. Connecting to PostgreSQL Database</span>
                {step === 2 && <RefreshCw size={14} className="animate-spin" />}
                {step > 2 && <span>✓</span>}
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                background: step >= 3 ? 'rgba(168, 85, 247, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                border: step >= 3 ? '1px solid rgba(168, 85, 247, 0.3)' : '1px solid transparent',
                color: step >= 3 ? '#a855f7' : 'var(--text-dim)'
              }}>
                <Cpu size={18} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, flex: 1 }}>3. Initializing NLP & Vision Detection Engine</span>
                {step === 3 && <RefreshCw size={14} className="animate-spin" />}
                {step > 3 && <span>✓</span>}
              </div>

            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
              Attempt {retryCount + 1} of 12 • Render cold starts typically complete in 15–30s
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
