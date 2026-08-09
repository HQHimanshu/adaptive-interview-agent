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

const EvaluationModal = () => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-badge">
            <SparklesIcon /> Interview complete
          </div>
          <h2 className="modal-title">Adityakumar Pandey, here's your evaluation</h2>
          <div className="modal-session">Session ABT-QBKGF7</div>
          
          <div className="score-section">
            <div className="score-circle">
              <span className="score-value">35</span>
            </div>
            <div className="recommendation-area">
              <div className="recommendation-label">RECOMMENDATION</div>
              <div className="recommendation-text"><StarIcon /> Needs More Preparation</div>
            </div>
          </div>
        </div>
        
        <div className="modal-body">
          <div className="summary-section">
            <div className="section-header"><SparklesIcon /> SUMMARY</div>
            <p className="summary-text">
              Adityakumar Pandey provided extremely brief, shorthand responses that lacked the depth
              and technical articulation required for a mid-level AI Engineer role. While the candidate
              acknowledged the topics, the failure to provide detailed explanations for critical concepts
              like dependency management, RAG optimization, and agentic workflows indicates a need
              for significant technical foundational review.
            </p>
          </div>
          
          <div className="analysis-grid">
            <div className="analysis-column">
              <div className="analysis-header text-green">STRENGTHS</div>
              <ul className="analysis-list">
                <li><CheckIcon /> <span>Ability to acknowledge and engage with a wide variety of advanced AI engineering topics</span></li>
                <li><CheckIcon /> <span>Familiarity with the terminology across the entire ML lifecycle from environment setup to production monitoring</span></li>
                <li><CheckIcon /> <span>Efficient communication style, though currently lacking in depth for a technical interview context</span></li>
              </ul>
            </div>
            
            <div className="analysis-column">
              <div className="analysis-header text-red">GAPS</div>
              <ul className="analysis-list">
                <li><AlertIcon /> <span>Lack of technical elaboration on environment management and the specific benefits of containerization over virtual environments</span></li>
                <li><AlertIcon /> <span>Insufficient depth regarding data preprocessing techniques for noisy or missing data</span></li>
                <li><AlertIcon /> <span>Inability to articulate the architectural trade-offs between fine-tuning and prompting strategies</span></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <Link to="/program" className="btn btn-outline btn-wide">
            <SparklesIcon /> View program
          </Link>
          <Link to="/interview" className="btn btn-primary btn-wide">
            <RotateIcon /> New interview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EvaluationModal;
