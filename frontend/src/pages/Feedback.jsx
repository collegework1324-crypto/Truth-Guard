import React, { useState } from 'react';
import { MessageSquare, Star, CheckCircle2, AlertCircle, RefreshCw, Send, Tag } from 'lucide-react';
import { submitFeedback } from '../api/client';

export const Feedback = () => {
  const [category, setCategory] = useState('Classification Quality');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Classification Quality',
    'NLP Model Accuracy',
    'Visual Semantic Alignment',
    'Explanations & Transparency',
    'Feature Suggestion',
    'Other Inquiries'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!message.trim() || message.trim().length < 5) {
      setError('Please provide feedback of at least 5 characters.');
      return;
    }

    setLoading(true);
    try {
      await submitFeedback({
        analysis_id: null,
        category,
        rating,
        user_label: rating >= 4 ? 'SATISFIED' : 'NEEDS_IMPROVEMENT',
        comments: message.trim()
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Feedback submission error:', err);
      setError(err.response?.data?.detail || 'Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessage('');
    setRating(5);
    setCategory('Classification Quality');
    setSubmitted(false);
    setError(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <div className="badge-info font-mono" style={{ display: 'inline-block', marginBottom: '12px' }}>
          USER & RESEARCH EVALUATION
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }} className="heading-serif">
          User Feedback & <span className="gradient-text">Model Refinement</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '10px auto 0 auto' }}>
          Direct ground truth reviews and qualitative observations from domain experts and users to evaluate detection reliability.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
        gap: '32px'
      }}>
        
        {/* LEFT PANEL: FEEDBACK SUBMISSION FORM */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }} className="heading-serif">
            <MessageSquare size={20} color="#00f2fe" /> Submit Ground Truth Feedback
          </h2>

          {submitted ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              color: 'var(--status-real)',
              textAlign: 'center'
            }}>
              <CheckCircle2 size={40} style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }} className="heading-serif">Feedback Saved to Database</h3>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '16px' }}>
                Thank you! Your feedback has been persistently stored and will be utilized in subsequent evaluation benchmarks.
              </p>
              <button onClick={handleReset} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.85rem' }}>
                Submit Another Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Feedback Category *</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} style={{ background: '#0a101e', color: '#fff' }}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Rating (1 to 5 Stars)</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <Star
                        size={24}
                        color={star <= rating ? '#fbbf24' : '#475569'}
                        fill={star <= rating ? '#fbbf24' : 'transparent'}
                      />
                    </button>
                  ))}
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginLeft: '10px' }} className="font-mono">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label">Your Observations / Comments *</label>
                <textarea
                  className="form-textarea"
                  placeholder="Detail your observations regarding detection veracity, false positive patterns, or suggestions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.4)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  color: '#f87171',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.9rem'
                }}>
                  <AlertCircle size={18} />
                  <span>{error}</span>
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={16} /> Submitting Feedback...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Submit Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* RIGHT PANEL: RESEARCH INFO */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '20px' }} className="heading-serif">
            Research Evaluation Protocol
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
            <p>
              In academic misinformation research, model evaluation relies on constant validation against real-world shifts in disinformation tactics (domain drift).
            </p>
            <div style={{ background: 'rgba(12, 19, 36, 0.7)', border: '1px solid var(--border-cyan)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <strong style={{ color: 'var(--accent-cyan)' }}>Database Storage:</strong>
              <p style={{ marginTop: '4px', fontSize: '0.86rem' }}>
                All submissions are written to the database table with timestamp, user ID (if authenticated), assigned category, rating, and feedback payload.
              </p>
            </div>
            <div style={{ background: 'rgba(12, 19, 36, 0.7)', border: '1px solid var(--border-cyan)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
              <strong style={{ color: '#4facfe' }}>Workspace In-line Feedback:</strong>
              <p style={{ marginTop: '4px', fontSize: '0.86rem' }}>
                You can also rate individual predictions directly from the Detection Workspace immediately after running an analysis.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
