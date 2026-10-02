import React from 'react';
import { Shield, LayoutDashboard, History as HistoryIcon, MessageSquare, ShieldAlert, Info, LogIn, LogOut } from 'lucide-react';
import { HealthStatusBadge } from './HealthStatusBadge';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'home', label: 'Home', icon: Shield },
    { id: 'workspace', label: 'Detection Workspace', icon: LayoutDashboard },
    { id: 'history', label: 'Analysis History', icon: HistoryIcon },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'admin', label: 'Admin Metrics', icon: ShieldAlert },
    { id: 'about', label: 'About & Research', icon: Info },
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(7, 9, 14, 0.85)',
      backdropFilter: 'blur(20px)',
      sticky: 'top',
      top: 0,
      zIndex: 100,
      padding: '12px 28px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Logo & Brand */}
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)'
          }}>
            <Shield size={22} color="#000" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              TRUTH <span className="gradient-text">GUARD</span>
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Multimodal AI Fake News Detection
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '1px solid var(--border-glow)' : '1px solid transparent',
                  background: isActive ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                  color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Health Status & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <HealthStatusBadge />
          
          {user ? (
            <button 
              onClick={logout} 
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            >
              <LogOut size={14} /> Logout ({user.username})
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab('login')} 
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              <LogIn size={14} /> Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
