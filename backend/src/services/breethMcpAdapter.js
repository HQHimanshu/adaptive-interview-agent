const { Client, StreamableHTTPClientTransport } = require('@modelcontextprotocol/client');

const DEFAULT_BREETH_SERVER = 'https://mcp.thebreeth.com/mcp';

function assertString(value, name) {
    if (!value || typeof value !== 'string') {
        throw new Error(`${name} must be a non-empty string.`);
    }
}

function getBreethApiKey(apiKey) {
    const resolvedKey = apiKey || process.env.BREETH_API_KEY;

    if (!resolvedKey || typeof resolvedKey !== 'string') {
        throw new Error('Breeth configuration error: missing BREETH_API_KEY.');
    }

    return resolvedKey;
}

function getBreethServer(serverUrl) {
    const resolvedServer = serverUrl || process.env.BREETH_SERVER || DEFAULT_BREETH_SERVER;

    if (!resolvedServer || typeof resolvedServer !== 'string') {
        throw new Error('Breeth configuration error: missing BREETH_SERVER.');
    }

    return resolvedServer;
}

function buildEpisodeContent(memory) {
    assertString(memory.sessionId, 'memory.sessionId');
    assertString(memory.candidateId, 'memory.candidateId');

    const profile = memory.candidateProfile || {};
    const history = Array.isArray(memory.conversationHistory) ? memory.conversationHistory : [];
    const questions = Array.isArray(memory.askedQuestions) ? memory.askedQuestions : [];
    const answers = Array.isArray(memory.answers) ? memory.answers : [];
    const progress = memory.progress || {};

    const lines = [
        `Interview session ${memory.sessionId} for candidate ${memory.candidateId}.`,
        '',
        'Candidate profile:',
        `Name: ${profile.name ?? 'unknown'}`,
        `Job role: ${profile.jobRole ?? profile.role ?? 'unknown'}`,
        `Years experience: ${profile.yearsExperience ?? 'unknown'}`,
        `Education: ${profile.education ?? 'unknown'}`,
        `Status: ${profile.status ?? 'unknown'}`,
        '',
        'Interview progress:',
        `Stage: ${progress.stage ?? 'unknown'}`,
        `Answered questions: ${progress.answeredQuestions ?? 0} of ${progress.totalQuestions ?? 0}`,
        `Current question: ${progress.currentQuestion ?? 'N/A'}`,
        '',
        'Questions asked:',
    ];

    if (questions.length === 0) {
        lines.push('- none');
    } else {
        questions.forEach((question) => lines.push(`- ${question}`));
    }

    lines.push('', 'Candidate answers:');

    if (answers.length === 0) {
        lines.push('- none');
    } else {
        answers.forEach((answer) => lines.push(`- ${answer}`));
    }

    lines.push('', 'Conversation history:');

    if (history.length === 0) {
        lines.push('- none');
    } else {
        history.forEach((turn) => {
            const role = turn.role || turn.speaker || 'unknown';
            const message = turn.message || turn.text || '';
            lines.push(`- ${role}: ${message}`);
        });
    }

    return lines.join('\n');
}

function parseSection(lines, header) {
    const startIndex = lines.findIndex((line) => line === header);
    if (startIndex === -1) {
        return [];
    }

    const output = [];
    for (let i = startIndex + 1; i < lines.length; i += 1) {
        const line = lines[i];
        if (!line) break;
        output.push(line);
    }

    return output;
}

function parseList(lines) {
    return lines
        .filter((line) => line.startsWith('- '))
        .map((line) => line.slice(2).trim())
        .filter(Boolean);
}

function parseKeyValue(lines) {
    const result = {};
    lines.forEach((line) => {
        const [key, ...rest] = line.split(':');
        if (!key || rest.length === 0) return;
        result[key.trim().toLowerCase()] = rest.join(':').trim();
    });
    return result;
}

function parseConversation(lines) {
    return lines
        .filter((line) => line.startsWith('- '))
        .map((line) => {
            const body = line.slice(2).trim();
            const splitIndex = body.indexOf(':');
            if (splitIndex === -1) {
                return { role: 'unknown', message: body };
            }
            return {
                role: body.slice(0, splitIndex).trim(),
                message: body.slice(splitIndex + 1).trim(),
            };
        });
}

function parseEpisodeContent(content) {
    if (!content || typeof content !== 'string') {
        return null;
    }

    const lines = content.split(/\r?\n/).map((line) => line.trim());
    const firstLine = lines[0] || '';
    // Accept slight variations like "Interview session X conducted for candidate Y"
    const sessionMatch = firstLine.match(/^Interview session (?<sessionId>[^ ]+).*candidate (?<candidateId>[^.]+)\.?$/i);
    const sessionId = sessionMatch?.groups?.sessionId ?? null;
    const candidateId = sessionMatch?.groups?.candidateId ?? null;

    const candidateProfile = parseKeyValue(parseSection(lines, 'Candidate profile:'));
    const progress = parseKeyValue(parseSection(lines, 'Interview progress:'));
    const questions = parseList(parseSection(lines, 'Questions asked:'));
    const answers = parseList(parseSection(lines, 'Candidate answers:'));
    const conversationHistory = parseConversation(parseSection(lines, 'Conversation history:'));

    const normalizedProgress = {
        stage: progress.stage ?? undefined,
        answeredQuestions: progress['answered questions'] ? Number(progress['answered questions'].split(' of ')[0]) : undefined,
        totalQuestions: progress['answered questions'] ? Number(progress['answered questions'].split(' of ')[1]) : undefined,
        currentQuestion: progress['current question'] ?? undefined,
    };

    return {
        sessionId,
        candidateId,
        candidateProfile,
        progress: normalizedProgress,
        askedQuestions: questions,
        answers,
        conversationHistory,
        rawContent: content,
    };
}

function buildSearchQuery(sessionId) {
    return `Interview session ${sessionId} candidate interview history questions answers progress`;
}

function extractToolResultContent(result) {
    if (result.structuredContent !== undefined) {
        return result.structuredContent;
    }

    if (result.content !== undefined) {
        return result.content;
    }

    return null;
}

function extractTextFromStructuredGraph(obj) {
    if (!obj || typeof obj !== 'object') return null;

    // Helper to recursively search for strings containing the episode marker
    function search(value) {
        if (!value) return null;
        if (typeof value === 'string') {
            if (value.includes('Interview session')) return value;
            return null;
        }
        if (Array.isArray(value)) {
            for (const item of value) {
                const found = search(item);
                if (found) return found;
            }
            return null;
        }
        if (typeof value === 'object') {
            // Common graph shapes: nodes, items, edges, content
            const keys = Object.keys(value);
            for (const k of keys) {
                const v = value[k];
                // Skip large uuid-like ids
                if (k === 'edge_uuid' || k === 'node_uuid' || k === 'source_node' || k === 'target_node') continue;
                const found = search(v);
                if (found) return found;
            }
        }
        return null;
    }

    return search(obj);
}

function selectSearchTool(toolNames) {
    if (toolNames.includes('search')) {
        return 'search';
    }

    if (toolNames.includes('search_graph')) {
        return 'search_graph';
    }

    return null;
}

async function verifyRequiredTools(client) {
    const { tools } = await client.listTools();
    const toolNames = Array.isArray(tools) ? tools.map((tool) => tool.name) : [];
    const missingTools = ['add_episode'].filter((required) => !toolNames.includes(required));
    const searchTool = selectSearchTool(toolNames);

    if (!searchTool) {
        missingTools.push('search or search_graph');
    }

    if (missingTools.length > 0) {
        throw new Error(`Breeth MCP integration error: missing required tool(s): ${missingTools.join(', ')}.`);
    }

    return { toolNames, searchTool };
}

async function callAddEpisode(client, memory) {
    const content = buildEpisodeContent(memory);
    const groupId = `interview:${memory.sessionId}`;

    const result = await client.callTool({
        name: 'add_episode',
        arguments: {
            content,
            group_id: groupId,
            extract_intent: false,
        },
    });

    if (result.isError) {
        const message = typeof result.content === 'string' ? result.content : JSON.stringify(result.structuredContent ?? result.content ?? {});
        throw new Error(`Breeth add_episode tool error: ${message}`);
    }

    return {
        sessionId: memory.sessionId,
        candidateId: memory.candidateId,
        rawContent: content,
    };
}

async function callSearch(client, sessionId, searchTool) {
    const query = buildSearchQuery(sessionId);
    const groupId = `interview:${sessionId}`;
    const result = await client.callTool({
        name: searchTool,
        arguments: {
            query,
            group_id: groupId,
            limit: 1,
        },
    });

    if (result.isError) {
        const message = typeof result.content === 'string' ? result.content : JSON.stringify(result.structuredContent ?? result.content ?? {});
        throw new Error(`Breeth ${searchTool} tool error: ${message}`);
    }

    const output = extractToolResultContent(result);
    if (output === null || output === undefined) {
        return null;
    }

    if (typeof output === 'string') {
        const trimmed = output.trim();
        let parsedJson = null;
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
                parsedJson = JSON.parse(output);
            } catch (e) {
                parsedJson = null;
            }
        }

        if (parsedJson) {
            const extracted = extractTextFromStructuredGraph(parsedJson);
            if (extracted) {
                const parsedEpisode = parseEpisodeContent(extracted);
                if (parsedEpisode && parsedEpisode.sessionId) {
                    if (!parsedEpisode.candidateId) {
                        const candMatch = extracted.match(/candidate\s+([^\.\s]+)/i);
                        if (candMatch) parsedEpisode.candidateId = candMatch[1];
                    }
                    return parsedEpisode;
                }
            }

            // Try to infer candidateId from any fact text in the parsed JSON
            let inferredCandidate = null;
            try {
                const anyText = extractTextFromStructuredGraph(parsedJson);
                // DEBUG
                console.log('DEBUG anyTextFromGraph:', anyText);
                if (anyText) {
                    const candMatch = anyText.match(/candidate\s+([^\.\s]+)/i);
                    console.log('DEBUG candMatch:', candMatch);
                    if (candMatch) inferredCandidate = candMatch[1];
                }
            } catch (e) {
                inferredCandidate = null;
            }

            return { sessionId, candidateId: inferredCandidate, rawContent: output, structuredContent: parsedJson };
        }

        const parsedEpisode = parseEpisodeContent(output);
        if (parsedEpisode && parsedEpisode.sessionId) return parsedEpisode;
        return { sessionId, rawContent: output };
    }

    if (Array.isArray(output) && output.length > 0) {
        const first = output[0];
        if (typeof first === 'string') {
            const parsed = parseEpisodeContent(first);
            return (parsed && parsed.sessionId) ? parsed : { sessionId, rawContent: first };
        }
        return { sessionId, rawContent: JSON.stringify(first), structuredContent: first };
    }

    if (typeof output === 'object' && output !== null) {
        const candidate = output.result ?? output.items ?? output.hit ?? output;
        if (typeof candidate === 'string') {
            const parsed = parseEpisodeContent(candidate);
            return (parsed && parsed.sessionId) ? parsed : { sessionId, rawContent: candidate };
        }

        // Attempt to extract a textual episode from structured graph-like output
        const extracted = extractTextFromStructuredGraph(candidate) || extractTextFromStructuredGraph(output);
        if (extracted) {
            return parseEpisodeContent(extracted) || { sessionId, rawContent: extracted, structuredContent: output };
        }

        return { sessionId, rawContent: JSON.stringify(output), structuredContent: output };
    }

    return null;
}

async function createDefaultClient({ serverUrl, apiKey }) {
    const resolvedServer = getBreethServer(serverUrl);
    const resolvedApiKey = getBreethApiKey(apiKey);
    const client = new Client({ name: 'adaptive-interview-agent-breeth', version: '1.0.0' });
    const transport = new StreamableHTTPClientTransport(resolvedServer, {
        requestInit: {
            headers: {
                Authorization: `Bearer ${resolvedApiKey}`,
            },
        },
    });

    await client.connect(transport);
    return client;
}

function createBreethMcpAdapter({ serverUrl, apiKey, clientFactory = createDefaultClient } = {}) {
    if (typeof clientFactory !== 'function') {
        throw new Error('Breeth adapter configuration error: clientFactory must be a function.');
    }

    return {
        async saveSessionMemory(memory) {
            if (!memory || typeof memory !== 'object') {
                throw new Error('Breeth memory save error: memory must be an object.');
            }

            const client = await clientFactory({ serverUrl, apiKey });
            await verifyRequiredTools(client);
            return callAddEpisode(client, memory);
        },

        async getSessionMemory(sessionId) {
            assertString(sessionId, 'sessionId');

            const client = await clientFactory({ serverUrl, apiKey });
            const { searchTool } = await verifyRequiredTools(client);
            return callSearch(client, sessionId, searchTool);
        },

        async updateSessionMemory(sessionId, memory) {
            assertString(sessionId, 'sessionId');
            if (!memory || typeof memory !== 'object') {
                throw new Error('Breeth memory update error: memory must be an object.');
            }
            if (memory.sessionId && memory.sessionId !== sessionId) {
                throw new Error('Breeth memory update error: memory.sessionId must match sessionId.');
            }

            const updatedMemory = { ...memory, sessionId };
            const client = await clientFactory({ serverUrl, apiKey });
            await verifyRequiredTools(client);
            return callAddEpisode(client, updatedMemory);
        },
    };
}

module.exports = {
    createBreethMcpAdapter,
    DEFAULT_BREETH_SERVER,
    getBreethApiKey,
    getBreethServer,
    buildEpisodeContent,
    parseEpisodeContent,
};
