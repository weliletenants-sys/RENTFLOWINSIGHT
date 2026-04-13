import fs from 'fs';
import path from 'path';

const csvPath = path.join(__dirname, '../../query-results-export-2026-04-13_10-16-50.csv');
const outPath = path.join(__dirname, 'lovable_schema_raw.prisma');

const raw = fs.readFileSync(csvPath, 'utf-8');
const lines = raw.split('\n');

const tables: Record<string, any[]> = {};

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  
  // Format: column_default;column_name;data_type;is_nullable;table_name
  const parts = line.split(';');
  if (parts.length < 5) continue;

  const defaultVal = parts[0];
  const colName = parts[1];
  const dataType = parts[2];
  const isNullable = parts[3] === 'YES';
  const tableName = parts[4];

  if (!tables[tableName]) {
    tables[tableName] = [];
  }

  tables[tableName].push({ colName, dataType, isNullable, defaultVal });
}

let prismaOutput = '// --- GENERATED FROM LOVABLE CSV ---\n\n';

for (const tableName of Object.keys(tables)) {
  const modelName = tableName.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  
  prismaOutput += `model ${modelName} {\n`;
  
  for (const col of tables[tableName]) {
    let prismaType = 'String';
    if (col.dataType === 'uuid') prismaType = 'String';
    else if (col.dataType.includes('timestamp') || col.dataType.includes('date')) prismaType = 'DateTime';
    else if (col.dataType === 'numeric' || col.dataType === 'double precision') prismaType = 'Decimal';
    else if (col.dataType === 'integer' || col.dataType === 'bigint') prismaType = 'Int';
    else if (col.dataType === 'boolean') prismaType = 'Boolean';
    else if (col.dataType === 'jsonb') prismaType = 'Json';
    else if (col.dataType.includes('ARRAY')) prismaType = 'String[]';

    let optional = col.isNullable ? '?' : '';
    let modifiers = '';

    if (col.colName === 'id') {
      modifiers += ' @id';
      if (col.defaultVal && col.defaultVal.includes('uuid')) {
          modifiers += ' @default(uuid())';
      }
    } else if (col.defaultVal) {
      if (col.defaultVal.includes('now()')) modifiers += ' @default(now())';
      else if (col.defaultVal === '0') modifiers += ' @default(0)';
      else if (col.defaultVal === 'false') modifiers += ' @default(false)';
      else if (col.defaultVal === 'true') modifiers += ' @default(true)';
    }

    prismaOutput += `  ${col.colName} ${prismaType}${optional}${modifiers}\n`;
  }

  prismaOutput += `  @@map("${tableName}")\n`;
  prismaOutput += `}\n\n`;
}

fs.writeFileSync(outPath, prismaOutput);
console.log('Successfully wrote to ' + outPath);
