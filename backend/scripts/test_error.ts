import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

async function test() {
    const data = JSON.parse(fs.readFileSync('./data_vault/user_roles.json', 'utf8'));
    // Do the same sanitization the script does
    for (const record of data) {
        for (const key of Object.keys(record)) {
            if (record[key] === '') record[key] = null;
        }
        if (record.created_at) record.created_at = new Date(record.created_at);
        if (record.updated_at) record.updated_at = new Date(record.updated_at);
        if (record.assigned_at) record.assigned_at = new Date(record.assigned_at);
    }
    try {
        await prisma.userRoles.createMany({ data: data.slice(0, 10), skipDuplicates: true });
        console.log("Success");
    } catch(e: any) {
        console.error("Full Error Output:");
        console.error(e.message);
    }
}
test().then(() => prisma.$disconnect());
