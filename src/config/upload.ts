import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const tmpDir = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: tmpDir,
  storage: multer.diskStorage({
    destination: tmpDir,
    filename(req, file, callback) {
      const filehash = crypto.randomBytes(10).toString('HEX');
      const filename = `${file.originalname}-${filehash}`;
      return callback(null, filename);
    },
  }),
};
