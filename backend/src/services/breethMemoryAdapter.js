const path = require('path');
const fs = require('fs');

const DEFAULT_STORAGE_FILE = path.join(__dirname, '../../data/breethMemory.json');

function ensureStorageDirectory(storageFilePath) {
    const dir = path.dirname(storageFilePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function createBreethMemoryAdapter({ storageFilePath = DEFAULT_STORAGE_FILE } = {}) {
    ensureStorageDirectory(storageFilePath);

    function readMemoryStorage() {
        if (!fs.existsSync(storageFilePath)) {
            return {};
        }

        const raw = fs.readFileSync(storageFilePath, 'utf8');
        return raw ? JSON.parse(raw) : {};
    }

    function writeMemoryStorage(store) {
        fs.writeFileSync(storageFilePath, JSON.stringify(store, null, 2), 'utf8');
    }

    return {
        async saveSessionMemory(memory) {
            const store = readMemoryStorage();
            store[memory.sessionId] = memory;
            writeMemoryStorage(store);
            return store[memory.sessionId];
        },

        async getSessionMemory(sessionId) {
            const store = readMemoryStorage();
            return store[sessionId] || null;
        },

        async updateSessionMemory(sessionId, memory) {
            const store = readMemoryStorage();
            store[sessionId] = { ...store[sessionId], ...memory, sessionId };
            writeMemoryStorage(store);
            return store[sessionId];
        },
    };
}

module.exports = {
    createBreethMemoryAdapter,
    DEFAULT_STORAGE_FILE,
};
