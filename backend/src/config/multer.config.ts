import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

const uploadPath = './uploads';

// create uploads folder if not exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

export const multerConfig = {
  storage: diskStorage({
    destination: uploadPath,
    filename: (req, file, cb) => {

      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);

      cb(null, `${unique}${ext}`);
    },
  }),

  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },

  fileFilter: (req, file, cb) => {

    const allowedTypes = [
      '.pdf',
      '.docx',
      '.xlsx',
      '.pptx'
    ];

    const ext = extname(file.originalname).toLowerCase();

    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
};