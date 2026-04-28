import request from 'supertest';
import app from '../../src/app';
import prisma from '../../src/prisma/prisma.client';

describe('Auth Native Endpoints', () => {
  const testPhone = '0770000000';

  // Cleanup before tests run
  beforeAll(async () => {
    await prisma.profiles.deleteMany({
      where: { phone: testPhone }
    });
  });

  // Cleanup after tests are done
  afterAll(async () => {
    await prisma.profiles.deleteMany({
      where: { phone: testPhone }
    });
    await prisma.$disconnect();
  });

  describe('POST /api/v2/auth/register', () => {
    it('should successfully register a new user natively and provision their wallet', async () => {
      const res = await request(app)
        .post('/api/v2/auth/register')
        .send({
          phone: testPhone,
          fullName: 'Test User',
          password: 'Password123!',
          role: 'TENANT',
          nationalId: 'ID1234567890'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
      expect(res.body.data.id).toBeDefined(); // register returns id and token, not the full user
      expect(res.body.data.token).toBeDefined();

      // Verify DB artifacts explicitly
      const user = await prisma.profiles.findUnique({
        where: { id: res.body.data.id }
      });
      
      const wallet = await prisma.wallets.findFirst({
        where: { account_id: res.body.data.id }
      });
      
      const role = await prisma.userRoles.findFirst({
        where: { user_id: res.body.data.id }
      });

      expect(user).toBeDefined();
      expect(wallet).toBeDefined(); // Wallet provisioned!
      expect(wallet?.balance).toBe(0);
      expect(role?.role).toBe('tenant'); // Role assigned!
    });

    it('should fail if attempting to register the same phone number twice', async () => {
      const res = await request(app)
        .post('/api/v2/auth/register')
        .send({
          phone: testPhone,
          fullName: 'Test User 2',
          password: 'Password123!',
          role: 'TENANT'
        });
      
      expect(res.status).toBe(409); // Controller sends 409 Conflict
      expect(res.body.status).toBe('error');
      expect(res.body.error).toContain('exists');
    });
  });

  describe('POST /api/v2/auth/login', () => {
    it('should successfully authenticate the natively registered user', async () => {
      const res = await request(app)
        .post('/api/v2/auth/login')
        .send({
          phone: testPhone,
          password: 'Password123!'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.user.phone).toBe(testPhone); // login returns user object
      expect(res.body.data.access_token).toBeDefined(); // login returns access_token
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v2/auth/login')
        .send({
          phone: testPhone,
          password: 'WrongPassword!'
        });
      
      expect(res.status).toBe(401);
      expect(res.body.status).toBe('error');
      expect(res.body.error).toContain('credentials');
    });
  });
});
