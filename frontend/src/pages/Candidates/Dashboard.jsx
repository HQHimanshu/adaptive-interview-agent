import React from 'react';
import './Dashboard.css';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="badge-icon"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const sessions = [
  { id: 'ABT-QBKGF7', name: 'Adityakumar Pandey', role: 'AI Engineer', level: 'Mid', score: 35 },
  { id: 'ABT-KKKGKM', name: 'Adityakumar Pandey', role: 'AI Engineer', level: 'Mid', score: 5 }
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="badge program-badge">
        <SparklesIcon /> Candidate dashboard
      </div>
      
      <h1 className="program-title">Interview sessions</h1>
      <p className="program-subtitle">
        Every interview is assigned a unique session ID. Review past attempts, scores,<br/>
        and the structured feedback left by the AI interviewer.
      </p>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">TOTAL SESSIONS</div>
          <div className="stat-value">2</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">COMPLETED</div>
          <div className="stat-value">2</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">AVG. SCORE</div>
          <div className="stat-value">20</div>
        </div>
      </div>
      
      <div className="dashboard-layout">
        <div className="sessions-list">
          {sessions.map(session => (
            <div key={session.id} className="session-card">
              <div className="session-card-header">
                <span className="session-tag"># {session.id}</span>
                <div className="score-badge">
                  <StarIcon /> {session.score}
                </div>
              </div>
              <h3 className="session-name">{session.name}</h3>
              <p className="session-role">{session.role} &middot; {session.level}</p>
            </div>
          ))}
        </div>
        
        <div className="feedback-preview-pane">
          Select a session to view its feedback.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
