import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, Shield, Globe, MessageSquare, BookOpen } from 'lucide-react';

export const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <div className="badge-info font-mono" style={{ display: 'inline-block', marginBottom: '12px' }}>
          RESEARCH & COLLABORATION
        </div>
        <h1 style={{ fontSize: '3.2rem', fontWeight: 800 }} className="heading-serif">
          Contact <span className="gradient-text">Truth Guard Team</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '680px', margin: '14px auto 0 auto' }}>
          Reach out for research inquiries, empirical dataset benchmarking, or system feedback.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
        gap: '32px'
      }}>
        
        {/* LEFT INFO PANEL */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }} className="heading-serif">
            Project Information
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.95rem' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(0, 242, 254, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <Shield size={20} color="#00f2fe" />
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Truth Guard AI Misinformation Project</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
                  Multimodal Fake News Detection System Using NLP & Computer Vision.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(79, 172, 254, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <Mail size={20} color="#4facfe" />
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Research & Dataset Inquiries</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }} className="font-mono">
                  truthguard.research@gmail.com
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ background: 'rgba(168, 85, 247, 0.12)', padding: '10px', borderRadius: '10px' }}>
                <Globe size={20} color="#a855f7" />
              </div>
              <div>
                <strong style={{ color: '#fff' }}>Production & Deployment</strong>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
                  Hosted on Render cloud backend with PostgreSQL & Vite Vercel SPA frontend.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTACT FORM */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }} className="heading-serif">
            Send Research Inquiry
          </h2>

          {sent ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--status-real)',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }} className="heading-serif">Inquiry Received</h3>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
                Thank you for contacting Truth Guard. Our research team will review your message.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dr. Alex Rivera..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="alex@research-inst.org..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dataset feedback / Research inquiry..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Message *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Type your message or ground truth inquiry here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <Send size={16} /> Send Inquiry
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
