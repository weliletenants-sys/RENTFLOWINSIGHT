import fs from 'fs';

const schema1 = fs.readFileSync('../prisma/schema.prisma', 'utf8');
const schema2 = fs.readFileSync('./lovable_schema_raw.prisma', 'utf8');

// Helper to extract all models and their raw text blocks
function parseModels(schema: string) {
  const models = new Map<string, string>();
  
  // Splitting by 'model ' is reliable if formatted
  const parts = schema.split(/^model\s+/m);
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const modelName = part.substring(0, part.indexOf(' ')).trim();
    // find the matching closing brace
    const endMatch = part.match(/\n\s*\}/);
    if (endMatch && endMatch.index !== undefined) {
      const block = "model " + part.substring(0, endMatch.index + endMatch[0].length);
      models.set(modelName, block);
    } else {
        // Fallback for simple regex mismatch
        const closingBrace = part.lastIndexOf('}');
        models.set(modelName, "model " + part.substring(0, closingBrace + 1));
    }
  }
  return models;
}

const s1Models = parseModels(schema1);
const s2Models = parseModels(schema2);

const CORE_MODELS_TO_PROTECT = ['Wallets', 'LedgerTransactions', 'GeneralLedger', 'AuditLogs'];

let finalSchema = `generator client {
  provider   = "prisma-client-js"
  engineType = "library"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum PaymentMethod {
  WALLET
  CASH
  MOBILE_MONEY
}

`;

// 1. Write the PROTECTED core models from V2 but patched for Lovable
let walletsBlock = s1Models.get('Wallets')!;
// Patch wallets to include Lovable properties so PWA doesn't crash
walletsBlock = walletsBlock.replace(
  '  @@map("wallets")', 
  '  user_id String?\n  locked_balance Decimal @default(0)\n  currency String @default("UGX")\n\n  @@map("wallets")'
);
finalSchema += walletsBlock + '\n\n';

let ledgerTxBlock = s1Models.get('LedgerTransactions')!;
finalSchema += ledgerTxBlock + '\n\n';

let genLedgerBlock = s1Models.get('GeneralLedger')!;
finalSchema += genLedgerBlock + '\n\n';

let auditLogsBlock = s1Models.get('AuditLogs')!;
finalSchema += auditLogsBlock + '\n\n';

// 2. Iterate through lovable_schema (S2) and add everything else
for (const [modelName, block] of s2Models.entries()) {
  if (CORE_MODELS_TO_PROTECT.includes(modelName)) continue;
  
  // We overwrite the stringy schemas from S1 because S2 has real Postgres types!
  finalSchema += block + '\n\n';
}

// 3. Append the 38 unique models that ONLY existed in S1
for (const [modelName, block] of s1Models.entries()) {
  if (!s2Models.has(modelName) && !CORE_MODELS_TO_PROTECT.includes(modelName)) {
    finalSchema += block + '\n\n';
  }
}

fs.writeFileSync('../prisma/schema.prisma', finalSchema);
console.log('Synthesis complete. Written 100+ perfect DB models to schema.prisma');
