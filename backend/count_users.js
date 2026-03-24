const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.profiles.count().then(c => console.log('Total Profiles in DB:', c)).finally(() => prisma.$disconnect());
