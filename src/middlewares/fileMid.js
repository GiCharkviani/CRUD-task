const multer = require('multer');

const memoryStorage = multer.memoryStorage();

module.exports = multer({ storage: memoryStorage }).single('avatar');
