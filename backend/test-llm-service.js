require('dotenv').config();

const {
    buildInitialInterviewPrompt,
} = require('./src/services/promptBuilder');
const {
    buildGroqMessages,
    createGroqClient,
    generateInterviewResponse,
    getGroqApiKey,
    getGroqModel,
} = require('./src/services/llmService');

const curriculumData = require('../curriculum.json');

const candidate = {
    member: {
        id: 'CAND-001',
        name: 'Sarah Johnson',
        jobRole: 'Senior Data Engineer',
        yearsExperience: 9,
        education: 'MS Computer Science',
        status: 'COMPLETED',
    },
    missions: [
        { day: 7, title: 'Embeddings Explained', passed: true, attempts: 1 },
        { day: 23, title: 'Model Context Protocol (MCP)', passed: true, attempts: 2 },
    ],
    signals: {
        commitDays: 28,
        missionsCompleted: 30,
        missionsFirstTry: 20,
    },
};

const session = {
    sessionId: 'test-session-llm',
    candidate,
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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

async function run() {
    console.log('Running LLM service test...');

    const promptSections = buildInitialInterviewPrompt({
        candidate,
        curriculumData,
        session,
    });

    console.log('Built initial prompt sections.');

    const messages = buildGroqMessages(promptSections);
    console.log('Converted prompt sections into Groq messages.');
    console.log('Message count:', messages.length);

    if (!messages[0] || !messages[1]) {
        throw new Error('Expected two message entries for Groq chat completion.');
    }

    console.log('Groq messages are valid.');

    console.log('GROQ_API_KEY present:', !!process.env.GROQ_API_KEY);
    console.log('GROQ_MODEL present:', !!process.env.GROQ_MODEL);

    const apiKey = getGroqApiKey();
    const model = getGroqModel();
    console.log('Resolved Groq model:', model);

    const client = createGroqClient({ apiKey });
    console.log('Created Groq client successfully.');

    if (apiKey && model) {
        console.log('Attempting real Groq chat completion...');
        const reply = await generateInterviewResponse(promptSections, { client, model });
        console.log('Groq reply received:', typeof reply === 'string' ? 'string' : typeof reply);
        console.log('Reply preview:', reply.slice(0, 200));
    } else {
        console.log('Skipping real Groq request because GROQ_API_KEY or GROQ_MODEL is missing.');
    }
}

run().catch((error) => {
    console.error('LLM service test failed:', error.message || error);
    process.exit(1);
});
