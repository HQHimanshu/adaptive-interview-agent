const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

const DEFAULT_BREETH_SERVER = 'https://mcp.thebreeth.com/mcp';

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
 * @param {string} apiKey
 * @returns {string}
 */
function getBreethApiKey(apiKey) {
    const resolvedKey = apiKey || process.env.BREETH_API_KEY;

    if (!resolvedKey || typeof resolvedKey !== 'string') {
        throw new Error('Breeth configuration error: missing BREETH_API_KEY.');
    }

    return resolvedKey;
}

/**
 * @param {string} serverUrl
 * @returns {string}
 */
function getBreethServer(serverUrl) {
    const resolvedServer = serverUrl || process.env.BREETH_SERVER || DEFAULT_BREETH_SERVER;

    if (!resolvedServer || typeof resolvedServer !== 'string') {
        throw new Error('Breeth configuration error: missing BREETH_SERVER.');
    }

    return resolvedServer;
}

/**
 * @param {string} sessionId
 * @returns {string}
 */
function validateSessionId(sessionId) {
    assertString(sessionId, 'sessionId');
    return sessionId;
}

/**
 * @param {Object} memory
 */
function validateSessionMemory(memory) {
    assertObject(memory, 'memory');
    validateSessionId(memory.sessionId);

    if (!memory.candidateId || typeof memory.candidateId !== 'string') {
        throw new Error('Memory validation error: candidateId is required and must be a string.');
    }

    if (!memory.candidateProfile || typeof memory.candidateProfile !== 'object') {
        throw new Error('Memory validation error: candidateProfile is required and must be an object.');
    }

    if (!Array.isArray(memory.conversationHistory)) {
        throw new Error('Memory validation error: conversationHistory must be an array.');
    }

    if (!Array.isArray(memory.askedQuestions)) {
        throw new Error('Memory validation error: askedQuestions must be an array.');
    }

    if (!Array.isArray(memory.answers)) {
        throw new Error('Memory validation error: answers must be an array.');
    }

    if (!memory.progress || typeof memory.progress !== 'object') {
        throw new Error('Memory validation error: progress is required and must be an object.');
    }
}

/**
 * @param {Object} [options]
 * @param {string} [options.command]
 * @param {string[]} [options.args]
 * @param {Object} [options.env]
 * @param {Function} [options.execFile]
 * @returns {{ saveSessionMemory: Function, getSessionMemory: Function, updateSessionMemory: Function }}
 */
function createBreethCommandAdapter({ command = 'npx', args = [], env = process.env, execFile = execFileAsync } = {}) {
    if (!command || typeof command !== 'string') {
        throw new Error('Breeth adapter configuration error: command must be a non-empty string.');
    }

    if (!Array.isArray(args)) {
        throw new Error('Breeth adapter configuration error: args must be an array.');
    }

    async function executeMcpRemote(extraArgs) {
        const commandArgs = [...args, ...extraArgs];
        const result = await execFile(command, commandArgs, { env });
        return { stdout: result.stdout, stderr: result.stderr };
    }

    async function notImplemented(toolName) {
        throw new Error(
            `Breeth MCP tool integration is not implemented for '${toolName}'. ` +
            'A documented Breeth tool name and payload format are required to complete this adapter.'
        );
    }

    return {
        async saveSessionMemory(memory) {
            return notImplemented('saveSessionMemory');
        },
        async getSessionMemory(sessionId) {
            return notImplemented('getSessionMemory');
        },
        async updateSessionMemory(sessionId, memory) {
            return notImplemented('updateSessionMemory');
        },
        internal: {
            executeMcpRemote,
        },
    };
}

/**
 * @param {Object} adapter
 * @returns {Object}
 */
function createBreethService(adapter) {
    assertObject(adapter, 'adapter');

    const requiredMethods = ['saveSessionMemory', 'getSessionMemory', 'updateSessionMemory'];
    requiredMethods.forEach((method) => {
        if (typeof adapter[method] !== 'function') {
            throw new Error(`Breeth service adapter must implement ${method}().`);
        }
    });

    return {
        saveSessionMemory: async (memory) => {
            validateSessionMemory(memory);
            return adapter.saveSessionMemory(memory);
        },
        getSessionMemory: async (sessionId) => {
            validateSessionId(sessionId);
            return adapter.getSessionMemory(sessionId);
        },
        updateSessionMemory: async (sessionId, memory) => {
            validateSessionId(sessionId);
            validateSessionMemory({ ...memory, sessionId });
            return adapter.updateSessionMemory(sessionId, memory);
        },
    };
}

module.exports = {
    getBreethApiKey,
    getBreethServer,
    validateSessionId,
    validateSessionMemory,
    createBreethCommandAdapter,
    createBreethService,
    DEFAULT_BREETH_SERVER,
};
