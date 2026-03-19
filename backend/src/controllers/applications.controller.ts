import { Request, Response } from 'express';
import prisma from '../prisma/prisma.client';
import { problemResponse } from '../utils/problem';

export const startApplication = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    // mock implementation based on the previous NestJS controller
    res.status(201).json({ message: 'Application started', data });
  } catch (error) {
    problemResponse(res, 500, 'Internal Server Error', `Internal server error`, 'internal-server-error');
  }
};

export const saveStep1 = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Step 1 saved', id: req.params.id, data: req.body });
};

export const saveStep2 = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Step 2 saved', id: req.params.id, data: req.body });
};

export const saveStep3 = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Step 3 saved', id: req.params.id, data: req.body });
};

export const saveStep4 = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Step 4 saved', id: req.params.id, data: req.body });
};

export const getApplication = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Application details', id: req.params.id });
};

export const startAgentKyc = async (req: Request, res: Response) => {
  res.status(201).json({ message: 'Agent KYC started', data: req.body });
};

export const saveAgentKycStep1 = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Agent KYC Step 1 saved', id: req.params.id, data: req.body });
};

export const saveAgentKycStep2 = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Agent KYC Step 2 saved', id: req.params.id, data: req.body });
};

export const saveAgentKycStep3 = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Agent KYC Step 3 saved', id: req.params.id, data: req.body });
};

export const getAgentApplication = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Agent Application details', id: req.params.id });
};
