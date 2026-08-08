import React, { useEffect, useRef } from 'react';

export default function DayDetailDrawer({ day, onClose }) {
  const drawerRef = useRef(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (day) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [day, onClose]);

  // Click outside to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!day) return null;

  return (
    <div 
      className="drawer-backdrop" 
      onClick={handleBackdropClick}
      aria-hidden={!day}
    >
      <div 
        className="drawer-panel" 
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        <button 
          className="drawer-close" 
          onClick={onClose} 
          aria-label="Close drawer"
        >
          ×
        </button>
        
        <div className="drawer-header">
          <div className="drawer-subtitle">
            DAY {String(day.day).padStart(2, '0')}
          </div>
          <h2 id="drawer-title" className="drawer-title">
            {day.title}
          </h2>
          <div className="drawer-type-badge">
            {day.type.replace('_', ' ')}
          </div>
        </div>

        <div className="drawer-content">
          {day.tools && day.tools.length > 0 && (
            <div className="drawer-section">
              <h3 className="drawer-section-title">TOOLS</h3>
              <div className="drawer-tools-list">
                {day.tools.map((tool, i) => (
                  <span key={i} className="tool-tag">{tool}</span>
                ))}
              </div>
            </div>
          )}

          {day.objectives && day.objectives.length > 0 && (
            <div className="drawer-section">
              <h3 className="drawer-section-title">OBJECTIVES</h3>
              <ul className="drawer-objectives-list">
                {day.objectives.map((obj, i) => (
                  <li key={i} className="objective-item">
                    <span className="objective-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="objective-text">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="drawer-footer">
          <button className="button primary full-width" onClick={onClose}>
            {day.day === 31 ? 'VIEW CAPSTONE →' : 'START DAY'}
          </button>
        </div>
      </div>
    </div>
  );
}
