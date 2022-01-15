const crypto = require('crypto');

const create_unique_image = (mimetype = 'jpg', cb) => {
  crypto.randomBytes(8, (_, buffer) => {
    const token = buffer.toString('hex');
    const file_name = token.concat('.').concat(mimetype);
    cb(file_name);
  });
};

module.exports = (req, res, next) => {
  const { file, body, protocol } = req;

  if (file) {
    const mymetype = file.mimetype.split('/')[1];
    create_unique_image(mymetype, (fileName) => {
      body.fileBuff = file.buffer;
      body.fileName = fileName;
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
        create_unique_image(mymetype, (fileName) => {
          const takenBuf = body.avatar.split('base64,')[1];
          body.fileBuff = takenBuf;
          body.fileName = fileName;
          body.filePath = protocol.concat('://').concat(req.get('host')).concat('/').concat(fileName);
          next();
        });
      } catch (err) {
        next(err);
      }
    } else {
      create_unique_image(undefined, (fileName) => {
        body.fileBuff = body.avatar;
        body.fileName = fileName;
        body.filePath = protocol.concat('://').concat(req.get('host')).concat('/').concat(fileName);
        next();
      });
    }
  } else {
    body.filePath = '';
    body.fileBuff = '';
    next();
  }
};
