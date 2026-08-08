const Groq = require('groq-sdk');

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
 * @param {string} value
 * @param {string} name
 */
function assertString(value, name) {
    if (!value || typeof value !== 'string') {
        throw new Error(`${name} must be a non-empty string.`);
    }
}

/**
 * @param {PromptSections} promptSections
 * @returns {void}
 */
function validatePromptSections(promptSections) {
    assertObject(promptSections, 'promptSections');

    const requiredFields = [
        'system',
        'candidateContext',
        'curriculumContext',
        'interviewState',
        'conversationHistory',
        'instruction',
    ];

    requiredFields.forEach((field) => {
        if (!promptSections[field] || typeof promptSections[field] !== 'string') {
            throw new Error(`promptSections.${field} must be a non-empty string.`);
        }
    });
}

/**
 * @param {string} candidateContext
 * @param {string} curriculumContext
 * @param {string} interviewState
 * @param {string} conversationHistory
 * @param {string} instruction
 * @returns {string}
 */
function buildUserContent(
    candidateContext,
    curriculumContext,
    interviewState,
    conversationHistory,
    instruction
) {
    return [
        'Candidate context:',
        candidateContext,
        '',
        'Curriculum context:',
        curriculumContext,
        '',
        'Interview state:',
        interviewState,
        '',
        'Conversation history:',
        conversationHistory,
        '',
        'Instruction:',
        instruction,
    ].join('\n');
}

/**
 * @param {PromptSections} promptSections
 * @returns {Array<{ role: string, content: string }>}
 */
function buildGroqMessages(promptSections) {
    validatePromptSections(promptSections);

    return [
        {
            role: 'system',
            content: promptSections.system,
        },
        {
            role: 'user',
            content: buildUserContent(
                promptSections.candidateContext,
                promptSections.curriculumContext,
                promptSections.interviewState,
                promptSections.conversationHistory,
                promptSections.instruction
            ),
        },
    ];
}

/**
 * @param {string} apiKey
 * @returns {string}
 */
function getGroqApiKey(apiKey) {
    const resolvedKey = apiKey || process.env.GROQ_API_KEY;

    if (!resolvedKey || typeof resolvedKey !== 'string') {
        throw new Error('Groq configuration error: missing GROQ_API_KEY.');
    }

    return resolvedKey;
}

/**
 * @param {string} model
 * @returns {string}
 */
function getGroqModel(model) {
    const resolvedModel = model || process.env.GROQ_MODEL;

    if (!resolvedModel || typeof resolvedModel !== 'string') {
        throw new Error('Groq configuration error: missing GROQ_MODEL.');
    }

    return resolvedModel;
}

/**
 * @param {Object} [options]
 * @param {string} [options.apiKey]
 * @returns {import('groq-sdk').Groq}
 */
function createGroqClient({ apiKey } = {}) {
    const resolvedApiKey = getGroqApiKey(apiKey);
    return new Groq({ apiKey: resolvedApiKey });
}

/**
 * @param {any} response
 * @returns {string}
 */
function parseGroqResponse(response) {
    if (!response || typeof response !== 'object') {
        throw new Error('Groq response was empty or malformed.');
    }

    const choices = Array.isArray(response.choices) ? response.choices : [];

    if (choices.length === 0) {
        throw new Error('Groq response contained no choices.');
    }

    const firstChoice = choices[0];
    const content = firstChoice?.message?.content;

    if (!content || typeof content !== 'string') {
        throw new Error('Groq response did not contain message content.');
    }

    return content.trim();
}

/**
 * Generate an interview response from Groq using a structured prompt.
 * @param {PromptSections} promptSections
 * @param {Object} [options]
 * @param {Object} [options.client] - Optional Groq client for testing.
 * @param {string} [options.model] - Optional model override.
 * @returns {Promise<string>}
 */
async function generateInterviewResponse(promptSections, { client, model } = {}) {
    const messages = buildGroqMessages(promptSections);
    const resolvedModel = getGroqModel(model);
    const resolvedClient = client || createGroqClient();

    try {
        const completion = await resolvedClient.chat.completions.create({
            model: resolvedModel,
            messages,
        });

        return parseGroqResponse(completion);
    } catch (error) {
        if (error instanceof Groq.APIError) {
            const details = error.message || 'Request failed.';
            throw new Error(`Groq API error (${error.name || 'APIError'}): ${details}`);
        }

        throw error;
    }
}

module.exports = {
    buildGroqMessages,
    createGroqClient,
    generateInterviewResponse,
    getGroqApiKey,
    getGroqModel,
};
