import React from 'react';
import { Link } from 'react-router-dom';
import './EvaluationModal.css';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
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
  const { summary, strengths, gaps, score, recommendation } = feedback;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-faint)', cursor: 'pointer' }}><CloseIcon /></button>
        <div className="modal-header">
          <div className="modal-badge">
            <SparklesIcon /> Interview complete
          </div>
          <h2 className="modal-title">{candidate?.name}, here's your evaluation</h2>
          <div className="modal-session">Session {id}</div>
          
          <div className="score-section">
            <div className="score-circle">
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="32" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
                <circle cx="36" cy="36" r="32" fill="none" stroke="white" strokeWidth="4" strokeDasharray="201" strokeDashoffset={201 - (201 * score) / 100} strokeLinecap="round" />
              </svg>
              <span className="score-value">{score}</span>
            </div>
            <div className="recommendation-area">
              <div className="recommendation-label">RECOMMENDATION</div>
              <div className="recommendation-text"><StarIcon /> {recommendation}</div>
            </div>
          </div>
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
                {strengths?.map((item, i) => (
                  <li key={i}><CheckIcon /> <span>{item}</span></li>
                ))}
              </ul>
            </div>
            
            <div className="analysis-column">
              <div className="analysis-header text-red">GAPS</div>
              <ul className="analysis-list">
                {gaps?.map((item, i) => (
                  <li key={i}><AlertIcon /> <span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="next-steps-section">
            <strong>What's next?</strong> View the full 31-day program to dive deeper into these topics, or start a new interview to practice other modules.
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
