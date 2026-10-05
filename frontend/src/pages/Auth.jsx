import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TruthGuardCore3D } from '../components/3d/TruthGuardCore3D';

export const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialTab = searchParams.get('tab') === 'register' ? 'register' : 'login';

  const [activeTab, setActiveTab] = useState(initialTab);

  // Form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const { login, register, loading, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/detection');
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(loginUsername, loginPassword);
      navigate('/detection');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await register(regUsername, regEmail, regPassword, regFullName);
      setRegSuccess(true);
      setTimeout(() => {
        setRegSuccess(false);
        setActiveTab('login');
        setLoginUsername(regUsername);
      }, 1400);
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px' }}>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '40px',
        alignItems: 'center'
      }}>
        
        {/* LEFT SIDE: 3D VISUALIZATION */}
        <div style={{ textAlign: 'center' }}>
          <div className="badge-info font-mono" style={{ display: 'inline-block', marginBottom: '16px' }}>
            SECURE ACCESS CONTROLS
          </div>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '12px' }} className="heading-serif">
            Truth Guard <span className="gradient-text">Authentication</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', maxWidth: '440px', margin: '0 auto 20px auto' }}>
            Sign in to access your detection workspace, view complete analysis history, and save personal research benchmarks.
          </p>
          <TruthGuardCore3D height="420px" interactive={true} />
        </div>

        {/* RIGHT SIDE: GLASS AUTH CARD WITH TABS */}
        <div className="glass-panel" style={{ padding: '40px' }}>
          
          {/* TABS HEADER */}
          <div style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-color)',
            marginBottom: '28px'
          }}>
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); }}
              style={{
                flex: 1,
                padding: '14px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'login' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: activeTab === 'login' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="heading-serif"
            >
              SIGN IN
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setError(''); }}
              style={{
                flex: 1,
                padding: '14px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'register' ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                color: activeTab === 'register' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="heading-serif"
            >
              CREATE ACCOUNT
            </button>
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              fontSize: '0.88rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {regSuccess && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              color: '#6ee7b7',
              fontSize: '0.88rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={18} />
              <span>Account created successfully! Switching to Sign In...</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter your username..."
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Enter password..."
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{ width: '100%', paddingRight: '44px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                <LogIn size={18} /> {loading ? 'Signing In...' : 'Sign In to Truth Guard'}
              </button>
            </form>
          )}

          {/* SIGN UP FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dr. Jane Doe..."
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Username *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Choose username..."
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@institution.org..."
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="At least 6 characters..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    style={{ width: '100%', paddingRight: '44px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label className="form-label">Confirm Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Re-enter password..."
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading || regSuccess}>
                <UserPlus size={18} /> {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
