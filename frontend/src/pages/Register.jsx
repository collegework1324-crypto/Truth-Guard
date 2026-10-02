import React, { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Register = ({ onNavigate }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, loading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(username, email, password, fullName);
      setSuccess(true);
      setTimeout(() => onNavigate('login'), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '60px auto', padding: '0 20px' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Create Account</h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Register to save personal analysis history
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

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            color: '#6ee7b7',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            Account registered successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">Password *</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading || success}>
            <UserPlus size={16} /> {loading ? 'Registering...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <span 
            onClick={() => onNavigate('login')} 
            style={{ color: 'var(--accent-cyan)', cursor: 'pointer', fontWeight: 600 }}
          >
            Sign In Here
          </span>
        </div>
      </div>
    </div>
  );
};
