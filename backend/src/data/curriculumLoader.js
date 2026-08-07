const { curriculumDataPath } = require('../config/paths');
const { readJsonFile } = require('../utils/fileReader');
const { getCachedData, clearCache } = require('./dataCache');

function validateCurriculumPayload(payload) {
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
        throw new Error('Curriculum data must be a JSON object.');
    }

    if (!Array.isArray(payload.modules)) {
        throw new Error('Curriculum data must include a modules array.');
    }

    if (!Array.isArray(payload.days)) {
        throw new Error('Curriculum data must include a days array.');
    }

    return payload;
}

async function loadCurriculumData() {
    return getCachedData('curriculum', async () => {
        const payload = await readJsonFile(curriculumDataPath);
        return validateCurriculumPayload(payload);
    });
}

async function getCurriculumModule(moduleNumber) {
    const data = await loadCurriculumData();
    const module = data.modules.find((entry) => entry?.n === moduleNumber);

    if (!module) {
        throw new Error(`Curriculum module ${moduleNumber} was not found.`);
    }

    return module;
}

function clearCurriculumCache() {
    clearCache('curriculum');
}

module.exports = {
    loadCurriculumData,
    getCurriculumModule,
    clearCurriculumCache
};
