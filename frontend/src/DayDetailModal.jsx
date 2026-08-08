import React, { useEffect, useRef } from 'react';
import './inline.css';

function DayDetailModal({ dayData, isOpen, onClose }) {
  const modalRef = useRef();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !dayData) return null;

  const isCapstone = dayData.day === 31;
  const dayStr = dayData.day.toString().padStart(2, '0');

  const handleStartClass = () => {
    window.location.href = `/programs/ai-engineering/day/${dayData.day}`;
  };

  return (
    <div className="modal-backdrop" onClick={onClose} aria-hidden={!isOpen}>
      <div 
        className={`modal-panel ${isCapstone ? 'capstone' : ''}`} 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        
        <div className="modal-header">
          <div className="modal-subtitle">DAY {dayStr}</div>
          <h2 id="modal-title" className="modal-title">{dayData.title}</h2>
          
          <div className="modal-type-badge">{dayData.type}</div>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">TOOLS</div>
          <div className="modal-tools-list">
            {dayData.tools.map((t, idx) => (
              <span key={idx} className="tool-tag">{t}</span>
            ))}
          </div>
        </div>

        <div className="modal-section">
          <div className="modal-section-title">OBJECTIVES PREVIEW</div>
          <ul className="modal-objectives-preview">
            {dayData.objectives.slice(0, 3).map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
            {dayData.objectives.length > 3 && (
              <li className="more-objectives">...and {dayData.objectives.length - 3} more</li>
            )}
          </ul>
        </div>

        {isCapstone && (
          <div className="capstone-mission-complete">MISSION COMPLETE</div>
        )}

        <div className="modal-footer">
          <button className="start-class-btn full-width" onClick={handleStartClass}>
            START CLASS →
          </button>
        </div>
      </div>
    </div>
  );
}

export default DayDetailModal;
