const fs = require('fs');
const path = require('path');

const prismaPath = path.resolve(__dirname, '../prisma/schema.prisma');
const csvPath = path.resolve(__dirname, '../../skills/DB/full_db_schema.csv');

console.log('Loading Prisma from:', prismaPath);
console.log('Loading DB CSV from:', csvPath);

const prismaStr = fs.readFileSync(prismaPath, 'utf8');
const csvStr = fs.readFileSync(csvPath, 'utf8');

// Parse CSV
const dbTables = {};
const lines = csvStr.split('\n');
for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  const parts = line.split(',');
  const table = parts[0];
  const col = parts[1];
  if (!dbTables[table]) dbTables[table] = [];
  dbTables[table].push(col);
}

// Parse Prisma
const prismaTables = {};
const modelRegex = /model\s+(\w+)\s+\{([\s\S]*?)\}/g;
let match;
while ((match = modelRegex.exec(prismaStr)) !== null) {
  const modelContent = match[2];
  let tableName = match[1];
  
  const mapMatch = modelContent.match(/@@map\("([^"]+)"\)/);
  if (mapMatch) {
    tableName = mapMatch[1];
  }
  
  const cols = [];
  const modelLines = modelContent.split('\n');
  for (const mLine of modelLines) {
    const trimmed = mLine.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) continue;
    const colName = trimmed.split(/\s+/)[0];
    if (colName) cols.push(colName);
  }
  prismaTables[tableName] = cols;
}

const missingInPrisma = [];
const missingColumnsInPrisma = {};
const extraInPrisma = [];

// Compare DB -> Prisma
for (const table in dbTables) {
  if (!prismaTables[table]) {
    missingInPrisma.push(table);
  } else {
    const dbCols = dbTables[table];
    const pCols = prismaTables[table];
    const missing = dbCols.filter(c => !pCols.includes(c));
    if (missing.length > 0) {
      missingColumnsInPrisma[table] = missing;
    }
  }
}

// Compare Prisma -> DB
for (const table in prismaTables) {
  if (!dbTables[table]) {
    extraInPrisma.push(table);
  }
}

console.log("\n=== 1. TABLES IN DB CSV BUT MISSING IN PRISMA SCHEMA ===");
if (missingInPrisma.length === 0) console.log("None! All DB tables are in Prisma.");
else missingInPrisma.forEach(t => console.log(' - ' + t));

console.log("\n=== 2. TABLES NEWLY ADDED TO PRISMA SCHEMA (Not in DB CSV) ===");
if (extraInPrisma.length === 0) console.log("None.");
else extraInPrisma.forEach(t => console.log(' - ' + t));

console.log("\n=== 3. COLUMNS IN DB CSV BUT MISSING FROM PRISMA MODELS ===");
let hasMissingCols = false;
for (const table in missingColumnsInPrisma) {
  hasMissingCols = true;
  console.log(` - ${table} is missing: ${missingColumnsInPrisma[table].join(', ')}`);
}
if (!hasMissingCols) console.log("None! All DB columns covered.");
