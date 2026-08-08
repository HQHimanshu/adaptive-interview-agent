const assert = require('assert');
const { describe, it, beforeEach, afterEach } = require('node:test');
const { createBreethService } = require('./breethService');
const { createBreethMemoryAdapter } = require('./breethMemoryAdapter');

const storagePath = require('path').join(__dirname, '../../data/testBreethMemory.json');

let adapter;
let service;

beforeEach(() => {
    adapter = createBreethMemoryAdapter({ storageFilePath: storagePath });
    service = createBreethService(adapter);
});

afterEach(() => {
    const fs = require('fs');
    if (fs.existsSync(storagePath)) {
        fs.unlinkSync(storagePath);
    }
});

describe('Breeth service abstraction', () => {
    it('saves and retrieves session memory', async () => {
        const memory = {
            sessionId: 'test-session-1',
            candidateId: 'candidate-1',
            candidateProfile: { name: 'Test Candidate' },
            conversationHistory: [{ role: 'interviewer', text: 'Hello' }],
            askedQuestions: ['Tell me about yourself'],
            answers: ['I am a software engineer'],
            progress: { stage: 'initial', score: 0 },
        };

        const saved = await service.saveSessionMemory(memory);
        assert.deepStrictEqual(saved, memory);

        const loaded = await service.getSessionMemory('test-session-1');
        assert.deepStrictEqual(loaded, memory);
    });

    it('updates existing session memory', async () => {
        const memory = {
            sessionId: 'test-session-2',
            candidateId: 'candidate-2',
            candidateProfile: { name: 'Candidate 2' },
            conversationHistory: [],
            askedQuestions: [],
            answers: [],
            progress: { stage: 'initial', score: 0 },
        };

        await service.saveSessionMemory(memory);

        const updated = await service.updateSessionMemory('test-session-2', {
            candidateId: 'candidate-2',
            candidateProfile: { name: 'Candidate 2' },
            conversationHistory: [{ role: 'interviewer', text: 'Next question' }],
            askedQuestions: ['Next question'],
            answers: ['Next answer'],
            progress: { stage: 'follow-up', score: 1 },
        });

        assert.strictEqual(updated.conversationHistory.length, 1);
        assert.strictEqual(updated.progress.stage, 'follow-up');
    });
});
