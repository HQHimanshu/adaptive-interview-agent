const express = require('express');
const { createSession, hasSession, getSession, appendConversation, addAskedQuestion, addCandidateAnswer, updateProgress, markCompleted, updateSession } = require('../services/sessionManager');
const { loadCandidateById } = require('../data/candidateLoader');
const { loadCurriculumData } = require('../data/curriculumLoader');
const { buildInitialInterviewPrompt, buildInterviewTurnPrompt, buildFinalEvaluationPrompt } = require('../services/promptBuilder');
const { generateInterviewResponse } = require('../services/llmService');
const { createBreethCommandAdapter, createBreethService } = require('../services/breethService');

const router = express.Router();

const DEFAULT_TOTAL_QUESTIONS = 2;

function badRequest(res, message) {
    return res.status(400).json({ error: message });
}

function notFound(res, message) {
    return res.status(404).json({ error: message });
}

function parseFeedbackText(text) {
    if (text && typeof text === 'object') return text;
    if (!text || typeof text !== 'string') return null;
    // Try direct JSON
    try {
        const parsed = JSON.parse(text);
        return parsed;
    } catch (e) {
        // Try to extract JSON block
        const match = text.match(/\{[\s\S]*\}/);
        if (match) {
            try {
                return JSON.parse(match[0]);
            } catch (e2) {
                return null;
            }
        }
    }
    return null;
}

// Lazy initialize Breeth service to allow tests to stub if needed
let breethServiceInstance = null;
function getBreethService() {
    if (breethServiceInstance) return breethServiceInstance;
    const adapter = createBreethCommandAdapter();
    breethServiceInstance = createBreethService(adapter);
    return breethServiceInstance;
}

router.post('/', async (req, res, next) => {
    try {
        const { sessionId, candidate, message } = req.body || {};

        if (!sessionId || typeof sessionId !== 'string') {
            return badRequest(res, 'sessionId is required and must be a non-empty string.');
        }

        // START INTERVIEW
        if (candidate) {
            if (hasSession(sessionId)) {
                return badRequest(res, `Session ${sessionId} already exists.`);
            }

            let resolvedCandidate = candidate;
            // If candidate contains an id, try to resolve a canonical record
            try {
                const id = candidate?.member?.id;
                if (id) resolvedCandidate = await loadCandidateById(id);
            } catch (e) {
                // If lookup fails, fall back to provided candidate object
                resolvedCandidate = candidate;
            }

            // create session
            const session = createSession(sessionId, resolvedCandidate);
            // set deterministic totalQuestions
            updateProgress(sessionId, { totalQuestions: DEFAULT_TOTAL_QUESTIONS, currentQuestion: 1, answeredQuestions: 0 });

            const curriculumData = await loadCurriculumData();

            const promptSections = buildInitialInterviewPrompt({ candidate: resolvedCandidate, curriculumData, session });
            const reply = await generateInterviewResponse(promptSections);

            // record assistant reply and asked question
            appendConversation(sessionId, 'assistant', reply);
            addAskedQuestion(sessionId, reply);

            // Persist memory to Breeth
            try {
                const breeth = getBreethService();
                await breeth.saveSessionMemory({
                    sessionId,
                    candidateId: resolvedCandidate?.member?.id ?? '',
                    candidateProfile: resolvedCandidate,
                    conversationHistory: getSession(sessionId).conversationHistory,
                    askedQuestions: getSession(sessionId).askedQuestions,
                    answers: getSession(sessionId).answers,
                    progress: getSession(sessionId).progress,
                });
            } catch (e) {
                // Don't fail the interview due to Breeth persistence; log and continue
                console.error('Breeth save error:', e.message || e);
            }

            return res.status(200).json({ reply, done: false });
        }

        // CONTINUE INTERVIEW
        if (message) {
            if (!hasSession(sessionId)) return notFound(res, `Session ${sessionId} not found.`);

            const session = getSession(sessionId);
            if (session.status === 'COMPLETED') {
                return badRequest(res, 'Interview already completed.');
            }

            // record candidate response
            appendConversation(sessionId, 'candidate', message);
            addCandidateAnswer(sessionId, message);
            const updated = updateProgress(sessionId, { answeredQuestions: session.progress.answeredQuestions + 1 });

            const curriculumData = await loadCurriculumData();
            const updatedSession = getSession(sessionId);

            // Build prompt for turn
            const promptSections = buildInterviewTurnPrompt({ candidate: updatedSession.candidate, curriculumData, session: updatedSession, latestMessage: message });
            const reply = await generateInterviewResponse(promptSections);

            // record assistant reply and asked question
            appendConversation(sessionId, 'assistant', reply);
            addAskedQuestion(sessionId, reply);

            // After recording, determine if interview is complete
            const finalSession = getSession(sessionId);
            if (finalSession.progress.answeredQuestions >= (finalSession.progress.totalQuestions || DEFAULT_TOTAL_QUESTIONS)) {
                // Final evaluation
                updateProgress(sessionId, { currentQuestion: null });
                markCompleted(sessionId);

                const curriculumData2 = await loadCurriculumData();
                const evalPrompt = buildFinalEvaluationPrompt({ candidate: finalSession.candidate, curriculumData: curriculumData2, session: finalSession });
                const evalReply = await generateInterviewResponse(evalPrompt);

                const feedback = parseFeedbackText(evalReply);
                if (!feedback || typeof feedback.summary !== 'string' || !Array.isArray(feedback.strengths) || !Array.isArray(feedback.gaps) || !Array.isArray(feedback.next)) {
                    // If parsing failed, return server error
                    throw new Error('Failed to parse final feedback from LLM.');
                }

                // store feedback in session
                updateSession(sessionId, { feedback });

                // persist final memory
                try {
                    const breeth = getBreethService();
                    await breeth.updateSessionMemory(sessionId, {
                        sessionId,
                        candidateId: finalSession.candidate?.member?.id ?? '',
                        candidateProfile: finalSession.candidate,
                        conversationHistory: finalSession.conversationHistory,
                        askedQuestions: finalSession.askedQuestions,
                        answers: finalSession.answers,
                        progress: finalSession.progress,
                    });
                } catch (e) {
                    console.error('Breeth final save error:', e.message || e);
                }

                return res.status(200).json({ reply: 'Interview completed.', done: true, feedback });
            }

            // Persist intermediate state
            try {
                const breeth = getBreethService();
                const s = getSession(sessionId);
                await breeth.updateSessionMemory(sessionId, {
                    sessionId,
                    candidateId: s.candidate?.member?.id ?? '',
                    candidateProfile: s.candidate,
                    conversationHistory: s.conversationHistory,
                    askedQuestions: s.askedQuestions,
                    answers: s.answers,
                    progress: s.progress,
                });
            } catch (e) {
                console.error('Breeth update error:', e.message || e);
            }

            return res.status(200).json({ reply, done: false });
        }

        return badRequest(res, 'Either candidate (to start) or message (to continue) must be provided.');
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
