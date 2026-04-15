import prisma from '../src/prisma/prisma.client';
import { UsersRepository } from '../src/modules/users/users.repository';
import { v4 as uuidv4 } from 'uuid';

async function runTests() {
  console.log('🚀 Starting Phase 1: Silent Migration Validation');
  const repo = new UsersRepository();
  const testUserId = uuidv4();
  const testEmail = `test_${testUserId.substring(0, 8)}@example.com`;
  const jwtClaims = { email: testEmail, phone: '5551234567' };
  
  let passed = 0;
  let failed = 0;

  try {
    console.log('\n--- 1. First Login Test (Fresh User) ---');
    const before = await prisma.profiles.findUnique({ where: { id: testUserId } });
    if (before) throw new Error('User should not exist yet');
    
    const { profile, migrated } = await repo.resolveOrSeedProfile(testUserId, jwtClaims);
    if (!migrated) throw new Error('Migrated should be true');
    if (profile.id !== testUserId) throw new Error('ID mismatch');
    
    const auditRecord = await prisma.auditLogs.findFirst({
      where: { user_id: testUserId, action_type: 'SILENT_MIGRATION' }
    });
    if (!auditRecord) throw new Error('Audit log not found');
    console.log('✅ Passed');
    passed++;
  } catch (e: any) {
    console.error('❌ Failed:', e.message);
    failed++;
  }

  try {
    console.log('\n--- 2. Second Login Test (Existing User Idempotency) ---');
    const { profile, migrated } = await repo.resolveOrSeedProfile(testUserId, jwtClaims);
    if (migrated) throw new Error('Migrated should be false for existing user');
    if (profile.id !== testUserId) throw new Error('ID mismatch');
    
    const auditLogs = await prisma.auditLogs.findMany({
      where: { user_id: testUserId, action_type: 'SILENT_MIGRATION' }
    });
    if (auditLogs.length !== 1) throw new Error(`Expected exactly 1 audit log, found ${auditLogs.length}`);
    console.log('✅ Passed');
    passed++;
  } catch (e: any) {
    console.error('❌ Failed:', e.message);
    failed++;
  }

  try {
    console.log('\n--- 3. Concurrency Test ---');
    const concurrentUserId = uuidv4();
    const concurrentEmail = `conc_${concurrentUserId.substring(0, 8)}@example.com`;
    const cClaims = { email: concurrentEmail, phone: '5559876543' };

    const promises = Array.from({ length: 5 }).map(() =>
      repo.resolveOrSeedProfile(concurrentUserId, cClaims)
    );
    const results = await Promise.all(promises);

    const usersInDb = await prisma.profiles.findMany({ where: { id: concurrentUserId } });
    if (usersInDb.length !== 1) throw new Error(`Expected exactly 1 user, found ${usersInDb.length}`);
    
    const migrations = results.filter(r => r.migrated === true);
    if (migrations.length !== 1) throw new Error(`Expected exactly 1 migration, found ${migrations.length}`);
    
    for (const res of results) {
      if (res.profile.id !== concurrentUserId) throw new Error('Profile ID mismatch in concurrency results');
    }
    
    // Cleanup concurrency test
    await prisma.auditLogs.deleteMany({ where: { user_id: concurrentUserId } });
    await prisma.profiles.delete({ where: { id: concurrentUserId } });
    console.log('✅ Passed');
    passed++;
  } catch (e: any) {
    console.error('❌ Failed:', e.message);
    failed++;
  }

  try {
    console.log('\n--- 4. Partial Failure Simulation (Audit Log fails but Seed Succeeds) ---');
    const failUserId = uuidv4();
    const failClaims = { email: 'fail@example.com' };

    // Hacky stub to simulate Prisma throw
    const originalCreate = prisma.auditLogs.create;
    prisma.auditLogs.create = async () => { throw new Error('Simulated Audit Failure'); };

    const { profile, migrated } = await repo.resolveOrSeedProfile(failUserId, failClaims);
    if (!migrated) throw new Error('Migrated should be true even if audit fails');
    if (profile.id !== failUserId) throw new Error('User ID mismatch');

    // Restore early
    prisma.auditLogs.create = originalCreate;

    await prisma.profiles.delete({ where: { id: failUserId } });
    console.log('✅ Passed');
    passed++;
  } catch (e: any) {
    console.error('❌ Failed:', e.message);
    failed++;
  }

  // --- PHASE 2 TESTS ---

  try {
    console.log('\n--- 5. Metadata Change Test ---');
    // Change Email
    const newEmail = 'changed_' + testEmail;
    const newClaims = { email: newEmail, phone: '5551234567' }; 
    const { profile, migrated } = await repo.resolveOrSeedProfile(testUserId, newClaims);

    if (migrated) throw new Error('Migrated flag incorrectly true');
    if (profile.email !== newEmail) throw new Error('Email did not selectively sync');
    if (!profile.last_synced_at) throw new Error('last_synced_at timestamp was not updated');

    const syncLog = await prisma.auditLogs.findFirst({
      where: { user_id: testUserId, action_type: 'PROFILE_SYNC' }
    });
    if (!syncLog) throw new Error('PROFILE_SYNC audit log not written');
    
    console.log('✅ Passed');
    passed++;
  } catch (e: any) {
    console.error('❌ Failed:', e.message);
    failed++;
  }

  try {
    console.log('\n--- 6. No Change Test ---');
    // Repeated login with exactly the same metadata
    const cachedProfile = await prisma.profiles.findUnique({ where: { id: testUserId } });
    const baselineLastSynced = cachedProfile?.last_synced_at?.toISOString();
    
    const unchangedClaims = { email: 'changed_' + testEmail, phone: '5551234567' };
    await repo.resolveOrSeedProfile(testUserId, unchangedClaims);

    const postSyncProfile = await prisma.profiles.findUnique({ where: { id: testUserId } });
    if (baselineLastSynced !== postSyncProfile?.last_synced_at?.toISOString()) {
        throw new Error('last_synced_at changed even though metadata was exactly the same');
    }

    const syncLogsCount = await prisma.auditLogs.count({
      where: { user_id: testUserId, action_type: 'PROFILE_SYNC' }
    });
    if (syncLogsCount > 1) {
       throw new Error(`Write storm detected. Expected 1 sync log from prev test, got ${syncLogsCount}`);
    }

    console.log('✅ Passed');
    passed++;
  } catch (e: any) {
    console.error('❌ Failed:', e.message);
    failed++;
  }

  try {
    console.log('\n--- 7. Null Safety Test ---');
    // Login missing phone number
    const missingPhoneClaims = { email: 'changed_' + testEmail };
    const { profile } = await repo.resolveOrSeedProfile(testUserId, missingPhoneClaims);
    
    if (!profile.phone || profile.phone !== '5551234567') {
        throw new Error('Null claim incorrectly wiped out existing DB state!');
    }
    
    console.log('✅ Passed');
    passed++;
  } catch (e: any) {
    console.error('❌ Failed:', e.message);
    failed++;
  }

  // Cleanup main test user
  await prisma.auditLogs.deleteMany({ where: { user_id: testUserId } });
  await prisma.profiles.deleteMany({ where: { id: testUserId } });
  await prisma.$disconnect();

  console.log(`\n==============\nRESULTS: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) process.exit(1);
  process.exit(0);
}

runTests();
