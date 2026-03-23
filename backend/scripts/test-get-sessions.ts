import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import axios from 'axios';

async function main() {
  const profile = await prisma.profiles.findFirst({
    where: { email: 'pexpert@gmail.com' }
  });

  const session = await prisma.sessions.findFirst({
    where: { user_id: profile!.id, is_revoked: false },
    orderBy: { created_at: 'desc' }
  });
  
  if (!session) {
    console.log('No active session found in DB for Pius Doe!');
    return;
  }
  
  console.log('Testing GET /api/auth/security/sessions with token...');
  try {
    const res = await axios.get('http://localhost:3000/api/auth/security/sessions', {
      headers: { Authorization: `Bearer ${session.token}` }
    });
    console.log('API Response:', JSON.stringify(res.data, null, 2));
  } catch (e: any) {
    console.log('API Error:', e.message, e.response?.data);
  }
}

main().finally(() => prisma.$disconnect());
