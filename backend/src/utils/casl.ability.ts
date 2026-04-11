import { AbilityBuilder, createMongoAbility, InferSubjects, MongoQuery, ExtractSubjectType } from '@casl/ability';
import prisma from '../prisma/prisma.client';

export type Actions = 'manage' | 'access' | 'create' | 'read' | 'update' | 'delete';
export type Subjects = InferSubjects<any> | 'all' | 'CEO_Dashboard' | 'CTO_Dashboard' | 'CFO_Dashboard' | 'COO_Dashboard' | 'CMO_Dashboard' | 'CRM_Dashboard' | 'HR_Dashboard' | 'Admin_Dashboard' | 'Operations_Dashboard' | 'Users' | 'FinancialOps' | 'CompanyOps' | 'AgentOps' | 'TenantOps' | 'LandlordOps' | 'PartnerOps' | 'ExecutiveHub' | 'RoiTrends';

export type AppAbility = ReturnType<typeof createMongoAbility<[Actions, Subjects]>>;

/**
 * Build the CASL AppAbility evaluating the user's role hierarchy dynamically from the DB
 */
export async function defineAbilityFor(userId: string): Promise<AppAbility> {
  const { can, build } = new AbilityBuilder(createMongoAbility<[Actions, Subjects]>);

  // 1. Fetch the user's assigned role string from existing UserRoles logic or payload
  const userRoleEntity = await prisma.userRoles.findFirst({
    where: { user_id: userId, enabled: true }
  });

  if (!userRoleEntity) {
      return build(); // No abilities
  }

  // 2. Fetch the actual SystemRole mapped by the name
  const systemRole = await prisma.systemRoles.findUnique({
      where: { name: userRoleEntity.role.toUpperCase() },
      include: {
          permissions: { include: { permission: true } },
          children: { include: { permissions: { include: { permission: true } } } } // Hierarchy: Get children permissions
      }
  });

  if (!systemRole) {
      // Allow graceful fallback mapping if old data exists
      if (['CEO', 'CTO', 'SUPER_ADMIN'].includes(userRoleEntity.role.toUpperCase())) {
         if (['SUPER_ADMIN', 'CTO'].includes(userRoleEntity.role.toUpperCase())) {
            can('manage', 'all');
         }
      }
      return build();
  }

  // 3. Grant direct permissions
  systemRole.permissions.forEach(rp => {
      const p = rp.permission;
      can(p.action as Actions, p.subject as Subjects);
  });

  // 4. Grant inherited permissions (from immediate children)
  if (systemRole.children && systemRole.children.length > 0) {
      systemRole.children.forEach(childRole => {
          childRole.permissions.forEach(rp => {
              const p = rp.permission;
              // Ensure no duplicate rule conflicts, though CASL handles it fine
              can(p.action as Actions, p.subject as Subjects);
          });
      });
  }

  return build();
}
