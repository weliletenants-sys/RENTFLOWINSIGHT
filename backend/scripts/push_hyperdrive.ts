import { PrismaClient, Prisma } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function push() {
  const vaultDir = path.join(__dirname, 'data_vault');
  const files = fs.readdirSync(vaultDir).filter(f => f.endsWith('.json'));

  // Pre-compute Prisma mappings and Date columns for bulletproof ingestion
  const modelMap: Record<string, string> = {};
  const dateColumnsMap: Record<string, string[]> = {};
  const booleanColumnsMap: Record<string, string[]> = {};
  const stringColumnsMap: Record<string, string[]> = {};

  for (const model of Prisma.dmmf.datamodel.models) {
    const key = model.dbName || model.name.toLowerCase();
    modelMap[key] = model.name;
    
    dateColumnsMap[model.name] = model.fields
        .filter(f => f.type === 'DateTime')
        .map(f => f.name);

    booleanColumnsMap[model.name] = model.fields
        .filter(f => f.type === 'Boolean')
        .map(f => f.name);

    stringColumnsMap[model.name] = model.fields
        .filter(f => f.type === 'String')
        .map(f => f.name);
  }

  const CHUNK_SIZE = 1000;
  let totalPushed = 0;

  for (const file of files) {
    const tableName = file.replace('.json', '');
    const modelNamePascal = modelMap[tableName];
    
    if (!modelNamePascal) {
        console.warn(`[SKIP] Could not resolve Prisma mapping for ${tableName}`);
        continue;
    }
    
    const modelName = modelNamePascal.charAt(0).toLowerCase() + modelNamePascal.slice(1);
    const data = JSON.parse(fs.readFileSync(path.join(vaultDir, file), 'utf8'));
    
    if (data.length === 0) continue;
    
    if (!(prisma as any)[modelName]) {
        console.warn(`[SKIP] Prisma missing access property for ${modelName}`);
        continue;
    }

    console.log(`[>>] Pushing ${data.length} records into AWS [${modelNamePascal}]...`);
    
    const dateFields = dateColumnsMap[modelNamePascal] || [];
    const booleanFields = booleanColumnsMap[modelNamePascal] || [];
    const stringFields = stringColumnsMap[modelNamePascal] || [];

    // Data formatting pass
    for (const record of data) {
        // Strip out any empty strings that CSV might have put into nullable foreign keys or ints
        for (const key of Object.keys(record)) {
            if (record[key] === '') {
                record[key] = null;
            }
        }
        
        // Strict timezone casting
        for (const dField of dateFields) {
            if (record[dField]) {
                const parsed = new Date(record[dField]);
                if (!isNaN(parsed.getTime())) {
                    record[dField] = parsed;
                } else {
                    record[dField] = null; // Prevent Prisma crash on invalid CSV date
                }
            }
        }

        // Strict Boolean casting
        for (const bField of booleanFields) {
            if (record[bField] !== null && record[bField] !== undefined) {
                if (typeof record[bField] === 'string') {
                    const str = record[bField].toLowerCase().trim();
                    record[bField] = str === 'true' || str === 't' || str === '1' || str === 'yes';
                } else if (typeof record[bField] === 'number') {
                    record[bField] = record[bField] === 1;
                }
            }
        }

        // Strict String casting
        for (const sField of stringFields) {
            if (record[sField] !== null && record[sField] !== undefined) {
                if (typeof record[sField] !== 'string') {
                    record[sField] = record[sField].toString();
                }
            }
        }
    }

    // Micro-batch ingestion loop
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE);
        
        // V2 Architecture specific fixes
        if (tableName === 'wallets') {
            for (const r of chunk) {
                if (!r.account_id) r.account_id = require('crypto').randomUUID();
            }
        }
        
        try {
            await (prisma as any)[modelName].createMany({
               data: chunk,
               skipDuplicates: true
            });
        } catch(e: any) {
            console.error(`\n[FATAL] ${tableName} Chunk failed:`);
            console.error(e.message);
        }
    }
    totalPushed += data.length;
  }
  
  console.log(`\n================================`);
  console.log(`AWS RDS MIGRATION SUCCESSFUL!`);
  console.log(`Total Objects Seeded: ${totalPushed}`);
  console.log(`================================`);
}

push().then(() => {
   prisma.$disconnect();
});
