import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadFile } from '../controllers/upload.controller';

const router = Router();

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
    cb(null, `${randomName}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.post('/', upload.single('file'), uploadFile);

export default router;
