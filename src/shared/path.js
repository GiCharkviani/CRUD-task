const path = require('path');
const genPath = (fileName) => path.join(__dirname, '..', 'public', 'avatars', fileName);

module.exports = genPath;
