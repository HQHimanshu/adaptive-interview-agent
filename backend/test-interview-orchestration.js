const assert = require('assert');
const { describe, it } = require('node:test');
const app = require('./app');

const llmService = require('./src/services/llmService');
const breethServiceModule = require('./src/services/breethService');

function startServer() {
    const server = app.listen(0);
    const port = server.address().port;
    return { server, url: `http://127.0.0.1:${port}` };
}

async function postJson(url, path, body) {
    const res = await fetch(url + path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    const json = await res.json();
    return { status: res.status, json };
}

describe('Interview Orchestration', () => {
    it('START -> returns reply and creates session', async () => {
        // stub LLM to return a first question
        const originalGen = llmService.generateInterviewResponse;
        llmService.generateInterviewResponse = async () => 'What is your experience with Node.js?';

        const { server, url } = startServer();

        const payload = { sessionId: 'test-interview-001', candidate: { member: { id: 'c-1', name: 'Test' }, missions: [], signals: {} } };
        const { status, json } = await postJson(url, '/api/interview', payload);

        assert.strictEqual(status, 200);
        assert.strictEqual(typeof json.reply, 'string');
        assert.strictEqual(json.done, false);

        llmService.generateInterviewResponse = originalGen;
        server.close();
    });

    it('CONTINUE -> records answer and returns assistant reply', async () => {
        const originalGen = llmService.generateInterviewResponse;
        // First call returns a question, second returns next question
        let calls = 0;
        llmService.generateInterviewResponse = async () => {
            calls += 1;
            if (calls === 1) return 'Initial question?';
            if (calls === 2) return 'Next question?';
            return '{"summary":"ok","strengths":[],"gaps":[],"next":[]}';
        };

        // stub breeth to no-op
        const originalCreateAdapter = breethServiceModule.createBreethCommandAdapter;
        breethServiceModule.createBreethCommandAdapter = () => ({ saveSessionMemory: async () => { }, updateSessionMemory: async () => { }, getSessionMemory: async () => null });

        const { server, url } = startServer();

        // start
        const startPayload = { sessionId: 'test-interview-002', candidate: { member: { id: 'c-2', name: 'Test2' }, missions: [], signals: {} } };
        const s1 = await postJson(url, '/api/interview', startPayload);
        assert.strictEqual(s1.status, 200);

        // continue
        const cont = await postJson(url, '/api/interview', { sessionId: 'test-interview-002', message: 'I have used Node.' });
        assert.strictEqual(cont.status, 200);
        assert.strictEqual(typeof cont.json.reply, 'string');
        assert.strictEqual(cont.json.done, false);

        llmService.generateInterviewResponse = originalGen;
        breethServiceModule.createBreethCommandAdapter = originalCreateAdapter;
        server.close();
    });

    it('UNKNOWN SESSION -> 404', async () => {
        const { server, url } = startServer();
        const res = await postJson(url, '/api/interview', { sessionId: 'does-not-exist', message: 'hello' });
        assert.strictEqual(res.status, 404);
        server.close();
    });
});
