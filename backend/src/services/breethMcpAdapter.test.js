const assert = require('assert');
const { describe, it } = require('node:test');
const { createBreethMcpAdapter, buildEpisodeContent, parseEpisodeContent } = require('./breethMcpAdapter');

function createMockClient({ listToolsResult = { tools: [] }, callToolResult = { isError: false, content: 'ok' } } = {}) {
    return {
        connect: async () => { },
        listTools: async () => listToolsResult,
        callTool: async () => callToolResult,
    };
}

const memory = {
    sessionId: 'breeth-test-session-001',
    candidateId: 'BREETH-TEST-001',
    candidateProfile: {
        name: 'Test Candidate',
        jobRole: 'Software Engineer',
        yearsExperience: 3,
        education: 'BS Computer Science',
        status: 'ACTIVE',
    },
    conversationHistory: [
        { role: 'interviewer', message: 'Tell me about your experience.' },
        { role: 'candidate', message: 'I have worked on Node.js applications.' },
    ],
    askedQuestions: ['Tell me about your experience.'],
    answers: ['I have worked on Node.js applications.'],
    progress: {
        stage: 'initial',
        currentQuestion: 1,
        totalQuestions: 3,
        answeredQuestions: 1,
    },
};

describe('Breeth MCP Adapter', () => {
    it('calls add_episode with the expected payload when saving memory', async () => {
        let captured = null;
        const clientFactory = async () => ({
            connect: async () => { },
            listTools: async () => ({ tools: [{ name: 'add_episode' }, { name: 'search' }] }),
            callTool: async ({ name, arguments: args }) => {
                captured = { name, args };
                return { isError: false, content: 'ok' };
            },
        });

        const adapter = createBreethMcpAdapter({ clientFactory });
        await adapter.saveSessionMemory(memory);

        assert.strictEqual(captured.name, 'add_episode');
        assert.strictEqual(captured.args.group_id, 'interview:breeth-test-session-001');
        assert.strictEqual(captured.args.extract_intent, false);
        assert.ok(captured.args.content.includes('Interview session breeth-test-session-001'));
    });

    it('calls search with the expected payload when retrieving memory', async () => {
        let captured = null;
        const clientFactory = async () => ({
            connect: async () => { },
            listTools: async () => ({ tools: [{ name: 'add_episode' }, { name: 'search' }] }),
            callTool: async ({ name, arguments: args }) => {
                captured = { name, args };
                return { isError: false, content: 'Interview session breeth-test-session-001 for candidate BREETH-TEST-001.' };
            },
        });

        const adapter = createBreethMcpAdapter({ clientFactory });
        const result = await adapter.getSessionMemory('breeth-test-session-001');

        assert.strictEqual(captured.name, 'search');
        assert.strictEqual(captured.args.group_id, 'interview:breeth-test-session-001');
        assert.strictEqual(captured.args.limit, 1);
        assert.strictEqual(result.sessionId, 'breeth-test-session-001');
        assert.strictEqual(result.candidateId, 'BREETH-TEST-001');
    });

    it('throws a clear error when required tools are missing', async () => {
        const clientFactory = async () => ({
            connect: async () => { },
            listTools: async () => ({ tools: [{ name: 'add_episode' }] }),
            callTool: async () => ({ isError: false, content: 'ok' }),
        });

        const adapter = createBreethMcpAdapter({ clientFactory });

        await assert.rejects(async () => {
            await adapter.getSessionMemory('breeth-test-session-001');
        }, {
            message: /missing required tool\(s\): search or search_graph/,
        });
    });

    it('falls back to search_graph when search is unavailable', async () => {
        let captured = null;
        const clientFactory = async () => ({
            connect: async () => { },
            listTools: async () => ({ tools: [{ name: 'add_episode' }, { name: 'search_graph' }] }),
            callTool: async ({ name, arguments: args }) => {
                captured = { name, args };
                return { isError: false, content: 'Interview session breeth-test-session-001 for candidate BREETH-TEST-001.' };
            },
        });

        const adapter = createBreethMcpAdapter({ clientFactory });
        const result = await adapter.getSessionMemory('breeth-test-session-001');

        assert.strictEqual(captured.name, 'search_graph');
        assert.strictEqual(captured.args.group_id, 'interview:breeth-test-session-001');
        assert.strictEqual(captured.args.limit, 1);
        assert.strictEqual(result.sessionId, 'breeth-test-session-001');
        assert.strictEqual(result.candidateId, 'BREETH-TEST-001');
    });

    it('does not expose secrets in tool errors', async () => {
        const clientFactory = async () => ({
            connect: async () => { },
            listTools: async () => ({ tools: [{ name: 'add_episode' }, { name: 'search' }] }),
            callTool: async () => ({ isError: true, content: 'tool failed' }),
        });

        const adapter = createBreethMcpAdapter({ clientFactory });

        await assert.rejects(async () => {
            await adapter.saveSessionMemory(memory);
        }, {
            message: /Breeth add_episode tool error: tool failed/,
        });
    });
});

describe('Breeth MCP content conversion', () => {
    it('serializes and parses episode content consistently', () => {
        const content = buildEpisodeContent(memory);
        const parsed = parseEpisodeContent(content);

        assert.strictEqual(parsed.sessionId, 'breeth-test-session-001');
        assert.strictEqual(parsed.candidateId, 'BREETH-TEST-001');
        assert.ok(parsed.candidateProfile.name.includes('Test Candidate'));
    });
});
