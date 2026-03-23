import { S3Client } from '@aws-sdk/client-s3';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { Request } from 'express';

// Initialize the S3 Client
// Ensure AWS_REGION, AWS_ACCESS_KEY_ID, and AWS_SECRET_ACCESS_KEY are in your .env
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'welile-production-storage-2026';

// Helper to filter allowed file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF are allowed.'));
  }
};

// Configured Multer-S3 storage engine
export const uploadS3 = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req: any, file: Express.Multer.File, cb: (error: any, key?: string) => void) {
      // We expect req.user to be populated by the authGuard middleware
      const userId = req.user?.sub || req.user?.id || 'unknown_user';
      const fileExt = path.extname(file.originalname);
      
      const folderPath = `funder/${userId}`;
      let fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;

      if (file.fieldname === 'avatar') {
        fileName = `profile_photo_${Date.now()}${fileExt}`;
      } else if (file.fieldname === 'front_id' || file.fieldname === 'back_id') {
        fileName = `${file.fieldname}_${Date.now()}${fileExt}`; // e.g. front_id_12345.jpg
      }

      cb(null, `${folderPath}/${fileName}`);
    }
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB limit
  }
});
