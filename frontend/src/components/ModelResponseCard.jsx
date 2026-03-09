import React from 'react';

const ModelResponseCard = ({ modelName, answer }) => {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <h3 style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--accent-primary)' }}>{modelName}</h3>
      </div>
      <div style={{ overflowY: 'auto', flex: 1, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        <p style={{ whiteSpace: 'pre-wrap' }}>{answer}</p>
      </div>
    </div>
  );
};

export default ModelResponseCard;
