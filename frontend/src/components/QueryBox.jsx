import React, { useState } from 'react';

const QueryBox = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query);
      setQuery('');
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', margin: '0 2rem' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <textarea
          className="input-field"
          style={{ flex: 1, minHeight: '60px', borderRadius: '1rem', resize: 'none' }}
          rows="2"
          placeholder="Ask a question to compare models..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isLoading}
        ></textarea>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!query.trim() || isLoading}
          style={{ 
            height: '60px', 
            padding: '0 2rem', 
            borderRadius: '1rem',
            opacity: (!query.trim() || isLoading) ? 0.6 : 1,
            cursor: (!query.trim() || isLoading) ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Running...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default QueryBox;
