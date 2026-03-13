import request from 'supertest';
import app from '../src/app';
import prisma from '../src/prisma/prisma.client';
import bcrypt from 'bcrypt';

jest.setTimeout(30000);

const testUser = {
  email: 'test@example.com',
  password: 'Password123!',
  firstName: 'Test',
  lastName: 'User',
  role: 'TENANT'
};

beforeAll(async () => {
  const profile = await prisma.profiles.findFirst({ where: { email: testUser.email } });
  if (profile) {
    await prisma.wallets.deleteMany({ where: { user_id: profile.id } }).catch(() => {});
    await prisma.userRoles.deleteMany({ where: { user_id: profile.id } }).catch(() => {});
    await prisma.profiles.deleteMany({ where: { email: testUser.email } }).catch(() => {});
  }
});

afterAll(async () => {
  const profile = await prisma.profiles.findFirst({ where: { email: testUser.email } });
  if (profile) {
    await prisma.wallets.deleteMany({ where: { user_id: profile.id } }).catch(() => {});
    await prisma.userRoles.deleteMany({ where: { user_id: profile.id } }).catch(() => {});
    await prisma.profiles.deleteMany({ where: { email: testUser.email } }).catch(() => {});
  }
  await prisma.$disconnect();
});

describe('Auth API', () => {
  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body.user).toHaveProperty('email', testUser.email);
  });

  it('should fail to register with an existing email', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send(testUser);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message', 'Email already exists');
  });

  it('should login a user successfully', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('access_token');
    expect(response.body.user).toHaveProperty('email', testUser.email);
  });

  it('should format credentials properly (mock password bypassed)', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });
});
