const crypto = require('crypto');
const fs = require('fs');
const genPath = require('../shared/path');
const path = require('path');

const create_unique_image = (mimetype = 'jpg', fileBuffer, cb) => {
  crypto.randomBytes(8, (_, buffer) => {
    const token = buffer.toString('hex');
    const file_name = token.concat('.').concat(mimetype);
    const bufferFile = Buffer.from(fileBuffer, 'base64');
    // starter folder check
    if (!fs.existsSync(genPath(''))) {
      fs.mkdirSync(path.join(__dirname, '..', 'public'));
      fs.mkdirSync(path.join(__dirname, '..', 'public', 'avatars'));
    }
    fs.writeFileSync(genPath(file_name), bufferFile);
    cb(file_name);
  });
};

module.exports = (req, res, next) => {
  const { file, body, protocol } = req;

  if (file) {
    const mymetype = file.mimetype.split('/')[1];
    create_unique_image(mymetype, file.buffer, (fileName) => {
      body.filePath = protocol.concat('://').concat(req.get('host')).concat('/').concat(fileName);
      next();
    });
  } else if (body.avatar) {
    const base64Check = body.avatar.includes('base64');

    if (base64Check) {
      const mymetype = body.avatar.split('base64,')[0].split('/')[1].replace(';', '');
      const dataImage = body.avatar.split('base64,')[0].split('/')[0].split(':')[1];

      try {
        if (dataImage !== 'image') {
          const error = new Error('Wrong file format!');
          error.statusCode = 400;
          throw error;
        }
        create_unique_image(mymetype, body.avatar.split('base64,')[1], (fileName) => {
          body.filePath = protocol.concat('://').concat(req.get('host')).concat('/').concat(fileName);
          next();
        });
      } catch (err) {
        next(err);
      }
    } else {
      create_unique_image(undefined, body.avatar, (fileName) => {
        body.filePath = protocol.concat('://').concat(req.get('host')).concat('/').concat(fileName);
        next();
      });
    }
  } else {
    body.filePath = '';
    next();
  }
};
