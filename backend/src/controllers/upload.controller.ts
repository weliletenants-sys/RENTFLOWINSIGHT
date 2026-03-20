import { Request, Response } from 'express';
import { problemResponse } from '../utils/problem';

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return problemResponse(res, 400, 'Validation Error', `No file uploaded`, 'validation-error');
  }

  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  
  return res.status(200).json({
    url: fileUrl,
    message: 'File uploaded securely'
  });
};
