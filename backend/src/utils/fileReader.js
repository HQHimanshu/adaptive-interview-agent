const fs = require('fs/promises');

async function readJsonFile(filePath) {
    if (!filePath) {
        throw new Error('A file path is required.');
    }

    try {
        await fs.access(filePath);
    } catch {
        throw new Error(`File not found: ${filePath}`);
    }

    try {
        const rawContent = await fs.readFile(filePath, 'utf8');
        return JSON.parse(rawContent);
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in ${filePath}: ${error.message}`);
        }

        throw error;
    }
}

module.exports = {
    readJsonFile
};
