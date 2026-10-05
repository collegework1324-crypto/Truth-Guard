import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, LayoutDashboard, History as HistoryIcon, MessageSquare, ShieldAlert, Info, LogIn, LogOut, Sparkles, Mail, Menu, X } from 'lucide-react';
import { HealthStatusBadge } from './HealthStatusBadge';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const publicNavItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/features', label: 'Features' },
    { path: '/detection', label: 'Detection' },
    { path: '/feedback', label: 'Feedback' },
    { path: '/contact', label: 'Contact' },
  ];

  const authNavItems = [
    { path: '/history', label: 'History' },
    { path: '/admin', label: 'Admin' },
  ];

  const navItems = user ? [...publicNavItems, ...authNavItems] : publicNavItems;

  return (
    <header style={{
      borderBottom: '1px solid rgba(0, 242, 254, 0.18)',
      background: 'rgba(4, 7, 17, 0.88)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      position: 'sticky',
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
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.45)'
          }}>
            <Shield size={22} color="#040711" strokeWidth={2.8} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }} className="heading-serif">
              TRUTH <span className="gradient-text">GUARD</span>
            </h1>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Multimodal 3D AI Analysis
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              style={({ isActive }) => ({
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                border: isActive ? '1px solid rgba(0, 242, 254, 0.35)' : '1px solid transparent',
                background: isActive ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '0.9rem',
                fontWeight: isActive ? 700 : 500,
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Section: Health Status & Auth */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <HealthStatusBadge />
          
          {user ? (
            <button 
              onClick={logout} 
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            >
              <LogOut size={14} /> Sign Out ({user.username})
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <NavLink 
                to="/auth" 
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.82rem', textDecoration: 'none' }}
              >
                <LogIn size={14} /> Sign In
              </NavLink>
              <NavLink 
                to="/auth?tab=register" 
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.82rem', textDecoration: 'none' }}
              >
                Get Started
              </NavLink>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-secondary mobile-nav-toggle"
            style={{ padding: '8px', display: 'none' }}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          padding: '16px 0 8px 0',
          borderTop: '1px solid var(--border-color)',
          marginTop: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-main)',
                background: isActive ? 'rgba(0, 242, 254, 0.1)' : 'transparent',
                textDecoration: 'none',
                fontWeight: 600
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
};
