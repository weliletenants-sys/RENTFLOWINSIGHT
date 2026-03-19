import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const baseUrl = 'http://localhost:3000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

async function request(path: string, options: any = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

async function run() {
  try {
    const role = await prisma.userRoles.findFirst({ where: { role: 'FUNDER' } });
    if (!role || !role.user_id) return console.log('No funders found!');
    
    const profile = await prisma.profiles.findUnique({ where: { id: role.user_id } });
    if (!profile || !profile.email) return console.log('No profile found!');

    const token = jwt.sign({ email: profile.email, sub: profile.id, role: 'FUNDER' }, JWT_SECRET);
    const headers = { Authorization: `Bearer ${token}` };

    // Test 1: Get my roles
    console.log('1. Fetching my roles...');
    const myRoles = await request('/roles/my-roles', { headers });
    console.log('Active role:', myRoles.activeRole);
    console.log('Roles:', myRoles.roles.map((r: any) => `${r.role}: ${r.status}`).join(', '));

    // Test 2: Request a new role (TENANT)
    console.log('\n2. Requesting TENANT role...');
    try {
      const reqRes = await request('/roles/request', {
        method: 'POST',
        headers,
        body: JSON.stringify({ role: 'TENANT' })
      });
      console.log('Result:', reqRes.message);
    } catch (err: any) {
      console.log('Request result:', err.message);
    }

    // Test 3: Fetch roles again to see PENDING
    console.log('\n3. Fetching roles after request...');
    const updatedRoles = await request('/roles/my-roles', { headers });
    console.log('Roles:', updatedRoles.roles.map((r: any) => `${r.role}: ${r.status}`).join(', '));

    // Test 4: Try switching to FUNDER (should work - already active)
    console.log('\n4. Switching to FUNDER role...');
    const switchRes = await request('/roles/switch', {
      method: 'POST',
      headers,
      body: JSON.stringify({ role: 'FUNDER' })
    });
    console.log('New token received:', switchRes.access_token ? 'YES' : 'NO');
    console.log('User role:', switchRes.user.role);

    console.log('\n✅ All Role Management endpoints tested successfully!');
  } catch (error: any) {
    console.error('Test failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}
run();
