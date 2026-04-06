import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });
const prisma = new PrismaClient();

async function run() {
    const email = 'pexpert46@gmail.com';
    
    // 1. Find Profile
    const profile = await prisma.profiles.findFirst({
        where: { email: email } 
    });

    if (!profile) {
        console.log(`❌ Profile not found for email: ${email}`);
        process.exit(1);
    }

    // 2. Find or Create Wallet
    let wallet = await prisma.wallets.findFirst({
        where: { user_id: profile.id }
    });

    if (!wallet) {
        wallet = await prisma.wallets.create({
            data: {
                user_id: profile.id,
                balance: 5000000000,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        });
        console.log(`✅ Created Wallet for ${email}`);
    } else {
        await prisma.wallets.update({
            where: { id: wallet.id },
            data: { 
                balance: 5000000000,
                updated_at: new Date().toISOString()
            }
        });
        console.log(`✅ Selected Existing Wallet for ${email}`);
    }

    // 3. Find or Create 'available' Bucket
    let bucket = await prisma.walletBuckets.findFirst({
        where: { wallet_id: wallet.id, bucket_type: 'available' }
    });

    const fundAmount = 5000000000; // 5 Billion UGX

    if (!bucket) {
        await prisma.walletBuckets.create({
            data: {
                wallet_id: wallet.id,
                bucket_type: 'available',
                balance: fundAmount,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }
        });
    } else {
        await prisma.walletBuckets.update({
            where: { id: bucket.id },
            data: { 
                balance: fundAmount,
                updated_at: new Date().toISOString()
            }
        });
    }
    
    console.log(`🤑 Added 5 Billion UGX available liquidity to ${email}'s wallet.`);

    // 4. Generate Token
    const payload = { 
        phone: profile.phone, 
        email: profile.email, 
        sub: profile.id, 
        role: profile.role || 'FUNDER', 
        firstName: profile.full_name?.split(' ')[0] || 'TestUser' 
    };
    
    const secret = process.env.JWT_SECRET || 'fallback-secret-for-dev';
    const token = jwt.sign(payload, secret, { expiresIn: '24h' });
    
    console.log("\n======================================================================");
    console.log(`✅ STRESS TEST ACCESS TOKEN FOR: ${email}`);
    console.log("======================================================================\n");
    console.log(token);
    console.log("\n======================================================================");
}

run().catch(console.error).finally(() => prisma.$disconnect());
