import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import { api } from '../services/api';

export default function InterviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, candidate, conversation, addMessage, endInterview, isComplete } = useInterview();
  
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const messageRefs = useRef({});

  const isReviewMode = new URLSearchParams(location.search).get('review') === 'true';

  useEffect(() => {
    // If no active session, redirect to setup
    if (!sessionId || !candidate) {
      navigate('/setup');
      return;
    }
    
    // If interview is already completed and not reviewing, redirect to feedback
    if (isComplete && !isReviewMode) {
      navigate('/feedback');
      return;
    }

    // Initialize interview if conversation is empty and not complete
    if (conversation.length === 0 && !isComplete) {
      startInterview();
    }
  }, [sessionId, candidate, isComplete, isReviewMode, conversation.length, navigate]);

  const startInterview = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      const response = await api.startInterview(sessionId, candidate);
      
      const interviewerMsg = {
        id: Date.now().toString(),
        role: 'interviewer',
        message: response.reply,
        questionNumber: 1
      };
      addMessage(interviewerMsg);
      
      if (response.done) {
        endInterview(response.feedback);
        navigate('/feedback');
      }
    } catch (err) {
      setError("Unable to reach the interviewer. Please check your connection and try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isProcessing]);

  const scrollToMessage = (id) => {
    if (messageRefs.current[id]) {
      messageRefs.current[id].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = async () => {
    if (!inputText.trim() || isProcessing) return;

    const candidateMsgText = inputText.trim();
    setInputText('');
    setError(null);

    // Current question number is the number of interviewer messages so far
    const qNum = conversation.filter(m => m.role === 'interviewer').length || 1;

    const candidateMsg = {
      id: Date.now().toString(),
      role: 'candidate',
      message: candidateMsgText,
      questionNumber: qNum
    };
    addMessage(candidateMsg);

    setIsProcessing(true);
    
    try {
      const response = await api.sendInterviewMessage(sessionId, candidateMsgText);
      
      if (response.done) {
        endInterview(response.feedback);
        navigate('/feedback');
        return;
      }

      const interviewerMsg = {
        id: (Date.now() + 1).toString(),
        role: 'interviewer',
        message: response.reply,
        questionNumber: qNum + 1
      };
      addMessage(interviewerMsg);

    } catch (err) {
      setError("Unable to reach the interviewer. Please check your connection and try again.");
      // Rollback inputText if failed? We'll leave it simple for now
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Group questions for the navigator
  const questionCount = conversation.filter(m => m.role === 'interviewer').length || 1;

  return (
    <div className="interview-layout">
      
      {/* LEFT NAVIGATION */}
      <aside className="interview-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">ADAPTIVE INTERVIEW</div>
          <div className="sidebar-candidate">{candidate?.member?.name}</div>
          <div className="sidebar-role">{candidate?.member?.jobRole}</div>
          <div className="sidebar-session">SESSION<br/>#{sessionId?.split('-')[1]?.toUpperCase() || 'NEW'}</div>
        </div>
        
        <div className="question-nav">
          <div className="nav-label">QUESTION NAVIGATION</div>
          <div className="nav-list">
            {Array.from({ length: Math.max(questionCount, 8) }).map((_, idx) => {
              const qNumber = idx + 1;
              const isPast = qNumber < questionCount;
              const isActive = qNumber === questionCount;
              
              // Find the interviewer message for this question to link to
              const msg = conversation.find(m => m.role === 'interviewer' && m.questionNumber === qNumber);
              
              return (
                <button 
                  key={qNumber}
                  className={`nav-item ${isPast ? 'past' : ''} ${isActive ? 'active' : ''} ${!msg ? 'future' : ''}`}
                  onClick={() => msg && scrollToMessage(msg.id)}
                  disabled={!msg}
                >
                  <span className="nav-num">{String(qNumber).padStart(2, '0')}</span>
                  <span className="nav-icon">
                    {isPast ? '✓' : isActive ? '●' : '○'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* CENTER CONVERSATION */}
      <main className="interview-main">
        <div className="conversation-header">
          CONVERSATION
        </div>
        
        <div className="conversation-scroll">
          {conversation.map((msg) => (
            <div 
              key={msg.id} 
              id={`msg-${msg.id}`}
              ref={el => messageRefs.current[msg.id] = el}
              className={`message-block ${msg.role === 'interviewer' ? 'ai-block' : 'user-block'}`}
            >
              <div className="message-meta">
                {msg.role === 'interviewer' ? 'AI Interviewer' : 'Candidate'}
              </div>
              <div className="message-content">
                {msg.message}
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="message-block ai-block thinking-block">
              <div className="message-meta">AI Interviewer</div>
              <div className="thinking-indicator">
                {conversation.length === 0 ? 'INITIALIZING INTERVIEW...' : 'ADAPTING NEXT QUESTION...'}
              </div>
            </div>
          )}
          
          {error && (
            <div className="error-banner">
              <p>{error}</p>
              <button onClick={() => conversation.length === 0 ? startInterview() : handleSubmit()} className="retry-btn">
                Retry
              </button>
            </div>
          )}
          
          <div ref={messagesEndRef} style={{ height: '40px' }} />
        </div>

        {/* BOTTOM INPUT */}
        <div className="input-area">
          <div className="input-header">YOUR RESPONSE {isReviewMode && "(REVIEW MODE)"}</div>
          <div className="input-wrapper">
            <textarea
              className="response-input"
              placeholder={isReviewMode ? "Interview completed. This is a read-only review." : "Type your response here... (Ctrl + Enter to submit)"}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isProcessing || isReviewMode}
              autoFocus={!isReviewMode}
            />
          </div>
          <div className="input-footer">
            <div className="shortcut-hint">{!isReviewMode && "Ctrl + Enter to submit"}</div>
            {isReviewMode ? (
              <button 
                className="button secondary submit-btn" 
                onClick={() => navigate('/feedback')}
              >
                Back to Feedback
              </button>
            ) : (
              <button 
                className="button primary submit-btn" 
                onClick={handleSubmit}
                disabled={isProcessing || !inputText.trim()}
              >
                Send Response →
              </button>
            )}
          </div>
        </div>
      </main>

    </div>
  );
}
