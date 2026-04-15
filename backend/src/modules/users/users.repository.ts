import prisma from '../../prisma/prisma.client';

export class UsersRepository {

  /**
   * SILENT MIGRATION ENGINE — Core Phase 1
   *
   * Rule: supabase_user_id === profiles.id — enforced here, always.
   *
   * Flow:
   *  1. Look up profile by the Supabase-issued user ID
   *  2. If found → return it (99% of all requests after first login)
   *  3. If NOT found → atomically create a seed record using the exact Supabase ID
   *     This is the migration moment. It is silent, zero-friction, zero-downtime.
   *
   * NEVER generate a new UUID here. The ID comes from the verified JWT only.
   */
  async resolveOrSeedProfile(userId: string, claims: { email?: string; phone?: string }) {
    // ── Step 1: Fast path — existing user (Phase 2 Selective Sync) ───────────
    const existing = await prisma.profiles.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        phone: true,
        email: true,
        role: true,
        is_frozen: true,
        created_at: true,
        updated_at: true,
        last_synced_at: true,
      }
    });

    if (existing) {
      const updates: any = {};
      
      // Rule 1: Never overwrite with null, only apply if changed
      if (claims.email && claims.email.trim() !== existing.email) {
        updates.email = claims.email.trim();
      }
      
      if (claims.phone && claims.phone.trim() !== existing.phone) {
        // Prevent generic placeholders from overwriting legitimate phones
        if (!claims.phone.startsWith('__migrated')) {
           updates.phone = claims.phone.trim();
        }
      }

      // Rule 4: Avoid write storms. If nothing changed, do not hit DB
      if (Object.keys(updates).length > 0) {
        updates.last_synced_at = new Date().toISOString();
        
        try {
          const syncedProfile = await prisma.profiles.update({
            where: { id: userId },
            data: updates,
            select: {
              id: true,
              full_name: true,
              phone: true,
              email: true,
              role: true,
              is_frozen: true,
              created_at: true,
              updated_at: true,
              last_synced_at: true,
            }
          });

          // Level Up: Audit Logging for Sync
          await prisma.auditLogs.create({
            data: {
              action_type: 'PROFILE_SYNC',
              table_name: 'profiles',
              record_id: userId,
              user_id: userId,
              metadata: {
                updates,
                source: 'supabase_jwt'
              },
              created_at: new Date().toISOString(),
            }
          }).catch(e => console.warn('[MIGRATION] Sync audit log failed:', e.message));

          return { profile: syncedProfile, migrated: false };
        } catch (err: any) {
             console.warn(`[MIGRATION] Profile sync failed for ${userId}:`, err.message);
             // Fail gracefully: if sync fails (e.g. concurrency on update), just fallback to existing.
             return { profile: existing, migrated: false };
        }
      }

      return { profile: existing, migrated: false };
    }

    // ── Step 2: Silent migration — first-ever login for this identity ─────────
    // phone is NOT NULL UNIQUE in schema. If Supabase didn't provide one,
    // we use a deterministic placeholder derived from the user ID.
    const phone = claims.phone?.trim() || `__migrated_${userId.slice(0, 12)}`;
    const email = claims.email?.trim() || null;

    let seeded;
    try {
      seeded = await prisma.profiles.create({
        data: {
          id: userId,               // ← THE GOLDEN RULE: Supabase ID = DB ID
          full_name: email?.split('@')[0] || 'New User',
          phone,
          email,
          role: 'TENANT',          // Safe default — ops can promote via RBAC
          verified: false,
          is_frozen: false,
        },
        select: {
          id: true,
          full_name: true,
          phone: true,
          email: true,
          role: true,
          is_frozen: true,
          created_at: true,
          updated_at: true,
        }
      });
    } catch (err: any) {
      // Race condition guard: another request may have seeded simultaneously
      if (err.code === 'P2002') {
        // Unique constraint violation — try fetching the now-existing record
        const raceWinner = await prisma.profiles.findUnique({
          where: { id: userId },
          select: {
            id: true,
            full_name: true,
            phone: true,
            email: true,
            role: true,
            is_frozen: true,
            created_at: true,
            updated_at: true,
          }
        });
        if (raceWinner) return { profile: raceWinner, migrated: false };
      }
      throw err;
    }

    // ── Step 3: Emit audit record for observability ───────────────────────────
    await prisma.auditLogs.create({
      data: {
        action_type: 'SILENT_MIGRATION',
        table_name: 'profiles',
        record_id: userId,
        user_id: userId,
        metadata: {
          email,
          phone,
          source: 'supabase_jwt',
          note: 'Auto-seeded on first authenticated request',
        },
        created_at: new Date().toISOString(),
      }
    }).catch((auditErr) => {
      // Audit failure must never block the main flow
      console.warn('[MIGRATION] Audit log write failed (non-fatal):', auditErr.message);
    });

    console.log(`[MIGRATION] Silently seeded profile for user: ${userId}`);

    return { profile: seeded, migrated: true };
  }

  async getUserProfileSafe(userId: string) {
    return prisma.profiles.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
        phone: true,
        email: true,
        role: true,
        created_at: true,
        is_frozen: true
      }
    });
  }

  async updateProfile(userId: string, data: { full_name?: string }) {
    return prisma.profiles.update({
      where: { id: userId },
      data: {
        full_name: data.full_name,
        updated_at: new Date().toISOString()
      },
      select: {
        id: true,
        full_name: true,
        phone: true,
        email: true,
        role: true,
      }
    });
  }
}
