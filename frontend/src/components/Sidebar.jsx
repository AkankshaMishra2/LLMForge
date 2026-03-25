import React, { useContext, useRef, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { renameHistory } from '../services/api';

const Sidebar = ({ history, loadingHistory, onSelectHistory, currentHistoryId, onNewChat, onDeleteHistory, onRenameHistory }) => {
  const { user, logout } = useContext(AuthContext);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const menuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const startRename = (item) => {
    setOpenMenuId(null);
    setRenamingId(item._id);
    setRenameValue(item.title || '');
  };

  const submitRename = async (id) => {
    if (!renameValue.trim()) { setRenamingId(null); return; }
    try {
      await renameHistory(id, renameValue.trim());
      onRenameHistory(id, renameValue.trim());
    } catch (e) {
      console.error(e);
    }
    setRenamingId(null);
  };

  return (
    <div style={{
      width: '260px',
      height: '100%',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
    }}>
      <div style={{ marginBottom: '2rem' }}>
        <button
          className="btn btn-secondary"
          onClick={onNewChat}
          style={{ width: '100%', justifyContent: 'flex-start' }}
        >
          <svg style={{ marginRight: '8px' }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New Chat
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <h3 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '1rem', paddingLeft: '0.5rem' }}>Previous Searches</h3>

        {loadingHistory ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '0.5rem' }}>Loading...</p>
        ) : history.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', paddingLeft: '0.5rem' }}>No history yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }} ref={menuRef}>
            {history.map((item) => (
              <div
                key={item._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: currentHistoryId === item._id ? 'var(--bg-tertiary)' : 'transparent',
                  borderRadius: '0.5rem',
                  transition: 'background 0.2s',
                  paddingRight: '0.25rem',
                  position: 'relative',
                }}
                onMouseEnter={(e) => { if (currentHistoryId !== item._id) e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                onMouseLeave={(e) => { if (currentHistoryId !== item._id) e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Title or inline rename input */}
                {renamingId === item._id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => submitRename(item._id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') submitRename(item._id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    style={{
                      flex: 1,
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--accent-primary)',
                      borderRadius: '0.35rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.85rem',
                      padding: '0.4rem 0.6rem',
                      margin: '0.25rem 0.25rem 0.25rem 0.5rem',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <button
                    onClick={() => onSelectHistory(item)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      padding: '0.75rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.title || 'New Chat'}
                  </button>
                )}

                {/* ⋯ Dropdown trigger */}
                {renamingId !== item._id && (
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === item._id ? null : item._id);
                      }}
                      title="Options"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-tertiary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.3rem 0.4rem',
                        borderRadius: '0.25rem',
                        fontSize: '1rem',
                        lineHeight: 1,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; }}
                    >
                      ⋯
                    </button>

                    {/* Dropdown menu */}
                    {openMenuId === item._id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: '110%',
                          zIndex: 1000,
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '0.5rem',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                          minWidth: '140px',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Rename */}
                        <button
                          onClick={() => startRename(item)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.65rem 0.9rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            fontSize: '0.88rem',
                            textAlign: 'left',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-tertiary)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          {/* Pencil icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Rename
                        </button>
                        <div style={{ height: '1px', background: 'var(--border-color)' }} />
                        {/* Delete */}
                        <button
                          onClick={() => { setOpenMenuId(null); onDeleteHistory(item._id); }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            padding: '0.65rem 0.9rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '0.88rem',
                            textAlign: 'left',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          {/* Trash icon */}
                          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          Delete Chat
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.username}
          </span>
        </div>
        <button
          onClick={logout}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
