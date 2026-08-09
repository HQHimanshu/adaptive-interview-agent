import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getSession, updateSession, createSession } from '../../lib/storage';
import { useInterview } from '../../context/InterviewContext';
import { api } from '../../services/api';
import EvaluationModal from '../../components/Interview/EvaluationModal';
import './InterviewSession.css';

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
);

const AlertCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

const DocumentCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
);

const InterviewSession = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const urlSessionId = searchParams.get('id');
  const { candidate: contextCandidate, endInterview } = useInterview();

  const [sessionId, setSessionId] = useState(urlSessionId);
  const [session, setSession] = useState(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingText, setLoadingText] = useState('AI is analyzing...');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastFailedAnswer, setLastFailedAnswer] = useState('');
  const [showEval, setShowEval] = useState(false);
  
  const endOfMessagesRef = useRef(null);
  const isStartingRef = useRef(false);

  useEffect(() => {
    let currentId = urlSessionId;
    if (!currentId) {
      currentId = 'ABT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setSessionId(currentId);
      navigate(`/interview/session?id=${currentId}`, { replace: true });
    }

    let s = getSession(currentId);
    if (!s) {
      const defaultCandidate = contextCandidate || {
        member: {
          id: `CAND-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          name: 'Candidate',
          jobRole: 'AI Engineer',
          yearsExperience: 3,
          education: 'BS Computer Science',
          status: 'ACTIVE'
        },
        missions: [
          { day: 1, title: 'VS Code & Python Environment Setup', passed: true, attempts: 1 },
          { day: 2, title: 'Local LLM & AI Coding Assistant Setup', passed: true, attempts: 1 }
        ],
        signals: { commitDays: 15, missionsCompleted: 6, missionsFirstTry: 5 }
      };
      s = createSession(defaultCandidate, currentId);
    }

    setSession(s);

    if (s.status === 'completed' && s.feedback) {
      setShowEval(true);
    } else if (s.messages.length === 0 && !isStartingRef.current) {
      isStartingRef.current = true;
      startInterviewFlow(s);
    }
  }, [urlSessionId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, isTyping, errorMessage]);

  const startInterviewFlow = async (currentSession) => {
    setIsTyping(true);
    setIsSubmitting(true);
    setLoadingText('Initializing adaptive interview session...');
    setErrorMessage('');

    try {
      const response = await api.startInterview(currentSession.id, currentSession.candidate);
      const initialMsg = { role: 'ai', content: response.reply };
      const updatedMessages = [initialMsg];
      const updatedSession = updateSession(currentSession.id, {
        messages: updatedMessages,
        question_count: 1
      });
      setSession(updatedSession);
    } catch (err) {
      console.error("Failed to start interview:", err);
      setErrorMessage(err.message || 'Could not connect to backend server. Make sure backend is running on port 3000.');
    } finally {
      setIsTyping(false);
      setIsSubmitting(false);
      setLoadingText('AI is thinking...');
    }
  };

  const handleSend = async () => {
    const answer = input.trim();
    if (!answer || !session || isTyping || isSubmitting || session.status === 'completed') return;
    
    const candidateMsg = { role: 'candidate', content: answer };
    const messagesWithUser = [...session.messages, candidateMsg];
    
    const currentTurn = session.question_count || 1;
    const isLastQuestion = currentTurn >= 8;

    const intermediateSession = updateSession(session.id, {
      messages: messagesWithUser
    });
    
    setSession(intermediateSession);
    setInput('');
    setErrorMessage('');
    setLastFailedAnswer('');
    setIsTyping(true);
    setIsSubmitting(true);
    setLoadingText(isLastQuestion ? 'Evaluating complete interview performance...' : 'AI is analyzing your response...');

    try {
      const response = await api.sendInterviewMessage(session.id, answer);

      if (response.done && response.feedback) {
        const finalAiMsg = response.reply ? { role: 'ai', content: response.reply } : null;
        const finalMessages = finalAiMsg ? [...messagesWithUser, finalAiMsg] : messagesWithUser;
        const completedSession = updateSession(session.id, {
          status: 'completed',
          feedback: response.feedback,
          messages: finalMessages,
          question_count: 8
        });
        setSession(completedSession);
        endInterview(response.feedback);
        setShowEval(true);
      } else {
        const nextAiMsg = { role: 'ai', content: response.reply };
        const nextMessages = [...messagesWithUser, nextAiMsg];
        const nextQuestionCount = Math.min((session.question_count || 1) + 1, 8);
        const nextSession = updateSession(session.id, {
          messages: nextMessages,
          question_count: nextQuestionCount
        });
        setSession(nextSession);
      }
    } catch (err) {
      console.error("Failed to send answer:", err);
      setErrorMessage(err.message || 'Failed to submit answer. Please retry.');
      setLastFailedAnswer(answer);
      setInput(answer);
    } finally {
      setIsTyping(false);
      setIsSubmitting(false);
      setLoadingText('AI is thinking...');
    }
  };

  const handleRestart = () => {
    if (!session) return;
    const resetSession = updateSession(session.id, {
      messages: [],
      question_count: 0,
      status: 'in_progress',
      feedback: null
    });
    setSession(resetSession);
    setErrorMessage('');
    startInterviewFlow(resetSession);
  };

  if (!session) {
    return (
      <div className="interview-loading-container">
        <div className="loading-spinner" />
        <p>Connecting to interview session...</p>
      </div>
    );
  }

  const currentQ = session.question_count || 1;
  const candidateName = session.candidate?.member?.name || session.candidate?.name || 'Candidate';
  const candidateRole = session.candidate?.member?.jobRole || session.candidate?.role || 'AI Engineer';

  return (
    <div className="interview-suite-wrapper">
      {showEval && <EvaluationModal session={session} onClose={() => setShowEval(false)} />}
      
      {/* Live Header Bar */}
      <div className="interview-suite-header">
        <div className="suite-header-left">
          <div className="live-status-pill">
            <span className="pulsing-dot" />
            <span className="live-status-text">
              {session.status === 'completed' ? 'INTERVIEW COMPLETED' : 'LIVE ADAPTIVE INTERVIEW'}
            </span>
          </div>
          <div className="candidate-meta-pill">
            <strong>{candidateName}</strong>
            <span className="meta-sep">&bull;</span>
            <span>{candidateRole}</span>
            <span className="meta-sep">&bull;</span>
            <span className="session-code">#{session.id}</span>
          </div>
        </div>

        <div className="suite-header-right">
          {session.status === 'completed' ? (
            <button className="btn-view-eval" onClick={() => setShowEval(true)}>
              <DocumentCheckIcon /> View Feedback Report
            </button>
          ) : (
            <div className="turn-progress-box">
              <div className="progress-label-row">
                <span className="progress-title">QUESTION PROGRESS</span>
                <span className="progress-count">{currentQ} / 8</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(currentQ / 8) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Messages Feed */}
      <div className="interview-chat-feed">
        {session.messages.map((msg, idx) => {
          const isAi = msg.role === 'ai';
          return (
            <div 
              key={idx} 
              className={`chat-bubble-row ${isAi ? 'row-ai' : 'row-candidate'}`}
            >
              <div className={`speaker-avatar ${isAi ? 'avatar-ai' : 'avatar-user'}`}>
                {isAi ? <SparklesIcon /> : <UserIcon />}
              </div>
              <div className="bubble-content-wrapper">
                <div className="speaker-name-tag">
                  {isAi ? 'AB Talks AI Interviewer' : candidateName}
                </div>
                <div className={`message-bubble-body ${isAi ? 'bubble-ai' : 'bubble-candidate'}`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="chat-bubble-row row-ai">
            <div className="speaker-avatar avatar-ai">
              <SparklesIcon />
            </div>
            <div className="bubble-content-wrapper">
              <div className="speaker-name-tag">AB Talks AI Interviewer</div>
              <div className="message-bubble-body bubble-ai bubble-typing">
                <span className="typing-pulse-dot" />
                <span className="typing-pulse-dot" />
                <span className="typing-pulse-dot" />
                <span className="typing-status-text">{loadingText}</span>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="interview-error-card">
            <div className="error-card-content">
              <AlertCircleIcon />
              <div>
                <strong>Error communicating with backend:</strong>
                <p>{errorMessage}</p>
              </div>
            </div>
            <div className="error-card-actions">
              <button onClick={handleSend} className="btn-retry" disabled={isSubmitting}>
                Retry Answer
              </button>
              <button onClick={handleRestart} className="btn-restart" disabled={isSubmitting}>
                Restart Session
              </button>
            </div>
          </div>
        )}

        <div ref={endOfMessagesRef} />
      </div>
      
      {/* Active Input Console */}
      <div className="interview-input-console">
        <div className="input-console-card">
          <textarea 
            rows="2"
            className="interview-textarea" 
            placeholder={
              session.status === 'completed' 
                ? "This interview session has ended. Click 'View Feedback Report' to see your evaluation." 
                : isTyping 
                  ? loadingText 
                  : "Type your response here... (Press Enter to submit, Shift+Enter for new line)"
            }
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isTyping || isSubmitting || session.status === 'completed'}
          />
          <div className="console-actions-bar">
            <span className="console-hint">
              {session.status === 'completed' 
                ? 'Session complete' 
                : 'Adaptive AI evaluates technical depth and clarity'}
            </span>
            <button 
              className="btn-send-message" 
              onClick={handleSend} 
              disabled={isTyping || isSubmitting || session.status === 'completed' || !input.trim()}
            >
              Send Answer <SendIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
