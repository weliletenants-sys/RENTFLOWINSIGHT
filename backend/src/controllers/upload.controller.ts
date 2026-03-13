import { Request, Response } from 'express';

export const uploadFile = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
  
  return res.status(200).json({
    url: fileUrl,
    message: 'File uploaded securely'
  });
};
