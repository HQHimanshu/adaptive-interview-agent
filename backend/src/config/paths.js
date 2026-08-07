const path = require('path');

const backendDir = path.resolve(__dirname, '..', '..');
const projectRootDir = path.resolve(backendDir, '..');

module.exports = {
    backendDir,
    projectRootDir,
    candidateDataPath: path.join(projectRootDir, 'candidates.json'),
    curriculumDataPath: path.join(projectRootDir, 'curriculum.json')
};
