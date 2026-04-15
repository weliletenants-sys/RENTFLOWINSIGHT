import { Request, Response } from 'express';
import { authenticate } from '../src/middlewares/auth.middleware';

async function testTokenIntegrity() {
  console.log('\n--- 5. Token Integrity Test (Middleware Gatekeeper) ---');
  
  const req = {
    headers: { authorization: 'Bearer WRONG_TOKEN' },
    cookies: {},
    path: '/api/me'
  } as unknown as Request;

  const res = {
    status: function (code: number) {
      if (code !== 401) throw new Error(`Expected 401, got ${code}`);
      return this;
    },
    json: function (data: any) {
      if (data.error !== 'Unauthorized: Invalid or expired identity token') {
         throw new Error(`Unexpected error message: ${data.error}`);
      }
      return this;
    }
  } as unknown as Response;

  const next = () => {
    throw new Error('next() should NOT be called for invalid token');
  };

  try {
    await authenticate(req, res, next);
    console.log('✅ Passed');
  } catch (e: any) {
    console.error('❌ Failed:', e.message);
    process.exit(1);
  }
}

testTokenIntegrity();
