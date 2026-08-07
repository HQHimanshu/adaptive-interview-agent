const { candidateDataPath } = require('../config/paths');
const { readJsonFile } = require('../utils/fileReader');
const { getCachedData, clearCache } = require('./dataCache');

function validateCandidatePayload(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('Candidate data must be a JSON object.');
    }

    if (!Array.isArray(payload.candidates)) {
        throw new Error('Candidate data must include a candidates array.');
    }

    return payload;
}

async function loadCandidatesData() {
    return getCachedData('candidates', async () => {
        const payload = await readJsonFile(candidateDataPath);
        return validateCandidatePayload(payload);
    });
}

async function loadCandidateById(candidateId) {
    const data = await loadCandidatesData();
    const candidate = data.candidates.find((entry) => entry?.member?.id === candidateId);

    if (!candidate) {
        throw new Error(`Candidate with id ${candidateId} was not found.`);
    }

    return candidate;
}

function clearCandidateCache() {
    clearCache('candidates');
}

module.exports = {
    loadCandidatesData,
    loadCandidateById,
    clearCandidateCache
};
