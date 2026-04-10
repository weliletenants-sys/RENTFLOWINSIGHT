import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Roles & Permissions...');

  // 1. Define Permissions based on Roles.md Matrix
  const permissionsData = [
    { action: 'manage', subject: 'all', system_name: 'manage_all', description: 'Universal Bypass Access' },
    
    // Executive Dashboards
    { action: 'access', subject: 'CEO_Dashboard', system_name: 'ceo', description: 'Access CEO Dashboard' },
    { action: 'access', subject: 'CTO_Dashboard', system_name: 'cto', description: 'Access CTO Dashboard' },
    { action: 'access', subject: 'CFO_Dashboard', system_name: 'cfo', description: 'Access CFO Dashboard' },
    { action: 'access', subject: 'COO_Dashboard', system_name: 'coo', description: 'Access COO Dashboard' },
    { action: 'access', subject: 'CMO_Dashboard', system_name: 'cmo', description: 'Access CMO Dashboard' },
    { action: 'access', subject: 'CRM_Dashboard', system_name: 'crm', description: 'Access CRM Dashboard' },
    { action: 'access', subject: 'HR_Dashboard', system_name: 'hr', description: 'Access HR Dashboard' },

    // Admin & Ops Dashboards
    { action: 'access', subject: 'Admin_Dashboard', system_name: 'admin-dashboard', description: 'Access Admin Dashboard' },
    { action: 'access', subject: 'Operations_Dashboard', system_name: 'operations-dashboard', description: 'Access Field Operations Dashboard' },

    // Features
    { action: 'manage', subject: 'Users', system_name: 'manage-users', description: 'Manage Platform Users' },
    { action: 'manage', subject: 'FinancialOps', system_name: 'financial-ops', description: 'Access Financial Operations' },
    { action: 'manage', subject: 'CompanyOps', system_name: 'company-ops', description: 'Manage Company Staff' },
    { action: 'manage', subject: 'AgentOps', system_name: 'agent-ops', description: 'Manage Field Agents' },
    { action: 'manage', subject: 'TenantOps', system_name: 'tenant-ops', description: 'Manage Tenants' },
    { action: 'manage', subject: 'LandlordOps', system_name: 'landlord-ops', description: 'Manage Landlords' },
    { action: 'manage', subject: 'PartnerOps', system_name: 'partner-ops', description: 'Manage Partners/Funders' },

    // Shared
    { action: 'access', subject: 'ExecutiveHub', system_name: 'executive-hub', description: 'Access Cross-Functional Executive Hub' },
    { action: 'access', subject: 'RoiTrends', system_name: 'roi-trends', description: 'Access ROI Trends' },
  ];

  const dbPermissions: Record<string, any> = {};
  for (const p of permissionsData) {
    dbPermissions[p.system_name] = await prisma.permissions.upsert({
      where: { system_name: p.system_name },
      update: { action: p.action, subject: p.subject, description: p.description },
      create: p,
    });
  }

  // 2. Define Roles
  const rolesData = [
    'SUPER_ADMIN', 'CTO', 'CEO', 'CFO', 'COO', 'CMO', 'CRM', 'HR', 'MANAGER', 'EMPLOYEE',
    'OPERATIONS', 'PARTNERSHIP_OPERATIONS', 'FINANCIAL_OPERATIONS', 'TENANT_OPERATIONS', 'AGENT_OPERATIONS', 'LANDLORD_OPERATIONS'
  ];

  const dbRoles: Record<string, any> = {};
  for (const rName of rolesData) {
    dbRoles[rName] = await prisma.systemRoles.upsert({
      where: { name: rName },
      update: {},
      create: { name: rName },
    });
  }

  // 3. Set up Hierarchy (Child roles linked to Operations)
  await prisma.systemRoles.update({
    where: { name: 'OPERATIONS' },
    data: {
      children: {
        connect: [
          { name: 'PARTNERSHIP_OPERATIONS' },
          { name: 'FINANCIAL_OPERATIONS' },
          { name: 'TENANT_OPERATIONS' },
          { name: 'AGENT_OPERATIONS' },
          { name: 'LANDLORD_OPERATIONS' }
        ]
      }
    }
  });

  // Helper to assign permissions to a role safely
  async function assignPermissions(roleName: string, permSystemNames: string[]) {
    const roleId = dbRoles[roleName].id;
    
    for (const sysName of permSystemNames) {
      if (!dbPermissions[sysName]) {
        console.warn(`Permission missing in db map: ${sysName}`);
        continue;
      }
      
      const permId = dbPermissions[sysName].id;
      
      await prisma.rolePermissions.upsert({
        where: { role_id_permission_id: { role_id: roleId, permission_id: permId } },
        update: {},
        create: { role_id: roleId, permission_id: permId }
      });
    }
  }

  // 4. Map Permissions to Roles

  // Bypass Roles
  await assignPermissions('SUPER_ADMIN', ['manage_all']);
  await assignPermissions('CTO', ['manage_all']);

  // C-Suite Roles
  await assignPermissions('CEO', ['ceo', 'executive-hub', 'roi-trends']);
  await assignPermissions('CFO', ['cfo', 'financial-ops', 'executive-hub', 'roi-trends']);
  await assignPermissions('COO', ['coo', 'financial-ops', 'executive-hub', 'roi-trends']);
  await assignPermissions('CMO', ['cmo', 'executive-hub']);
  await assignPermissions('CRM', ['crm', 'executive-hub']);
  await assignPermissions('HR', ['hr']);

  // Administrative / Ops
  await assignPermissions('MANAGER', ['admin-dashboard', 'manage-users', 'financial-ops', 'operations-dashboard', 'executive-hub', 'roi-trends']);
  await assignPermissions('EMPLOYEE', ['admin-dashboard', 'executive-hub']);
  
  // Operations Tree
  await assignPermissions('OPERATIONS', ['operations-dashboard', 'executive-hub', 'roi-trends']);
  await assignPermissions('PARTNERSHIP_OPERATIONS', ['partner-ops']);
  await assignPermissions('FINANCIAL_OPERATIONS', ['financial-ops']);
  await assignPermissions('TENANT_OPERATIONS', ['tenant-ops']);
  await assignPermissions('AGENT_OPERATIONS', ['agent-ops']);
  await assignPermissions('LANDLORD_OPERATIONS', ['landlord-ops']);

  console.log('Role & Permissions Seeding Completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
