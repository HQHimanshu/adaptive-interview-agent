import React from 'react';
import { Link } from 'react-router-dom';
import './EvaluationModal.css';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

const RotateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

const EvaluationModal = ({ session, onClose }) => {
  if (!session || !session.feedback) return null;

  const { candidate, id, feedback } = session;
  const { summary, strengths, gaps, next } = feedback;
  const candidateName = candidate?.member?.name || candidate?.name || 'Candidate';

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ position: 'relative' }}>
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-faint)', cursor: 'pointer', zIndex: 10 }}
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>
        <div className="modal-header">
          <div className="modal-badge">
            <SparklesIcon /> Interview complete
          </div>
          <h2 className="modal-title">{candidateName}, here's your evaluation</h2>
          <div className="modal-session">Session {id}</div>
        </div>
        
        <div className="modal-body">
          <div className="summary-section">
            <div className="section-header"><SparklesIcon /> SUMMARY</div>
            <p className="summary-text">{summary}</p>
          </div>
          
          <div className="analysis-grid">
            <div className="analysis-column">
              <div className="analysis-header text-green">STRENGTHS</div>
              <ul className="analysis-list">
                {Array.isArray(strengths) && strengths.map((item, i) => (
                  <li key={i}><CheckIcon /> <span>{item}</span></li>
                ))}
              </ul>
            </div>
            
            <div className="analysis-column">
              <div className="analysis-header text-red">GAPS &amp; GROWTH AREAS</div>
              <ul className="analysis-list">
                {Array.isArray(gaps) && gaps.map((item, i) => (
                  <li key={i}><AlertIcon /> <span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="next-steps-section">
            <div className="section-header" style={{ marginBottom: '12px', color: 'var(--primary)' }}>
              <SparklesIcon /> RECOMMENDED NEXT STEPS
            </div>
            {Array.isArray(next) && next.length > 0 ? (
              <ul className="analysis-list" style={{ gap: '10px' }}>
                {next.map((item, i) => (
                  <li key={i} style={{ alignItems: 'center' }}>
                    <ArrowRightIcon /> <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>View the full 31-day curriculum program to dive deeper into these topics.</p>
            )}
          </div>
        </div>
        
        <div className="modal-footer">
          <Link to="/program" className="btn btn-outline btn-wide">
            <SparklesIcon /> View program
          </Link>
          <Link to="/interview" className="btn btn-primary btn-wide" onClick={onClose}>
            <RotateIcon /> New interview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
