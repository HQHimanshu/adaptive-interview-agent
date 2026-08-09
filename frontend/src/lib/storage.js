export const STORAGE_KEY = 'abt_sessions';

function getStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function setStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateSessionId() {
  return 'ABT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export function createSession(candidateData) {
  const sessions = getStorage();
  const sessionId = generateSessionId();
  
  const newSession = {
    id: sessionId,
    created_at: new Date().toISOString(),
    candidate: candidateData,
    status: 'in_progress',
    messages: [],
    question_count: 0,
    feedback: null
  };
  
  sessions[sessionId] = newSession;
  setStorage(sessions);
  
  return newSession;
}

export function getSession(id) {
  return getStorage()[id];
}

export function updateSession(id, data) {
  const sessions = getStorage();
  if (sessions[id]) {
    sessions[id] = { ...sessions[id], ...data };
    setStorage(sessions);
    return sessions[id];
  }
  return null;
}

export function getSessions() {
  const sessions = getStorage();
  return Object.values(sessions).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
