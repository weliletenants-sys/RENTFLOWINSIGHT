import request from 'supertest';
import app from '../src/app';
import prisma from '../src/prisma/prisma.client';
import jwt from 'jsonwebtoken';

jest.setTimeout(30000);

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev';

describe('Supporter API', () => {
  let token: string;
  let testProfile: any;

  beforeAll(async () => {
    // Ensure cleanup first
    await prisma.wallets.deleteMany({ where: { user_id: 'test-supporter-id' } }).catch(() => {});
    await prisma.userRoles.deleteMany({ where: { user_id: 'test-supporter-id' } }).catch(() => {});
    await prisma.profiles.deleteMany({ where: { id: 'test-supporter-id' } }).catch(() => {});

    // Create a mock supporter profile
    const now = new Date().toISOString();
    testProfile = await prisma.profiles.create({
      data: {
        id: 'test-supporter-id',
        email: 'supporter_test@example.com',
        full_name: 'Test Supporter',
        phone: '0001234567',
        is_frozen: false,
        verified: false,
        rent_discount_active: false,
        created_at: now,
        updated_at: now,
      }
    });

    await prisma.userRoles.create({
      data: {
        user_id: testProfile.id,
        role: 'FUNDER',
        enabled: true,
        created_at: now
      }
    });

    await prisma.wallets.create({
      data: {
        user_id: testProfile.id,
        balance: 1000000, // Rich supporter
        created_at: now,
        updated_at: now
      }
    });

    // Sign token
    const payload = { email: testProfile.email, sub: testProfile.id, role: 'FUNDER' };
    token = jwt.sign(payload, JWT_SECRET);
  });

  afterAll(async () => {
    // Cleanup
    await prisma.wallets.deleteMany({ where: { user_id: testProfile.id } }).catch(() => {});
    await prisma.userRoles.deleteMany({ where: { user_id: testProfile.id } }).catch(() => {});
    await prisma.profiles.deleteMany({ where: { id: testProfile.id } }).catch(() => {});
    await prisma.$disconnect();
  });

  it('should get supporter dashboard stats successfully', async () => {
    const response = await request(app)
      .get('/supporter/dashboard')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('totalContribution');
    expect(response.body).toHaveProperty('returnPerMonth');
    expect(response.body).toHaveProperty('portfoliosCount');
  });

  it('should list virtual houses for the supporter', async () => {
    const response = await request(app)
      .get('/supporter/virtual-houses')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('should successfully fund the pool with minimum amount', async () => {
    const response = await request(app)
      .post('/supporter/fund-pool')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 50000 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Funded successfully');
    expect(response.body).toHaveProperty('portfolio');
  });

  it('should deny pool funding without sufficient balance or invalid amount', async () => {
    const response = await request(app)
      .post('/supporter/fund-pool')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100 }); // Below minimum

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
  });
});
