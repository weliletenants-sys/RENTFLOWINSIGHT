import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const baseUrl = 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

async function request(path: string, options: any = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data;
}

async function run() {
  try {
    const role = await prisma.userRoles.findFirst({ where: { role: 'FUNDER' } });
    if (!role || !role.user_id) return console.log('No funders found!');
    
    const profile = await prisma.profiles.findUnique({ where: { id: role.user_id } });
    if (!profile || !profile.email) return console.log('No profile found!');

    console.log(`Generating JWT token for ${profile.email}...`);
    const token = jwt.sign({ email: profile.email, sub: profile.id, role: 'FUNDER' }, JWT_SECRET);
    console.log('Token created successfully!');

    console.log('Fetching Dashboard Stats...');
    const dash = await request('/funder/dashboard', { headers: { Authorization: `Bearer ${token}` } });
    console.log('Dashboard Stats:', dash);

    console.log('Fetching Portfolios...');
    const ports = await request('/funder/portfolios', { headers: { Authorization: `Bearer ${token}` } });
    console.log(`Portfolios count: ${ports.length}`);

    console.log('Fetching Activities...');
    const activities = await request('/funder/activities', { headers: { Authorization: `Bearer ${token}` } });
    console.log(`Activities count: ${activities.length}`);

    console.log('✅ All Funder endpoints tested successfully!');
  } catch (error: any) {
    console.error('Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
run();
