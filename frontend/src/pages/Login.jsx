import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      onNavigate('workspace');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '60px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Sign In</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Access Truth Guard workspace and history
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            <LogIn size={16} /> {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <span 
            onClick={() => onNavigate('register')} 
            style={{ color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}
          >
            Register Here
          </span>
        </div>
      </div>
    </div>
  );
};
