require('dotenv').config();
const { createBreethMcpAdapter } = require('./src/services/breethMcpAdapter');

async function run() {
    const apiKey = process.env.BREETH_API_KEY;
    if (!apiKey || typeof apiKey !== 'string') {
        console.error('Skipping Breeth integration test because BREETH_API_KEY is not set.');
        process.exit(0);
    }

    console.log('Running real Breeth MCP integration test...');

    const adapter = createBreethMcpAdapter({ apiKey });
    const memory = {
        sessionId: 'breeth-test-session-001',
        candidateId: 'BREETH-TEST-001',
        candidateProfile: {
            name: 'Test Candidate',
            jobRole: 'Test Engineer',
            yearsExperience: 1,
            education: 'Test Degree',
            status: 'TEST',
        },
        conversationHistory: [
            { role: 'interviewer', message: 'This is a Breeth integration test.' },
            { role: 'candidate', message: 'This is a safe test answer.' },
        ],
        askedQuestions: ['This is a Breeth integration test.'],
        answers: ['This is a safe test answer.'],
        progress: {
            stage: 'test',
            currentQuestion: 1,
            totalQuestions: 1,
            answeredQuestions: 1,
        },
    };

    try {
        console.log('Saving test session memory to Breeth...');
        const saved = await adapter.saveSessionMemory(memory);
        console.log('Saved test memory successfully for session:', saved.sessionId);

        console.log('Retrieving test session memory from Breeth...');
        const retrieved = await adapter.getSessionMemory(memory.sessionId);
        if (!retrieved) {
            throw new Error('No Breeth memory found for test session.');
        }

        console.log('Retrieved Breeth memory session:', retrieved.sessionId);
        console.log('Parsed candidateId:', retrieved.candidateId || 'unknown');
        console.log('Structured content keys:', Object.keys(retrieved.structuredContent || {}));
        console.log('Raw content (full or structured):');
        console.log(JSON.stringify(retrieved.structuredContent ?? retrieved.rawContent ?? null, null, 2));
        console.log('Raw content length:', String(retrieved.rawContent ?? JSON.stringify(retrieved.structuredContent ?? '')).length);
        process.exit(0);
    } catch (error) {
        console.error('Breeth integration test failed:', error.message || error);
        process.exit(1);
    }
}

run();
