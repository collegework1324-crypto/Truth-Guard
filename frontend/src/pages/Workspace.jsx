import React, { useState } from 'react';
import { 
  Send, Upload, Image as ImageIcon, Video, FileText, CheckCircle2, 
  XCircle, AlertCircle, Cpu, RefreshCw, ThumbsUp, ThumbsDown, HelpCircle, 
  ChevronDown, ChevronUp, Info, ShieldCheck, Layers, Sparkles, X, Activity
} from 'lucide-react';
import { analyzeMultimodal, submitFeedback } from '../api/client';
import { TruthGuardCore3D } from '../components/3d/TruthGuardCore3D';

export const Workspace = () => {
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [processingStage, setProcessingStage] = useState('Preparing input');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Expandable details toggle
  const [showDetails, setShowDetails] = useState(false);

  // Feedback state
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackComments, setFeedbackComments] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError('Image file size exceeds maximum limit of 15MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError('Video file size exceeds maximum limit of 50MB.');
        return;
      }
      setVideoFile(file);
      setError(null);
    }
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!headline.trim()) {
      setError('Please enter a news headline to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setFeedbackSent(false);
    setFeedbackComments('');
    setProcessingStage('Preparing input and parsing text claims...');

    try {
      const formData = new FormData();
      formData.append('headline', headline);
      if (body.trim()) formData.append('body', body);
      if (imageFile) formData.append('image', imageFile);
      if (videoFile) formData.append('video', videoFile);

      setProcessingStage('Extracting TF-IDF text features & CLIP image embeddings...');
      const responseData = await analyzeMultimodal(formData);

      setProcessingStage('Applying dynamic reliability gate & synthesizing verdict...');
      setTimeout(() => {
        setResult(responseData);
        setLoading(false);
      }, 400);

    } catch (err) {
      const detailMsg = err.response?.data?.detail;
      if (typeof detailMsg === 'string') {
        setError(detailMsg);
      } else if (Array.isArray(detailMsg)) {
        setError(detailMsg.map(d => d.msg).join(', '));
      } else {
        setError('Analysis request failed. Please verify your backend server connection.');
      }
      setLoading(false);
    }
  };

  const handleSendFeedback = async (rating, userLabel) => {
    if (!result) return;
    try {
      await submitFeedback({
        analysis_id: result.id,
        rating: rating,
        user_label: userLabel,
        comments: feedbackComments || null
      });
      setFeedbackSent(true);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  };

  const getFusionMethodLabel = (methodKey) => {
    switch (methodKey) {
      case 'reliability_gated_baseline':
        return 'Reliability-Gated Multimodal Fusion';
      case 'text_only_baseline':
        return 'Text-Only Supervised ML Pipeline';
      case 'trainable_logistic_regression':
        return 'Trainable Multimodal Fusion';
      default:
        return 'Reliability-Gated Multimodal Fusion';
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 24px' }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '36px', textAlign: 'center' }}>
        <div className="badge-info font-mono" style={{ display: 'inline-block', marginBottom: '12px' }}>
          3D DETECTION WORKSPACE
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }} className="heading-serif">
          TRUTH GUARD <span className="gradient-text">DETECTION WORKSPACE</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.08rem', maxWidth: '680px', margin: '10px auto 0 auto' }}>
          Analyze news claims using supervised NLP text classification and OpenAI CLIP vision-language semantic alignment.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '32px' }}>
        
        {/* INPUT FORM PANEL */}
        <div className="glass-panel" style={{ padding: '36px', alignSelf: 'start' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }} className="heading-serif">
            <FileText size={22} color="#00f2fe" /> Modality Input Specification
          </h2>

          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label className="form-label">News Headline / Claim Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Paste news headline or textual claim..."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Article Description / Body (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Paste supporting article text or full news context..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            {/* Media Upload Box Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              
              {/* Image Upload Box */}
              <div style={{
                border: imageFile ? '1px solid var(--accent-cyan)' : '1px dashed var(--border-cyan)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
                background: imageFile ? 'rgba(0, 242, 254, 0.06)' : 'rgba(12, 19, 36, 0.5)',
                position: 'relative'
              }}>
                {!imagePreview ? (
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <ImageIcon size={28} color="#00f2fe" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Image Modality</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>JPG, PNG, WebP</div>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                ) : (
                  <div>
                    <div style={{ position: 'relative', width: '100%', height: '120px', marginBottom: '8px', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(0, 0, 0, 0.8)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '26px',
                          height: '26px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--accent-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="font-mono">
                      {imageFile.name}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Upload Box */}
              <div style={{
                border: videoFile ? '1px solid #a855f7' : '1px dashed var(--border-cyan)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
                background: videoFile ? 'rgba(168, 85, 247, 0.06)' : 'rgba(12, 19, 36, 0.5)',
                position: 'relative'
              }}>
                {!videoFile ? (
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <Video size={28} color="#a855f7" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>Video Modality</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>MP4, WebM</div>
                    <input type="file" accept="video/*" onChange={handleVideoChange} style={{ display: 'none' }} />
                  </label>
                ) : (
                  <div>
                    <div style={{ padding: '24px 8px', background: 'rgba(168, 85, 247, 0.12)', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }}>
                      <Video size={32} color="#c084fc" style={{ margin: '0 auto' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <span style={{ fontSize: '0.76rem', color: '#c084fc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} className="font-mono">
                        {videoFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

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

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  <span>ANALYZE WITH TRUTH GUARD...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>ANALYZE WITH TRUTH GUARD</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RESULTS / DETECTING OUTPUT PANEL */}
        <div className="glass-panel" style={{ padding: '36px' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }} className="heading-serif">
            <Cpu size={22} color="#a855f7" /> TRUTH GUARD RESULT
          </h2>

          {!result && !loading && (
            <div style={{
              height: '420px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              textAlign: 'center',
              border: '1px dashed var(--border-cyan)',
              borderRadius: 'var(--radius-md)',
              padding: '24px'
            }}>
              <Layers size={52} strokeWidth={1.2} style={{ marginBottom: '16px', opacity: 0.35, color: '#00f2fe' }} />
              <p style={{ fontWeight: 700, fontSize: '1.1rem' }} className="heading-serif">No Analysis Executed Yet</p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', maxWidth: '340px', marginTop: '8px', lineHeight: 1.6 }}>
                Submit news claim headline and optional media on the left to invoke the NLP & CLIP multimodal detection pipeline.
              </p>
            </div>
          )}

          {loading && (
            <div style={{
              minHeight: '420px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '20px',
              padding: '20px'
            }}>
              <TruthGuardCore3D height="240px" interactive={false} />
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', color: 'var(--accent-cyan)', fontWeight: 700 }} className="font-mono">
                  <Activity size={16} className="animate-spin" /> {processingStage}
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '8px' }} className="font-mono">
                  Text Signal → TRUTH CORE ← Visual Signal
                </p>
              </div>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* 1. MAIN RESULT SCORE CARD */}
              <div style={{
                background: result.prediction === 'REAL' ? 'rgba(16, 185, 129, 0.09)' : 'rgba(239, 68, 68, 0.09)',
                border: `1px solid ${result.prediction === 'REAL' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }} className="font-mono">
                      VERDICT OUTPUT
                    </div>
                    <div className={result.prediction === 'REAL' ? 'badge-real' : 'badge-fake'} style={{ fontSize: '1.4rem', padding: '8px 22px', marginTop: '6px' }}>
                      {result.prediction === 'REAL' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                      <span>{result.prediction}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }} className="font-mono">
                      CONFIDENCE
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 800, color: result.prediction === 'REAL' ? '#10b981' : '#ef4444' }} className="font-mono">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-bg" style={{ marginBottom: '14px' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${Math.max(result.confidence * 100, 5)}%`,
                      background: result.prediction === 'REAL' ? 'var(--status-real)' : 'var(--status-fake)'
                    }} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }} className="font-mono">
                  <span>Processing Latency: {result.processing_time_ms} ms</span>
                  <span>Active Modalities: {result.modalities_used?.join(', ')}</span>
                </div>
              </div>

              {/* 2. MODALITY BREAKDOWN GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                
                {/* TEXT SIGNAL CARD */}
                <div style={{ background: 'rgba(12, 19, 36, 0.7)', border: '1px solid rgba(0, 242, 254, 0.2)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '6px' }} className="font-mono">
                    TEXT SIGNAL
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Fake Probability: <strong className="font-mono" style={{ color: '#fff' }}>{((result.text_signal?.fake_score ?? 0) * 100).toFixed(1)}%</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    Model: TF-IDF + Logistic Regression
                  </div>
                </div>

                {/* VISUAL SIGNAL CARD */}
                <div style={{ background: 'rgba(12, 19, 36, 0.7)', border: '1px solid rgba(79, 172, 254, 0.2)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#4facfe', fontWeight: 700, marginBottom: '6px' }} className="font-mono">
                    VISUAL SIGNAL (CLIP)
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    Available: <strong className="font-mono">{result.visual_signal?.available ? 'Yes' : 'No'}</strong>
                  </div>
                  {result.visual_signal?.available && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }} className="font-mono">
                      Cosine Sim: {result.visual_signal.image_text_similarity?.toFixed(4)} | Align: {result.visual_signal.alignment_signal?.toFixed(4)}
                    </div>
                  )}
                </div>

              </div>

              {/* 3. FUSION GATE & EXPLANATION PANEL */}
              <div style={{
                background: 'rgba(10, 16, 30, 0.85)',
                border: '1px solid var(--border-cyan)',
                borderRadius: 'var(--radius-md)',
                padding: '20px'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }} className="heading-serif">
                  <ShieldCheck size={18} color="#00f2fe" /> Fusion Method & Verdict Explanation
                </h3>

                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: '0.84rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fusion Strategy:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {getFusionMethodLabel(result.fusion_method)}
                    {result.fusion_gate_alpha !== null && (
                      <span className="font-mono" style={{ marginLeft: '8px', color: '#a855f7' }}>
                        (Gate α = {result.fusion_gate_alpha})
                      </span>
                    )}
                  </span>
                </div>

                <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#cbd5e1' }}>
                  {result.explanation}
                </p>
              </div>

              {/* 4. MANDATORY CLIP DISCLAIMER NOTICE */}
              {result.visual_signal?.available && (
                <div style={{
                  background: 'rgba(0, 242, 254, 0.05)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  fontSize: '0.86rem',
                  color: '#cbd5e1',
                  lineHeight: 1.6,
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <Info size={18} color="#00f2fe" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>
                    <strong>Mandatory Research Transparency Notice:</strong> Semantic alignment measures how well the uploaded image relates to the submitted text. It does not determine whether the image is authentic, manipulated, or true.
                  </span>
                </div>
              )}

              {/* 5. FEEDBACK SECTION */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Was this analysis useful?
                </div>

                {feedbackSent ? (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--status-real)',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={18} /> Thank you! Your ground truth review has been saved in database.
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                      <button 
                        type="button"
                        onClick={() => handleSendFeedback(5, 'REAL')} 
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                      >
                        <ThumbsUp size={15} color="#10b981" /> Correct
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleSendFeedback(1, 'FAKE')} 
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                      >
                        <ThumbsDown size={15} color="#ef4444" /> Incorrect
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleSendFeedback(3, 'UNCERTAIN')} 
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.84rem' }}
                      >
                        <HelpCircle size={15} color="#f59e0b" /> Uncertain
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Optional feedback notes or ground truth observations..."
                        value={feedbackComments}
                        onChange={(e) => setFeedbackComments(e.target.value)}
                        style={{ fontSize: '0.84rem', padding: '8px 14px' }}
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
