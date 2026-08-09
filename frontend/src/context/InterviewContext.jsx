import React, { createContext, useContext, useState, useEffect } from 'react';

const InterviewContext = createContext();

export function useInterview() {
  return useContext(InterviewContext);
}

export function InterviewProvider({ children }) {
  // Try to load initial state from sessionStorage to persist across refreshes
  const loadState = (key, defaultValue) => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      return defaultValue;
    }
  };

  const [sessionId, setSessionId] = useState(() => loadState('sessionId', null));
  const [candidate, setCandidate] = useState(() => loadState('candidate', null));
  const [conversation, setConversation] = useState(() => loadState('conversation', []));
  const [feedback, setFeedback] = useState(() => loadState('feedback', null));
  const [isComplete, setIsComplete] = useState(() => loadState('isComplete', false));

  // Persist state changes to sessionStorage
  useEffect(() => {
    if (sessionId) sessionStorage.setItem('sessionId', JSON.stringify(sessionId));
  }, [sessionId]);

  useEffect(() => {
    if (candidate) sessionStorage.setItem('candidate', JSON.stringify(candidate));
  }, [candidate]);

  useEffect(() => {
    sessionStorage.setItem('conversation', JSON.stringify(conversation));
  }, [conversation]);

  useEffect(() => {
    if (feedback) sessionStorage.setItem('feedback', JSON.stringify(feedback));
  }, [feedback]);

  useEffect(() => {
    sessionStorage.setItem('isComplete', JSON.stringify(isComplete));
  }, [isComplete]);

  const addMessage = (message) => {
    setConversation((prev) => [...prev, message]);
  };

  const startNewSession = (newSessionId, newCandidate) => {
    setSessionId(newSessionId);
    setCandidate(newCandidate);
    setConversation([]);
    setFeedback(null);
    setIsComplete(false);
    sessionStorage.clear(); // Clear old session data
    sessionStorage.setItem('sessionId', JSON.stringify(newSessionId));
    sessionStorage.setItem('candidate', JSON.stringify(newCandidate));
  };

  const endInterview = (finalFeedback) => {
    setIsComplete(true);
    setFeedback(finalFeedback);
  };

  const value = {
    sessionId,
    candidate,
    conversation,
    feedback,
    isComplete,
    addMessage,
    startNewSession,
    endInterview
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
}
