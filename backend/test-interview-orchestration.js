const assert = require('assert');
const { describe, it } = require('node:test');

const llmService = require('./src/services/llmService');
const breethServiceModule = require('./src/services/breethService');
const sessionManager = require('./src/services/sessionManager');

function clearAppCache() {
    const appPath = require.resolve('./app');
    const interviewRoutePath = require.resolve('./src/routes/interview');
    const interviewControllerPath = require.resolve('./src/controllers/interviewController');
    delete require.cache[appPath];
    delete require.cache[interviewRoutePath];
    delete require.cache[interviewControllerPath];
}

function loadApp() {
    clearAppCache();
    return require('./app');
}

function startServer(appInstance) {
    const server = appInstance.listen(0);
    const port = server.address().port;
    return { server, url: `http://127.0.0.1:${port}` };
}

function closeServer(server) {
    return new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) return reject(err);
            resolve();
        });
    });
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
        const originalGen = llmService.generateInterviewResponse;
        const originalCreateAdapter = breethServiceModule.createBreethCommandAdapter;

        // stub LLM and Breeth
        llmService.generateInterviewResponse = async () => 'What is your experience with Node.js?';
        breethServiceModule.createBreethCommandAdapter = () => ({ saveSessionMemory: async () => { }, updateSessionMemory: async () => { }, getSessionMemory: async () => null });

        const app = loadApp();
        const { server, url } = startServer(app);
        try {
            const payload = { sessionId: 'test-interview-001', candidate: { member: { id: 'c-1', name: 'Test' }, missions: [], signals: {} } };
            const { status, json } = await postJson(url, '/api/interview', payload);

            assert.strictEqual(status, 200);
            assert.strictEqual(typeof json.reply, 'string');
            assert.strictEqual(json.done, false);
            const session = sessionManager.getSession('test-interview-001');
            assert.ok(session);
            assert.strictEqual(session.status, 'ACTIVE');
            assert.strictEqual(session.conversationHistory.length, 1);
        } finally {
            llmService.generateInterviewResponse = originalGen;
            breethServiceModule.createBreethCommandAdapter = originalCreateAdapter;
            await closeServer(server);
        }
    });

    it('CONTINUE -> records answer and returns assistant reply', async () => {
        const originalGen = llmService.generateInterviewResponse;
        const originalCreateAdapter = breethServiceModule.createBreethCommandAdapter;

        // First call returns a question, second returns next question, third is eval JSON
        let calls = 0;
        llmService.generateInterviewResponse = async () => {
            calls += 1;
            if (calls === 1) return 'Initial question?';
            if (calls === 2) return 'Next question?';
            return '{"summary":"ok","strengths":[],"gaps":[],"next":[]}';
        };

        // stub breeth to no-op
        breethServiceModule.createBreethCommandAdapter = () => ({ saveSessionMemory: async () => { }, updateSessionMemory: async () => { }, getSessionMemory: async () => null });

        const app = loadApp();
        const { server, url } = startServer(app);
        try {
            // start
            const startPayload = { sessionId: 'test-interview-002', candidate: { member: { id: 'c-2', name: 'Test2' }, missions: [], signals: {} } };
            const s1 = await postJson(url, '/api/interview', startPayload);
            assert.strictEqual(s1.status, 200);

            // continue
            const cont = await postJson(url, '/api/interview', { sessionId: 'test-interview-002', message: 'I have used Node.' });
            assert.strictEqual(cont.status, 200);
            assert.strictEqual(typeof cont.json.reply, 'string');
            assert.strictEqual(cont.json.done, false);

            const session = sessionManager.getSession('test-interview-002');
            assert.ok(session.answers.length >= 1);
            assert.ok(session.askedQuestions.length >= 1);
            assert.strictEqual(session.progress.answeredQuestions, 1);
        } finally {
            llmService.generateInterviewResponse = originalGen;
            breethServiceModule.createBreethCommandAdapter = originalCreateAdapter;
            await closeServer(server);
        }
    });

    it('COMPLETION -> drives interview to completion and records feedback', async () => {
        const originalGen = llmService.generateInterviewResponse;
        const originalCreateAdapter = breethServiceModule.createBreethCommandAdapter;

        let calls = 0;
        llmService.generateInterviewResponse = async () => {
            calls += 1;
            if (calls === 1) return 'Q1?';
            if (calls === 2) return 'Q2?';
            if (calls === 3) return 'Q3?';
            // final evaluation reply (JSON)
            return JSON.stringify({ summary: 'Test interview completed.', strengths: ['Strong communication'], gaps: ['Needs more system design depth'], next: ['Practice system design interviews'] });
        };

        breethServiceModule.createBreethCommandAdapter = () => ({ saveSessionMemory: async () => { }, updateSessionMemory: async () => { }, getSessionMemory: async () => null });

        const app = loadApp();
        const { server, url } = startServer(app);
        try {
            const sid = 'test-interview-complete-001';
            const startPayload = { sessionId: sid, candidate: { member: { id: 'c-3', name: 'Finish' }, missions: [], signals: {} } };
            const s1 = await postJson(url, '/api/interview', startPayload);
            assert.strictEqual(s1.status, 200);

            // first continue
            const c1 = await postJson(url, '/api/interview', { sessionId: sid, message: 'Answer 1' });
            assert.strictEqual(c1.status, 200);
            assert.strictEqual(c1.json.done, false);

            // second continue -> should complete
            const c2 = await postJson(url, '/api/interview', { sessionId: sid, message: 'Answer 2' });
            assert.strictEqual(c2.status, 200);
            assert.strictEqual(c2.json.done, true);
            assert.strictEqual(c2.json.reply, 'Interview completed.');
            assert.ok(c2.json.feedback);
            assert.strictEqual(typeof c2.json.feedback.summary, 'string');
            assert.ok(Array.isArray(c2.json.feedback.strengths));
            assert.ok(Array.isArray(c2.json.feedback.gaps));
            assert.ok(Array.isArray(c2.json.feedback.next));

            const session = sessionManager.getSession(sid);
            assert.strictEqual(session.status, 'COMPLETED');
            assert.ok(session.feedback);
        } finally {
            llmService.generateInterviewResponse = originalGen;
            breethServiceModule.createBreethCommandAdapter = originalCreateAdapter;
            await closeServer(server);
        }
    });

    it('COMPLETED SESSION -> 400 on further messages', async () => {
        const originalGen = llmService.generateInterviewResponse;
        const originalCreateAdapter = breethServiceModule.createBreethCommandAdapter;

        llmService.generateInterviewResponse = async () => 'Q?';
        breethServiceModule.createBreethCommandAdapter = () => ({ saveSessionMemory: async () => { }, updateSessionMemory: async () => { }, getSessionMemory: async () => null });

        const app = loadApp();
        const { server, url } = startServer(app);
        try {
            const sid = 'test-completed-session-001';
            await postJson(url, '/api/interview', { sessionId: sid, candidate: { member: { id: 'c-x', name: 'X' }, missions: [], signals: {} } });

            // simulate completion by marking directly
            sessionManager.markCompleted(sid);

            const res = await postJson(url, '/api/interview', { sessionId: sid, message: 'Can I continue?' });
            assert.strictEqual(res.status, 400);
        } finally {
            llmService.generateInterviewResponse = originalGen;
            breethServiceModule.createBreethCommandAdapter = originalCreateAdapter;
            await closeServer(server);
        }
    });

    it('INVALID REQUESTS -> return 400 where appropriate', async () => {
        const originalGen = llmService.generateInterviewResponse;
        const originalCreateAdapter = breethServiceModule.createBreethCommandAdapter;
        llmService.generateInterviewResponse = async () => 'Q?';
        breethServiceModule.createBreethCommandAdapter = () => ({ saveSessionMemory: async () => { }, updateSessionMemory: async () => { }, getSessionMemory: async () => null });

        const app = loadApp();
        const { server, url } = startServer(app);
        try {
            // A. empty body
            const a = await fetch(url + '/api/interview', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
            assert.strictEqual(a.status, 400);

            // B. missing sessionId
            const b = await postJson(url, '/api/interview', { message: 'hello' });
            assert.strictEqual(b.status, 400);

            // C. empty sessionId
            const c = await postJson(url, '/api/interview', { sessionId: '' });
            assert.strictEqual(c.status, 400);

            // D. empty message when continuing
            const sid = 'test-invalid-msg-001';
            await postJson(url, '/api/interview', { sessionId: sid, candidate: { member: { id: 'c-i', name: 'I' }, missions: [], signals: {} } });
            const d = await postJson(url, '/api/interview', { sessionId: sid, message: '' });
            assert.strictEqual(d.status, 400);
        } finally {
            llmService.generateInterviewResponse = originalGen;
            breethServiceModule.createBreethCommandAdapter = originalCreateAdapter;
            await closeServer(server);
        }
    });

    it('UNKNOWN SESSION -> 404', async () => {
        const app = loadApp();
        const { server, url } = startServer(app);
        try {
            const res = await postJson(url, '/api/interview', { sessionId: 'does-not-exist', message: 'hello' });
            assert.strictEqual(res.status, 404);
        } finally {
            await closeServer(server);
        }
    });
});
