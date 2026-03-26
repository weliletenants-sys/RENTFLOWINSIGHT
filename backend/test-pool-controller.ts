import { getPoolBalance } from './src/controllers/manager.controller';
import { Request, Response } from 'express';

const res = {
  json: (data: any) => console.log('RESPONSE:', JSON.stringify(data, null, 2)),
  status: (code: number) => {
    console.log('HTTP STATUS:', code);
    return res;
  }
} as unknown as Response;

const req = {} as unknown as Request;

async function executeDiagnostics() {
  console.log('--- EXECUTING CONTROLLER NATIVELY ---');
  await getPoolBalance(req, res);
}

executeDiagnostics().catch(console.error);
