import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const prisma = new PrismaClient();

async function run() {
    // Attempt to find a Funder first for accurate testing
    const profile = await prisma.profiles.findFirst({
        where: { role: 'FUNDER' } 
    });
    
    const target = profile || await prisma.profiles.findFirst();

    if (!target) {
        console.log("❌ No users found in database. Please register an account first.");
        process.exit(1);
    }

    const payload = { 
        phone: target.phone, 
        email: target.email, 
        sub: target.id, 
        role: target.role || 'FUNDER', 
        firstName: target.full_name?.split(' ')[0] || 'User' 
    };
    
    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });
    
    console.log("\n======================================================================");
    console.log("✅ ACCESS TOKEN FOR:", payload.email || payload.phone, `(${payload.role})`);
    console.log("======================================================================\n");
    console.log(token);
    console.log("\n======================================================================");
}

run();
