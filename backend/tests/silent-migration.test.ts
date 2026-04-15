import prisma from '../src/prisma/prisma.client';
import { UsersRepository } from '../src/modules/users/users.repository';
import { authenticate } from '../src/middlewares/auth.middleware';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

describe('Phase 1: Silent Migration Validation', () => {
  const repo = new UsersRepository();
  const testUserId = uuidv4();
  const testEmail = `test_${testUserId.substring(0, 8)}@example.com`;
  const jwtClaims = { email: testEmail, phone: '5551234567' };

  afterAll(async () => {
    // Cleanup generated data
    await prisma.auditLogs.deleteMany({ where: { user_id: testUserId } });
    await prisma.profiles.deleteMany({ where: { id: testUserId } });
    // Also cleanup concurrency test users
    await prisma.auditLogs.deleteMany({ where: { action_type: 'SILENT_MIGRATION' }, take: 100 });
  });

  it('1. First Login Test (Fresh User)', async () => {
    // PRE: User does NOT exist in DB
    const before = await prisma.profiles.findUnique({ where: { id: testUserId } });
    expect(before).toBeNull();

    // ACTION: Resolve or seed profile
    const { profile, migrated } = await repo.resolveOrSeedProfile(testUserId, jwtClaims);

    // EXPECT: User created, migrated flag is true
    expect(migrated).toBe(true);
    expect(profile.id).toBe(testUserId);
    expect(profile.email).toBe(testEmail);
    expect(profile.phone).toBe(jwtClaims.phone);

    // EXPECT: Audit log is written
    const auditRecord = await prisma.auditLogs.findFirst({
      where: { user_id: testUserId, action_type: 'SILENT_MIGRATION' }
    });
    expect(auditRecord).not.toBeNull();
  });

  it('2. Second Login Test (Existing User Idempotency)', async () => {
    // ACTION: Login again using same identity
    const { profile, migrated } = await repo.resolveOrSeedProfile(testUserId, jwtClaims);

    // EXPECT: Migrated is false (meaning fast path hit)
    expect(migrated).toBe(false);
    expect(profile.id).toBe(testUserId);

    // EXPECT: No duplicate audit logs
    const auditLogs = await prisma.auditLogs.findMany({
      where: { user_id: testUserId, action_type: 'SILENT_MIGRATION' }
    });
    expect(auditLogs.length).toBe(1); // Still just the 1 from the first test
  });

  it('3. Concurrency Test (Race conditions / duplicate insertion prevention)', async () => {
    const concurrentUserId = uuidv4();
    const concurrentEmail = `conc_${concurrentUserId.substring(0, 8)}@example.com`;
    const cClaims = { email: concurrentEmail, phone: '5559876543' };

    // ACTION: Simulate 5 concurrent requests hitting the seed function simultaneously
    const promises = Array.from({ length: 5 }).map(() =>
      repo.resolveOrSeedProfile(concurrentUserId, cClaims)
    );

    const results = await Promise.all(promises);

    // EXPECT: Database should only have 1 record for this user
    const usersInDb = await prisma.profiles.findMany({ where: { id: concurrentUserId } });
    expect(usersInDb.length).toBe(1);

    // EXPECT: Only ONE result array item should claim 'migrated: true', the rest 'migrated: false'
    // However, depending on network/ORM, one might win and others catch P2002 and return false.
    const migrations = results.filter(r => r.migrated === true);
    expect(migrations.length).toBe(1);

    // EXPECT: Ensure they all return a valid profile, no exceptions were thrown
    for (const res of results) {
      expect(res.profile.id).toBe(concurrentUserId);
    }

    // Cleanup
    await prisma.auditLogs.deleteMany({ where: { user_id: concurrentUserId } });
    await prisma.profiles.delete({ where: { id: concurrentUserId } });
  });

  it('4. Token Integrity Test (Middleware Gatekeeper)', async () => {
    // Simulate req/res
    const req = {
      headers: { authorization: 'Bearer WRONG_TOKEN' },
      cookies: {},
      path: '/api/me'
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const next = jest.fn();

    // ACTION: pass wrong token to authenticate middleware
    await authenticate(req, res, next);

    // EXPECT: Returns 401 Unauthorized, next() not called
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized: Invalid or expired identity token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('5. Partial Failure Simulation (Audit Log fails but Seed Succeeds)', async () => {
    const failUserId = uuidv4();
    const failClaims = { email: 'fail@example.com' };

    // Spy on prisma.auditLogs.create to forcefully throw an error
    const spy = jest.spyOn(prisma.auditLogs, 'create').mockRejectedValue(new Error('Simulated Audit Failure'));

    // ACTION
    const { profile, migrated } = await repo.resolveOrSeedProfile(failUserId, failClaims);

    // EXPECT: Execution did NOT halt
    expect(migrated).toBe(true);
    expect(profile.id).toBe(failUserId);

    // Verify spy was called
    expect(spy).toHaveBeenCalled();

    // Cleanup
    spy.mockRestore(); // Important: Restore the real function
    await prisma.profiles.delete({ where: { id: failUserId } });
  });
});
