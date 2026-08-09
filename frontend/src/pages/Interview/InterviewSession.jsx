import React from 'react';
import './InterviewSession.css';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const InterviewSession = () => {
  return (
    <div className="chat-layout">
      <div className="chat-header">
        <div className="interviewer-profile">
          <div className="avatar-icon bg-dark">
            <SparklesIcon />
          </div>
          <div>
            <div className="interviewer-name">AB Talks Interviewer</div>
            <div className="session-tag"># ABT-QBKGF7</div>
          </div>
        </div>
        <div className="question-progress">
          QUESTION 0/8
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{width: '0%'}}></div>
          </div>
        </div>
      </div>
      
      <div className="chat-messages">
        <div className="message-wrapper ai-message">
          <div className="avatar-icon bg-dark">
            <SparklesIcon />
          </div>
          <div className="message-bubble">
            Welcome, Adityakumar Pandey! I am AB Talks, and I will be guiding you through
            an adaptive technical interview consisting of eight questions to assess your
            readiness for our AI Engineering program. Let us begin with our first topic:
            Environment and Tooling. Could you explain the primary advantages of using
            virtual environments like venv or conda when developing AI applications, and
            how you typically manage dependency conflicts in a production-grade machine
            learning project?
          </div>
        </div>
      </div>
      
      <div className="chat-input-area">
        <div className="input-box-wrapper">
          <input type="text" className="chat-input" placeholder="Type your answer... (Enter to send)" />
          <button className="send-btn">
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
