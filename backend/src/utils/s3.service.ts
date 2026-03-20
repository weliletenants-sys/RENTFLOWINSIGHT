import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { randomUUID } from 'crypto';
import path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'welile-production-storage';

/**
 * Upload a raw buffer to S3 (useful for base64 conversions)
 */
export const uploadBufferToS3 = async (
  buffer: Buffer,
  folder: 'avatars' | 'kyc-documents' | 'receipts' | 'properties',
  mimetype: string,
  extension: string
): Promise<string> => {
  const fileName = `${folder}/${Date.now()}-${randomUUID()}${extension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: mimetype
  });

  await s3Client.send(command);

  // Return the public URL formatted for the bucket/region
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
};

/**
 * Delete a file from S3 by its URL
 */
export const deleteFromS3 = async (fileUrl: string): Promise<void> => {
  try {
    const urlParts = new URL(fileUrl);
    // Pathname starts with '/', so substring(1) removes it
    const key = urlParts.pathname.substring(1); 

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    });
    
    await s3Client.send(command);
  } catch (error) {
    console.error('Failed to delete S3 object', error);
  }
};

/**
 * Generate a signed URL for temporary access to a private bucket file
 */
export const getPresignedUrl = async (key: string, expiresIn = 3600): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });
  return await getSignedUrl(s3Client, command, { expiresIn });
};

/**
 * Multer middleware configured for S3 direct uploads
 * Usage: router.post('/upload', uploadS3('receipts').single('file'), ...)
 */
export const uploadS3 = (folder: 'avatars' | 'kyc-documents' | 'receipts' | 'properties') => {
  return multer({
    storage: multerS3({
      s3: s3Client,
      bucket: BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${folder}/${Date.now()}-${randomUUID()}${ext}`);
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB limit
    }
  });
};
