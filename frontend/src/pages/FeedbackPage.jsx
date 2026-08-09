import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';

export default function FeedbackPage() {
  const navigate = useNavigate();
  const { sessionId, candidate, feedback, isComplete } = useInterview();
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    // If not complete, redirect back to interview
    if (!isComplete) {
      navigate('/interview');
      return;
    }
    setTimeout(() => setIsIn(true), 100);
  }, [isComplete, navigate]);

  if (!feedback) return null;

  return (
    <div className={`page-container feedback-page ${isIn ? 'in' : ''}`}>
      <div className="setup-header">
        <span className="brand-label">ADAPTIVE INTERVIEW</span>
      </div>

      <div className="setup-content">
        <div className="feedback-hero">
          <div className="feedback-badge">INTERVIEW COMPLETE</div>
          <h1 className="setup-h1">{candidate?.member?.name}</h1>
          <p className="setup-desc">Technical Interview Assessment</p>
        </div>

        <div className="feedback-section">
          <h3 className="section-heading">SUMMARY</h3>
          <div className="feedback-card">
            <p className="feedback-text">{feedback.summary}</p>
          </div>
        </div>

        <div className="feedback-section">
          <h3 className="section-heading">STRENGTHS</h3>
          <div className="feedback-card list-card strengths">
            {feedback.strengths?.map((item, idx) => (
              <div key={idx} className="list-item">
                <span className="icon success">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="feedback-section">
          <h3 className="section-heading">GROWTH AREAS</h3>
          <div className="feedback-card list-card gaps">
            {feedback.gaps?.map((item, idx) => (
              <div key={idx} className="list-item">
                <span className="icon warning">•</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="feedback-section">
          <h3 className="section-heading">NEXT STEPS</h3>
          <div className="feedback-card list-card next-steps">
            {feedback.next?.map((item, idx) => (
              <div key={idx} className="list-item">
                <span className="icon action">→</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions" style={{ gap: '16px' }}>
          <button className="button secondary cta-btn outline" onClick={() => navigate('/interview?review=true')}>
            Review Interview
          </button>
          <button className="button primary cta-btn" onClick={() => navigate('/setup')}>
            Start New Interview
          </button>
        </div>
      </div>
    </div>
  );
}
