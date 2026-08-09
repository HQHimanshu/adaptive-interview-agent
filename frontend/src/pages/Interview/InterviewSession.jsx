import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSession, updateSession } from '../../lib/storage';
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

const MOCK_QUESTIONS = [
  "Could you explain the primary advantages of using virtual environments like venv or conda when developing AI applications?",
  "How do you typically handle missing data and outliers during data preprocessing?",
  "What is the difference between Euclidean distance and cosine similarity, and when would you use each in a vector database?",
  "Describe the attention mechanism in Transformer models and why it was a breakthrough for NLP.",
  "When building a RAG application, how do you decide between a naive top-k retrieval and more advanced techniques like reranking?",
  "What are some key challenges when fine-tuning a pre-trained language model on a small, domain-specific dataset?",
  "How can you evaluate the robustness and safety of a generative AI agent before deploying it?",
  "What strategies do you use for monitoring and mitigating model drift in production?"
];

const generateFeedback = (candidate) => ({
  summary: `${candidate.name} completed the mock interview. The responses were recorded, though this is a simulated evaluation. The candidate demonstrated engagement with the adaptive questions.`,
  strengths: ["Engaged with all 8 questions", "Maintained professional communication style", "Completed the full adaptive flow"],
  gaps: ["Technical depth is simulated", "Needs real backend for actual technical evaluation"],
  score: 85,
  recommendation: "Strong Candidate (Mock)"
});

const InterviewSession = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('id');
  const [session, setSession] = useState(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEval, setShowEval] = useState(false);
  
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (sessionId) {
      const s = getSession(sessionId);
      if (s) {
        setSession(s);
        if (s.messages.length === 0) {
          triggerAiTurn(s, []);
        } else if (s.status === 'completed') {
          setShowEval(true);
        }
      }
    }
  }, [sessionId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages, isTyping]);

  const triggerAiTurn = (currentSession, currentMessages) => {
    setIsTyping(true);
    setTimeout(() => {
      let newMessageContent = '';
      let isClosing = false;
      const answered = Math.floor(currentMessages.length / 2); // 1 AI, 1 User = 1 pair
      
      if (currentMessages.length === 0) {
        newMessageContent = `Welcome, ${currentSession.candidate?.name}! I am AB Talks, and I will be guiding you through an adaptive technical interview. We have 8 questions focused on ${currentSession.candidate?.focusArea || 'AI Engineering'}. Let's begin with our first question:\n\n${MOCK_QUESTIONS[0]}`;
      } else if (answered < 8) {
        newMessageContent = `Thank you for that response. Let's move on to the next topic:\n\n${MOCK_QUESTIONS[answered]}`;
      } else {
        newMessageContent = `Thank you for completing all the questions! I will now prepare your feedback.`;
        isClosing = true;
      }

      const newMsg = { role: 'ai', content: newMessageContent };
      const updatedMessages = [...currentMessages, newMsg];
      const updatedSession = updateSession(currentSession.id, { messages: updatedMessages, question_count: Math.min(answered + (isClosing ? 0 : 1), 8) });
      
      setSession(updatedSession);
      setIsTyping(false);

      if (isClosing) {
        setTimeout(() => {
          const feedback = generateFeedback(currentSession.candidate);
          const finalSession = updateSession(currentSession.id, { status: 'completed', feedback });
          setSession(finalSession);
          setShowEval(true);
        }, 2000); // simulate eval delay
      }
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim() || !session || isTyping || session.status === 'completed') return;
    
    const newMsg = { role: 'candidate', content: input };
    const updatedMessages = [...session.messages, newMsg];
    const updatedSession = updateSession(session.id, { messages: updatedMessages });
    
    setSession(updatedSession);
    setInput('');
    triggerAiTurn(updatedSession, updatedMessages);
  };

  if (!session) return <div style={{padding: 40}}>Loading session...</div>;

  return (
    <div className="chat-layout">
      {showEval && <EvaluationModal session={session} onClose={() => setShowEval(false)} />}
      <div className="chat-header">
        <div className="interviewer-profile">
          <div className="avatar-icon bg-dark">
            <SparklesIcon />
          </div>
          <div>
            <div className="interviewer-name">AB Talks Interviewer</div>
            <div className="session-tag"># {session.id}</div>
          </div>
        </div>
        <div className="question-progress">
          QUESTION {session.question_count}/8
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{width: `${(session.question_count/8)*100}%`}}></div>
          </div>
        </div>
      </div>
      
      <div className="chat-messages">
        {session.messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.role === 'ai' ? 'ai-message' : 'candidate-message'}`} style={{ alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end', marginLeft: msg.role === 'ai' ? 0 : 'auto', flexDirection: msg.role === 'ai' ? 'row' : 'row-reverse' }}>
            {msg.role === 'ai' ? (
              <div className="avatar-icon bg-dark">
                <SparklesIcon />
              </div>
            ) : (
              <div className="avatar-icon" style={{ background: 'var(--text-muted)' }}>
                <UserIcon />
              </div>
            )}
            <div className="message-bubble" style={{ background: msg.role === 'ai' ? 'var(--border)' : 'var(--text)', color: msg.role === 'ai' ? 'inherit' : 'var(--bg)', borderRadius: '12px', borderBottomRightRadius: msg.role === 'candidate' ? '2px' : '12px', borderBottomLeftRadius: msg.role === 'ai' ? '2px' : '12px' }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-wrapper ai-message">
            <div className="avatar-icon bg-dark">
              <SparklesIcon />
            </div>
            <div className="message-bubble" style={{ background: 'var(--border)', fontStyle: 'italic', color: 'var(--text-muted)' }}>
              Typing...
            </div>
          </div>
        )}
        <div ref={endOfMessagesRef} />
      </div>
      
      <div className="chat-input-area">
        <div className="input-box-wrapper">
          <input 
            type="text" 
            className="chat-input" 
            placeholder={session.status === 'completed' ? "Interview complete." : "Type your answer... (Enter to send)"}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={isTyping || session.status === 'completed'}
          />
          <button className="send-btn" onClick={handleSend} disabled={isTyping || session.status === 'completed'}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
