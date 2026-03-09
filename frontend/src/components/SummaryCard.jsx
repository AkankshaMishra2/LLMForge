import React from 'react';

const SummaryCard = ({ summary }) => {
  return (
    <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', borderLeft: '4px solid var(--accent-primary)' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem' }}>✨</span> Synthesized Summary
        </h2>
      </div>
      <div style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--text-primary)' }}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{summary}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
