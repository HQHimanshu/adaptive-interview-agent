/**
 * @typedef {Object} CandidateMember
 * @property {string} id
 * @property {string} name
 * @property {string} jobRole
 * @property {number} yearsExperience
 * @property {string} education
 * @property {string} status
 */

/**
 * @typedef {Object} CandidateMission
 * @property {number} day
 * @property {string} title
 * @property {boolean} [passed]
 * @property {boolean} [skipped]
 * @property {number} [attempts]
 */

/**
 * @typedef {Object} CandidateSignals
 * @property {number} commitDays
 * @property {number} missionsCompleted
 * @property {number} missionsFirstTry
 */

/**
 * @typedef {Object} CandidateProfile
 * @property {CandidateMember} member
 * @property {CandidateMission[]} missions
 * @property {CandidateSignals} signals
 */

/**
 * @typedef {Object} CurriculumModule
 * @property {number} n
 * @property {string} title
 * @property {number[]} days
 */

/**
 * @typedef {Object} CurriculumDay
 * @property {number} day
 * @property {string} title
 * @property {string} type
 * @property {string[]} tools
 * @property {string[]} objectives
 */

/**
 * @typedef {Object} CurriculumData
 * @property {string} cohort
 * @property {CurriculumModule[]} modules
 * @property {CurriculumDay[]} days
 */

/**
 * @typedef {Object} InterviewSessionProgress
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
 * @property {CandidateProfile} candidate
 * @property {string} startedAt
 * @property {string} updatedAt
 * @property {'ACTIVE'|'COMPLETED'} status
 * @property {ConversationEntry[]} conversationHistory
 * @property {string[]} askedQuestions
 * @property {string[]} answers
 * @property {InterviewSessionProgress} progress
 * @property {Object} metadata
 */

/**
 * @typedef {Object} PromptSections
 * @property {string} system
 * @property {string} candidateContext
 * @property {string} curriculumContext
 * @property {string} interviewState
 * @property {string} conversationHistory
 * @property {string} instruction
 */

/**
 * @param {any} value
 * @param {string} name
 */
function assertObject(value, name) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error(`${name} must be a non-empty object.`);
    }
}

/**
 * @param {CandidateProfile} candidate
 * @returns {string}
 */
function buildCandidateSummary(candidate) {
    assertObject(candidate, 'candidate');
    const member = candidate.member || {};
    const signals = candidate.signals || {};
    const missions = Array.isArray(candidate.missions) ? candidate.missions : [];

    const memberLines = [
        `Name: ${member.name || 'Unknown'}`,
        `Role: ${member.jobRole || 'Unknown'}`,
        `Experience: ${typeof member.yearsExperience === 'number' ? member.yearsExperience + ' years' : 'Unknown'}`,
        `Education: ${member.education || 'Unknown'}`,
        `Status: ${member.status || 'Unknown'}`,
    ];

    const missionCount = missions.length;
    const passedCount = missions.filter((mission) => mission.passed === true).length;
    const skippedCount = missions.filter((mission) => mission.skipped === true).length;

    const missionLines = [
        `Completed missions: ${missionCount}`,
        `Passed missions: ${passedCount}`,
        `Skipped missions: ${skippedCount}`,
    ];

    const signalLines = [];
    if (typeof signals.commitDays === 'number') {
        signalLines.push(`Commit days: ${signals.commitDays}`);
    }
    if (typeof signals.missionsCompleted === 'number') {
        signalLines.push(`Missions completed: ${signals.missionsCompleted}`);
    }
    if (typeof signals.missionsFirstTry === 'number') {
        signalLines.push(`Missions passed first try: ${signals.missionsFirstTry}`);
    }

    return [
        'Candidate profile:',
        ...memberLines,
        '',
        'Candidate learning signals:',
        ...missionLines,
        ...(signalLines.length ? ['', ...signalLines] : []),
    ].join('\n');
}

/**
 * @param {CandidateProfile} candidate
 * @param {CurriculumData} curriculumData
 * @returns {string}
 */
function buildRelevantCurriculumContext(candidate, curriculumData) {
    assertObject(candidate, 'candidate');
    assertObject(curriculumData, 'curriculumData');

    const missionDays = Array.isArray(candidate.missions)
        ? candidate.missions.map((mission) => mission.day).filter((day) => typeof day === 'number')
        : [];

    const relevantModules = Array.isArray(curriculumData.modules)
        ? curriculumData.modules.filter((module) =>
            module.days.some((day) => missionDays.includes(day))
        )
        : [];

    const relevantDays = Array.isArray(curriculumData.days)
        ? curriculumData.days.filter((dayEntry) => missionDays.includes(dayEntry.day))
        : [];

    const moduleLines = relevantModules.length
        ? relevantModules.map((module) => `Module ${module.n}: ${module.title}`)
        : ['No relevant module context available.'];

    const dayLines = relevantDays.length
        ? relevantDays.map((dayEntry) => `Day ${dayEntry.day}: ${dayEntry.title} (${dayEntry.type})`)
        : ['No relevant day-level curriculum context available.'];

    const objectiveLines = relevantDays.flatMap((dayEntry) =>
        Array.isArray(dayEntry.objectives)
            ? dayEntry.objectives.map((objective) => `- ${objective}`)
            : []
    );

    return [
        'Relevant curriculum context:',
        ...moduleLines,
        '',
        ...dayLines,
        ...(objectiveLines.length ? ['', 'Related objectives:'] : []),
        ...objectiveLines,
    ].join('\n');
}

/**
 * @param {InterviewSession} session
 * @returns {string}
 */
function buildInterviewState(session) {
    assertObject(session, 'session');
    const progress = session.progress || {};

    const stateLines = [
        `Session ID: ${session.sessionId || 'N/A'}`,
        `Status: ${session.status || 'N/A'}`,
        `Started at: ${session.startedAt || 'N/A'}`,
        `Last updated: ${session.updatedAt || 'N/A'}`,
        '',
        'Interview progress:',
        `Current question: ${progress.currentQuestion || 'None'}`,
        `Total questions expected: ${typeof progress.totalQuestions === 'number' ? progress.totalQuestions : 'Unknown'}`,
        `Answered questions: ${typeof progress.answeredQuestions === 'number' ? progress.answeredQuestions : 'Unknown'}`,
    ];

    return stateLines.join('\n');
}

/**
 * @param {ConversationEntry[]} conversationHistory
 * @returns {string}
 */
function buildConversationHistory(conversationHistory) {
    if (!Array.isArray(conversationHistory) || conversationHistory.length === 0) {
        return 'No conversation history yet.';
    }

    return conversationHistory
        .map((entry, index) => {
            const role = entry.role || 'unknown';
            const message = entry.message || '';
            return `${index + 1}. ${role}: ${message}`;
        })
        .join('\n');
}

/**
 * @param {string[]} askedQuestions
 * @param {string[]} answers
 * @returns {string}
 */
function buildQuestionAnswerSummary(askedQuestions, answers) {
    const questions = Array.isArray(askedQuestions) ? askedQuestions : [];
    const answerList = Array.isArray(answers) ? answers : [];

    if (questions.length === 0) {
        return 'No questions have been asked yet.';
    }

    const lines = questions.map((question, index) => {
        const answer = answerList[index] || '[No answer recorded]';
        return `${index + 1}. Q: ${question}\n   A: ${answer}`;
    });

    return ['Question and answer summary:', ...lines].join('\n');
}

/**
 * @param {CandidateProfile} candidate
 * @param {CurriculumData} curriculumData
 * @param {InterviewSession} session
 * @param {string} instruction
 * @returns {PromptSections}
 */
function buildBasePromptSections(candidate, curriculumData, session, instruction) {
    assertObject(candidate, 'candidate');
    assertObject(curriculumData, 'curriculumData');
    assertObject(session, 'session');
    if (!instruction || typeof instruction !== 'string') {
        throw new Error('instruction must be a non-empty string.');
    }

    return {
        system: [
            'You are a technical interview assistant.',
            'You conduct adaptive interview conversations for a candidate based on provided learning history and curriculum context.',
            'Use a helpful, conversational tone.',
            'Do not invent facts about the candidate beyond the supplied profile.',
        ].join('\n'),
        candidateContext: buildCandidateSummary(candidate),
        curriculumContext: buildRelevantCurriculumContext(candidate, curriculumData),
        interviewState: buildInterviewState(session),
        conversationHistory: buildConversationHistory(session.conversationHistory),
        instruction,
    };
}

/**
 * @param {Object} params
 * @param {CandidateProfile} params.candidate
 * @param {CurriculumData} params.curriculumData
 * @param {InterviewSession} params.session
 * @returns {PromptSections}
 */
function buildInitialInterviewPrompt({ candidate, curriculumData, session }) {
    const instruction = [
        'Begin the interview with the candidate.',
        'Use the candidate profile and learning context to ask an appropriate first technical question.',
        'Keep the conversation adaptive and conversational.',
        'Do not provide feedback yet.',
        'Do not conclude the interview.',
        'The first response should be a question that invites the candidate to demonstrate their understanding.',
    ].join(' ');

    return buildBasePromptSections(candidate, curriculumData, session, instruction);
}

/**
 * @param {Object} params
 * @param {CandidateProfile} params.candidate
 * @param {CurriculumData} params.curriculumData
 * @param {InterviewSession} params.session
 * @param {string} params.latestMessage
 * @returns {PromptSections}
 */
function buildInterviewTurnPrompt({ candidate, curriculumData, session, latestMessage }) {
    if (!latestMessage || typeof latestMessage !== 'string') {
        throw new Error('latestMessage must be a non-empty string.');
    }

    const instruction = [
        'Continue the interview as the interviewer.',
        'Acknowledge the candidate response and ask the next relevant question.',
        'Preserve conversational continuity and do not restart the interview.',
        'Use the candidate history, asked questions, and interview progress to decide what to ask next.',
        'Do not provide final feedback yet.',
    ].join(' ');

    const prompt = buildBasePromptSections(candidate, curriculumData, session, instruction);
    prompt.interviewState += `\n\nLatest candidate response: ${latestMessage}`;
    return prompt;
}

/**
 * @param {Object} params
 * @param {CandidateProfile} params.candidate
 * @param {CurriculumData} params.curriculumData
 * @param {InterviewSession} params.session
 * @returns {PromptSections}
 */
function buildFinalEvaluationPrompt({ candidate, curriculumData, session }) {
    const instruction = [
        'You are evaluating the completed interview for this candidate.',
        'Use the full interview history, candidate profile, and curriculum context to produce structured feedback.',
        'Return only the evaluation prompt, not the final feedback content.',
        'The future LLM should generate JSON with the fields: summary, strengths, gaps, and next.',
        'Do not ask additional questions in this prompt.',
    ].join(' ');

    return buildBasePromptSections(candidate, curriculumData, session, instruction);
}

module.exports = {
    buildInitialInterviewPrompt,
    buildInterviewTurnPrompt,
    buildFinalEvaluationPrompt,
};
