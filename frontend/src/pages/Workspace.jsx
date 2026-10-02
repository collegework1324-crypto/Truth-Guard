import React, { useState } from 'react';
import { 
  Send, Upload, Image as ImageIcon, Video, FileText, CheckCircle2, 
  XCircle, AlertCircle, Cpu, RefreshCw, ThumbsUp, ThumbsDown, HelpCircle, 
  ChevronDown, ChevronUp, Info, ShieldCheck, Layers, Sparkles, X
} from 'lucide-react';
import { analyzeMultimodal, submitFeedback } from '../api/client';

export const Workspace = () => {
  const [headline, setHeadline] = useState('');
  const [body, setBody] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Expandable details toggle
  const [showDetails, setShowDetails] = useState(false);

  // Feedback state
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);

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
    setSelectedRating(null);
    setFeedbackComments('');

    try {
      const formData = new FormData();
      formData.append('headline', headline);
      if (body.trim()) formData.append('body', body);
      if (imageFile) formData.append('image', imageFile);
      if (videoFile) formData.append('video', videoFile);

      const responseData = await analyzeMultimodal(formData);
      setResult(responseData);
    } catch (err) {
      const detailMsg = err.response?.data?.detail;
      if (typeof detailMsg === 'string') {
        setError(detailMsg);
      } else if (Array.isArray(detailMsg)) {
        setError(detailMsg.map(d => d.msg).join(', '));
      } else {
        setError('Analysis request failed. Please check your backend connection.');
      }
    } finally {
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
      setSelectedRating(rating);
      setFeedbackSent(true);
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  };

  // Helper to map fusion_method to human readable title
  const getFusionMethodLabel = (methodKey) => {
    switch (methodKey) {
      case 'reliability_gated_baseline':
        return 'Reliability-Gated Multimodal Fusion';
      case 'text_only_baseline':
        return 'Text-Only ML Pipeline';
      case 'trainable_logistic_regression':
        return 'Trainable Multimodal Fusion';
      default:
        return 'Reliability-Gated Multimodal Fusion';
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '30px 20px' }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, marginBottom: '8px' }}>
          Multimodal <span className="gradient-text">Fake News Detection</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem' }}>
          Analyze textual content and optional media using NLP and vision-language analysis.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '30px' }}>
        
        {/* INPUT FORM PANEL */}
        <div className="glass-panel" style={{ padding: '30px', alignSelf: 'start' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="#00f2fe" /> Content Modality Inputs
          </h2>

          <form onSubmit={handleAnalyze}>
            <div className="form-group">
              <label className="form-label">
                <span>News Headline *</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Paste news headline or claim title..."
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Article Description / Body (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Paste full news body text or article content for context..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>

            {/* Media Upload Box Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              
              {/* Image Upload Box */}
              <div style={{
                border: imageFile ? '1px solid var(--accent-cyan)' : '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                textAlign: 'center',
                background: imageFile ? 'rgba(0, 242, 254, 0.05)' : 'rgba(15, 23, 42, 0.4)',
                position: 'relative'
              }}>
                {!imagePreview ? (
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <ImageIcon size={26} color="#4facfe" style={{ margin: '0 auto 6px auto' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Image Modality</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>JPG, PNG, WebP</div>
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                  </label>
                ) : (
                  <div>
                    <div style={{ position: 'relative', width: '100%', height: '110px', marginBottom: '8px', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                      <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(0, 0, 0, 0.75)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        title="Remove image"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {imageFile.name}
                    </div>
                  </div>
                )}
              </div>

              {/* Video Upload Box */}
              <div style={{
                border: videoFile ? '1px solid #a855f7' : '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                textAlign: 'center',
                background: videoFile ? 'rgba(168, 85, 247, 0.05)' : 'rgba(15, 23, 42, 0.4)',
                position: 'relative'
              }}>
                {!videoFile ? (
                  <label style={{ cursor: 'pointer', display: 'block' }}>
                    <Video size={26} color="#a855f7" style={{ margin: '0 auto 6px auto' }} />
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Video Modality</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>MP4, WebM</div>
                    <input type="file" accept="video/*" onChange={handleVideoChange} style={{ display: 'none' }} />
                  </label>
                ) : (
                  <div>
                    <div style={{ padding: '20px 8px', background: 'rgba(168, 85, 247, 0.1)', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }}>
                      <Video size={30} color="#c084fc" style={{ margin: '0 auto' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#c084fc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {videoFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveVideo}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Remove video"
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
                  <span>Analyzing Headline & CLIP Media Alignment...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Analyze News Authenticity</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RESULTS PANEL */}
        <div className="glass-panel" style={{ padding: '30px' }}>
          <h2 style={{ fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Cpu size={20} color="#a855f7" /> Detection Output & Evidence
          </h2>

          {!result && !loading && (
            <div style={{
              height: '360px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              textAlign: 'center',
              border: '1px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '20px'
            }}>
              <Layers size={44} strokeWidth={1.5} style={{ marginBottom: '14px', opacity: 0.4 }} />
              <p style={{ fontWeight: 600, fontSize: '1rem' }}>No Analysis Executed Yet</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '320px', marginTop: '6px', lineHeight: 1.5 }}>
                Submit a headline and optional media on the left to run Truth Guard's NLP and CLIP vision-language pipeline.
              </p>
            </div>
          )}

          {loading && (
            <div style={{
              height: '360px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px'
            }}>
              <RefreshCw className="animate-spin" size={38} color="var(--accent-cyan)" />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 600, fontSize: '1rem' }}>Analyzing Headline & Media</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }} className="font-mono">
                  Supervised NLP Classification → CLIP Embedding Alignment → Fusion
                </p>
              </div>
            </div>
          )}

          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              
              {/* 1. MAIN RESULT CARD */}
              <div style={{
                background: result.prediction === 'REAL' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${result.prediction === 'REAL' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Prediction Output
                    </div>
                    <div className={result.prediction === 'REAL' ? 'badge-real' : 'badge-fake'} style={{ fontSize: '1.25rem', padding: '6px 18px', marginTop: '6px' }}>
                      {result.prediction === 'REAL' ? <CheckCircle2 size={22} /> : <XCircle size={22} />}
                      <span>{result.prediction}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Model Confidence
                    </div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800 }} className="font-mono">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-bg" style={{ marginBottom: '12px' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${Math.max(result.confidence * 100, 5)}%`,
                      background: result.prediction === 'REAL' ? 'var(--status-real)' : 'var(--status-fake)'
                    }} 
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }} className="font-mono">
                  <span>Latency: {result.processing_time_ms} ms</span>
                  <span>Modalities: {result.modalities_used?.join(', ')}</span>
                </div>
              </div>

              {/* 2. TRANSPARENCY / EXPLANATION PANEL */}
              <div style={{
                background: 'rgba(10, 15, 28, 0.7)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '18px'
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#00f2fe" /> Why did Truth Guard reach this result?
                </h3>

                {/* Active Components Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px', fontSize: '0.86rem' }}>
                  <div style={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#10b981" />
                    <span><strong>Text Analysis:</strong> Supervised NLP Classifier (TF-IDF + Logistic Regression)</span>
                  </div>
                  {result.visual_signal?.available && (
                    <div style={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#00f2fe" />
                      <span><strong>Vision-Language:</strong> OpenAI CLIP ViT-B/32 Semantic Analysis</span>
                    </div>
                  )}
                  {result.video_signal?.available && (
                    <div style={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={15} color="#a855f7" />
                      <span><strong>Video Analysis:</strong> Keyframe Sampling & Consistency Signal</span>
                    </div>
                  )}
                  <div style={{ color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 size={15} color="#6366f1" />
                    <span><strong>Fusion Engine:</strong> {getFusionMethodLabel(result.fusion_method)}</span>
                  </div>
                </div>

                {/* Fusion Method & Alpha Box */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '10px 14px',
                  fontSize: '0.83rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '14px'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Fusion Strategy:</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    {getFusionMethodLabel(result.fusion_method)}
                    {result.fusion_gate_alpha !== null && (
                      <span className="font-mono" style={{ marginLeft: '8px', opacity: 0.8 }}>
                        (Gate α = {result.fusion_gate_alpha})
                      </span>
                    )}
                  </span>
                </div>

                {/* Explanation text */}
                <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: '#cbd5e1' }}>
                  {result.explanation}
                </p>
              </div>

              {/* 3. CLIP EXPLANATION PANEL (WHEN IMAGE IS PRESENT) */}
              {result.visual_signal?.available && (
                <div style={{
                  background: 'rgba(0, 242, 254, 0.04)',
                  border: '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px'
                }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00f2fe', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={18} /> Image–Text Semantic Alignment (CLIP)
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', uppercase: 'true' }}>Cosine Similarity</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-blue)', marginTop: '2px' }} className="font-mono">
                        {result.visual_signal.image_text_similarity?.toFixed(4) ?? 'N/A'}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', uppercase: 'true' }}>Alignment Signal</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#00f2fe', marginTop: '2px' }} className="font-mono">
                        {result.visual_signal.alignment_signal?.toFixed(4) ?? 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Explicit Disclaimer Note */}
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(0, 242, 254, 0.2)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    fontSize: '0.82rem',
                    color: '#94a3b8',
                    lineHeight: 1.5,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <Info size={16} color="#00f2fe" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>
                      <strong>Important Notice:</strong> Semantic alignment measures how well the uploaded image relates to the submitted text. It does not determine whether the claim itself is true or whether the image is authentic.
                    </span>
                  </div>
                </div>
              )}

              {/* 4. EXPANDABLE ANALYSIS DETAILS SECTION */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)'
              }}>
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={16} color="var(--accent-purple)" /> Analysis Details & Architecture Parameters
                  </span>
                  {showDetails ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {showDetails && (
                  <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border-color)', paddingTop: '14px', fontSize: '0.82rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="font-mono">
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Text Model:</span>
                        <div style={{ color: '#e2e8f0', marginTop: '2px' }}>TF-IDF + Logistic Regression</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Vision Model:</span>
                        <div style={{ color: '#e2e8f0', marginTop: '2px' }}>OpenAI CLIP ViT-B/32</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Fusion Strategy:</span>
                        <div style={{ color: '#e2e8f0', marginTop: '2px' }}>{getFusionMethodLabel(result.fusion_method)}</div>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>Analysis ID:</span>
                        <div style={{ color: '#e2e8f0', marginTop: '2px' }}>#{result.id}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. RESEARCH TRANSPARENCY NOTICE */}
              <div style={{
                background: 'rgba(99, 102, 241, 0.05)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                fontSize: '0.83rem',
                color: '#94a3b8',
                lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '4px', textTransform: 'uppercase', fontSize: '0.76rem', letterSpacing: '0.05em' }}>
                  Research Transparency
                </div>
                Truth Guard combines a supervised NLP classifier with vision-language semantic analysis. The NLP classifier was evaluated on a held-out dataset. Image-text semantic alignment is used as supporting multimodal evidence and does not independently establish factual truth.
              </div>

              {/* 6. FEEDBACK SECTION */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '18px' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Was this analysis useful?
                </div>

                {feedbackSent ? (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--status-real)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <CheckCircle2 size={16} /> Thank you! Your feedback has been recorded for research evaluation.
                  </div>
                ) : (
                  <div>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                      <button 
                        type="button"
                        onClick={() => handleSendFeedback(5, 'REAL')} 
                        className="btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      >
                        <ThumbsUp size={15} color="#10b981" /> Correct
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleSendFeedback(1, 'FAKE')} 
                        className="btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      >
                        <ThumbsDown size={15} color="#ef4444" /> Incorrect
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleSendFeedback(3, 'UNCERTAIN')} 
                        className="btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      >
                        <HelpCircle size={15} color="#f59e0b" /> Not Sure
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Optional feedback notes or ground truth observations..."
                        value={feedbackComments}
                        onChange={(e) => setFeedbackComments(e.target.value)}
                        style={{ fontSize: '0.82rem', padding: '8px 12px' }}
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
