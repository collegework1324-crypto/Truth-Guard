import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Search, RefreshCw, CheckCircle2, XCircle, Clock, Layers, ChevronDown, ChevronUp, Cpu, Sparkles } from 'lucide-react';
import { getHistory } from '../api/client';

export const History = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory({ prediction: filter || undefined });
      setHistoryItems(data);
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getFusionLabel = (fusionMethod) => {
    switch (fusionMethod) {
      case 'reliability_gated_baseline':
        return 'Reliability-Gated Fusion';
      case 'text_only_baseline':
        return 'Text-Only Pipeline';
      case 'trainable_logistic_regression':
        return 'Trainable Fusion';
      default:
        return 'Reliability-Gated Fusion';
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
            Analysis <span className="gradient-text">History</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Recorded detection predictions, modality signals, and fusion metadata saved in database.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            className="form-input" 
            style={{ padding: '8px 14px', fontSize: '0.88rem' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">All Predictions</option>
            <option value="REAL">REAL Only</option>
            <option value="FAKE">FAKE Only</option>
          </select>
          <button onClick={fetchHistory} className="btn-secondary" style={{ padding: '8px 14px' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <RefreshCw className="animate-spin" size={32} color="var(--accent-cyan)" />
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading history records...</p>
        </div>
      ) : historyItems.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <HistoryIcon size={40} color="var(--text-dim)" style={{ marginBottom: '12px' }} />
          <p style={{ fontWeight: 600 }}>No Analysis History Found</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Run an analysis in the Detection Workspace to populate history records.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {historyItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="glass-panel" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '8px', color: '#f8fafc' }}>
                      {item.headline}
                    </h3>
                    
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '14px' }} className="font-mono">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {new Date(item.created_at).toLocaleString()}
                      </span>
                      <span>Modalities: {item.modalities_used?.join(', ')}</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>
                        Strategy: {getFusionLabel(item.fusion_method)}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div className={item.prediction === 'REAL' ? 'badge-real' : 'badge-fake'}>
                      {item.prediction === 'REAL' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      <span>{item.prediction} ({(item.confidence * 100).toFixed(1)}%)</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', background: 'rgba(10, 15, 28, 0.5)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', lineHeight: 1.5 }}>
                  {item.explanation}
                </p>

                {/* EXPANDED DETAILS */}
                {isExpanded && (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                      
                      {item.text_signal && (
                        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Text Signal</div>
                          <div className="font-mono" style={{ color: '#e2e8f0' }}>
                            P(Fake|Text): {(item.text_signal.fake_score * 100).toFixed(1)}%
                          </div>
                        </div>
                      )}

                      {item.visual_signal && item.visual_signal.available && (
                        <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                          <div style={{ color: '#00f2fe', fontWeight: 600, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={13} /> CLIP Image-Text Similarity
                          </div>
                          <div className="font-mono" style={{ color: '#e2e8f0' }}>
                            Similarity: {item.visual_signal.image_text_similarity?.toFixed(4) ?? 'N/A'}
                          </div>
                        </div>
                      )}

                      <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                        <div style={{ color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>Metadata</div>
                        <div className="font-mono" style={{ color: '#e2e8f0' }}>
                          Latency: {item.processing_time_ms} ms | Gate α: {item.fusion_gate_alpha ?? '1.0'}
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
