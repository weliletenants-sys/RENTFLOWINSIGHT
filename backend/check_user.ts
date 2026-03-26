import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); async function run() { console.log(await prisma.profiles.findFirst({where:{email:'rnampiima@gmail.com'}})); } run();
