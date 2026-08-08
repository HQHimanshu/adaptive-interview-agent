const sessions = new Map();

/**
 * @typedef {Object} SessionProgress
 * @property {string|null} currentQuestion
 * @property {number} totalQuestions
 * @property {number} answeredQuestions
 */

/**
 * @typedef {Object} ConversationEntry
 * @property {string} role
 * @property {string} message
 * @property {string} timestamp
 */

/**
 * @typedef {Object} InterviewSession
 * @property {string} sessionId
 * @property {Object} candidate
 * @property {string} startedAt
 * @property {string} updatedAt
 * @property {'ACTIVE'|'COMPLETED'} status
 * @property {ConversationEntry[]} conversationHistory
 * @property {string[]} askedQuestions
 * @property {string[]} answers
 * @property {SessionProgress} progress
 * @property {Object} metadata
 */

/**
 * @param {string} sessionId
 * @returns {string}
 */
function validateSessionId(sessionId) {
    if (!sessionId || typeof sessionId !== 'string') {
        throw new Error('Invalid sessionId: sessionId must be a non-empty string.');
    }

    return sessionId;
}

/**
 * @returns {string}
 */
function createTimestamp() {
    return new Date().toISOString();
}

/**
 * @param {string} sessionId
 * @returns {InterviewSession}
 */
function getExistingSession(sessionId) {
    validateSessionId(sessionId);

    const session = sessions.get(sessionId);

    if (!session) {
        throw new Error(`Session not found for sessionId: ${sessionId}`);
    }

    return session;
}

/**
 * Create a new interview session and store it in memory.
 * @param {string} sessionId
 * @param {Object} candidate
 * @returns {InterviewSession}
 */
function createSession(sessionId, candidate) {
    validateSessionId(sessionId);

    if (!candidate || typeof candidate !== 'object') {
        throw new Error('Invalid candidate: candidate must be a non-empty object.');
    }

    if (sessions.has(sessionId)) {
        throw new Error(`Duplicate session creation is not allowed for sessionId: ${sessionId}`);
    }

    const timestamp = createTimestamp();
    const session = {
        sessionId,
        candidate,
        startedAt: timestamp,
        updatedAt: timestamp,
        status: 'ACTIVE',
        conversationHistory: [],
        askedQuestions: [],
        answers: [],
        progress: {
            currentQuestion: null,
            totalQuestions: 0,
            answeredQuestions: 0,
        },
        metadata: {},
    };

    sessions.set(sessionId, session);
    return session;
}

/**
 * Retrieve a session by sessionId.
 * @param {string} sessionId
 * @returns {InterviewSession|undefined}
 */
function getSession(sessionId) {
    validateSessionId(sessionId);
    return sessions.get(sessionId);
}

/**
 * Check if a session exists.
 * @param {string} sessionId
 * @returns {boolean}
 */
function hasSession(sessionId) {
    validateSessionId(sessionId);
    return sessions.has(sessionId);
}

/**
 * Update session fields with provided values.
 * @param {string} sessionId
 * @param {Partial<InterviewSession>} updates
 * @returns {InterviewSession}
 */
function updateSession(sessionId, updates) {
    const session = getExistingSession(sessionId);

    if (!updates || typeof updates !== 'object') {
        throw new Error('Invalid updates: updates must be an object.');
    }

    const mergedSession = {
        ...session,
        ...updates,
        updatedAt: createTimestamp(),
    };

    sessions.set(sessionId, mergedSession);
    return mergedSession;
}

/**
 * Append a message to the session's conversation history.
 * @param {string} sessionId
 * @param {string} role
 * @param {string} message
 * @returns {ConversationEntry}
 */
function appendConversation(sessionId, role, message) {
    const session = getExistingSession(sessionId);

    if (!role || typeof role !== 'string') {
        throw new Error('Invalid role: role must be a non-empty string.');
    }

    if (!message || typeof message !== 'string') {
        throw new Error('Invalid message: message must be a non-empty string.');
    }

    const entry = {
        role,
        message,
        timestamp: createTimestamp(),
    };

    session.conversationHistory.push(entry);
    session.updatedAt = createTimestamp();
    sessions.set(sessionId, session);

    return entry;
}

/**
 * Record a question that has been asked during the interview.
 * @param {string} sessionId
 * @param {string} question
 * @returns {string}
 */
function addAskedQuestion(sessionId, question) {
    const session = getExistingSession(sessionId);

    if (!question || typeof question !== 'string') {
        throw new Error('Invalid question: question must be a non-empty string.');
    }

    session.askedQuestions.push(question);
    session.updatedAt = createTimestamp();
    sessions.set(sessionId, session);

    return question;
}

/**
 * Record a candidate answer in the session.
 * @param {string} sessionId
 * @param {string} answer
 * @returns {string}
 */
function addCandidateAnswer(sessionId, answer) {
    const session = getExistingSession(sessionId);

    if (!answer || typeof answer !== 'string') {
        throw new Error('Invalid answer: answer must be a non-empty string.');
    }

    session.answers.push(answer);
    session.updatedAt = createTimestamp();
    sessions.set(sessionId, session);

    return answer;
}

/**
 * Update the interview progress object for a session.
 * @param {string} sessionId
 * @param {Partial<SessionProgress>} progress
 * @returns {SessionProgress}
 */
function updateProgress(sessionId, progress) {
    const session = getExistingSession(sessionId);

    if (!progress || typeof progress !== 'object') {
        throw new Error('Invalid progress: progress must be an object.');
    }

    session.progress = {
        ...session.progress,
        ...progress,
    };

    session.updatedAt = createTimestamp();
    sessions.set(sessionId, session);

    return session.progress;
}

/**
 * Mark the session as completed.
 * @param {string} sessionId
 * @returns {InterviewSession}
 */
function markCompleted(sessionId) {
    const session = getExistingSession(sessionId);

    session.status = 'COMPLETED';
    session.updatedAt = createTimestamp();
    sessions.set(sessionId, session);

    return session;
}

/**
 * Delete a session from memory.
 * @param {string} sessionId
 * @returns {boolean}
 */
function deleteSession(sessionId) {
    validateSessionId(sessionId);
    return sessions.delete(sessionId);
}

module.exports = {
    createSession,
    getSession,
    hasSession,
    updateSession,
    appendConversation,
    addAskedQuestion,
    addCandidateAnswer,
    updateProgress,
    markCompleted,
    deleteSession,
};
