const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'avatars');

const mime = {
  svg: 'image/svg',
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

const writeImage = (req, res, next) => {
  const file = path.join(dir, req.originalUrl.replace(/\/$/, ''));

  if (file.indexOf(dir + path.sep) !== 0) {
    return res.status(403).end('Forbidden');
  }
  if (!fs.existsSync(file)) {
    return res.sendStatus(404);
  }
  const type = mime[path.extname(file).slice(1)];
  const s = fs.createReadStream(file);
  s.on('open', () => {
    res.set('Content-Type', type);
    s.pipe(res);
  });
  s.on('error', (err) => {
    next(err);
  });

  return 0;
};

module.exports = writeImage;
