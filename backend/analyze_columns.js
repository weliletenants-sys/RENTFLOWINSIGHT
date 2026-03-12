const fs = require('fs');
const readline = require('readline');

async function fixSchema() {
  const inputFile = '../welile_export_2026-03-12.sql';
  const fileStream = fs.createReadStream(inputFile);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  const sqlTables = {};

  // Extract columns
  for await (const line of rl) {
    if (line.startsWith('INSERT INTO public.')) {
      const match = line.match(/INSERT INTO public\.([a-zA-Z0-9_]+) \((.*?)\) VALUES/);
      if (match) {
        const tableName = match[1];
        const colsStr = match[2];
        const cols = colsStr.split(',').map(s => s.trim().replace(/"/g, ''));
        if (!sqlTables[tableName]) {
           sqlTables[tableName] = new Set();
        }
        for (const col of cols) {
          sqlTables[tableName].add(col);
        }
      }
    }
  }

  // Define new tables that are missing
  let newSchemaStr = '\n\nmodel AuditLogs {\n  id String @id @default(uuid())\n  metadata Json?\n  @@map("audit_logs")\n}\n\nmodel StaffProfiles {\n  id String @id @default(uuid())\n  @@map("staff_profiles")\n}\n';

  let lines = fs.readFileSync('prisma/schema.prisma', 'utf-8').split('\n');
  let currentTable = null;
  let currentBlockStart = 0;
  let blocks = {};
  let tableMapName = {};

  for (let i=0; i<lines.length; i++) {
    const line = lines[i];
    const mapMatch = line.match(/@@map\("([a-zA-Z0-9_]+)"\)/);
    if (mapMatch && currentTable) {
      tableMapName[currentTable] = mapMatch[1];
    }

    if (line.includes('model ')) {
      const name = line.match(/model ([a-zA-Z0-9_]+)/)[1];
      currentTable = name;
      currentBlockStart = i;
      blocks[name] = [];
    }

    if (currentTable) {
       blocks[currentTable].push(line);
       if (line.startsWith('}')) {
          currentTable = null;
       }
    }
  }

  // Re-read existing columns so we don't duplicate
  let prismaTablesCols = {}; // dbName -> Set of cols
  for (const [model, modelLines] of Object.entries(blocks)) {
    const dbName = tableMapName[model];
    if (!dbName) continue;
    prismaTablesCols[dbName] = new Set();
    for (const l of modelLines) {
       const mapped = l.match(/@map\("([a-zA-Z0-9_]+)"\)/);
       if (mapped) {
         prismaTablesCols[dbName].add(mapped[1]);
       } else if (l.trim() && !l.trim().startsWith('//') && !l.trim().startsWith('@@') && !l.trim().startsWith('}')) {
         const col = l.trim().split(/\s+/)[0];
         prismaTablesCols[dbName].add(col);
       }
    }
  }

  for (let [model, modelLines] of Object.entries(blocks)) {
    const dbName = tableMapName[model];
    if (!dbName || !sqlTables[dbName]) continue;

    const existingCols = prismaTablesCols[dbName];
    const neededCols = sqlTables[dbName];

    let insertIndex = modelLines.length - 2; // before } and @@map typically, let's just reverse iterate to find the last valid column
    for (let i = modelLines.length - 1; i >= 0; i--) {
        if (modelLines[i].includes('@@map')) {
           insertIndex = i - 1;
           break;
        }
    }
    
    for (const needed of neededCols) {
      if (!existingCols.has(needed)) {
         let type = 'String?';
         if (needed.includes('sms_sent')) type = 'Boolean?';
         if (needed === 'payout_day') type = 'Float?';
         modelLines.splice(insertIndex, 0, `  ${needed} ${type}`);
         console.log(`Auto-fixed: added ${needed} to ${model}`);
      }
    }
  }

  let finalOutput = lines.slice(0, 12).join('\n') + '\n';
  for (const [model, modelLines] of Object.entries(blocks)) {
    finalOutput += modelLines.join('\n') + '\n\n';
  }
  finalOutput += newSchemaStr;

  fs.writeFileSync('prisma/schema.prisma', finalOutput);
  console.log("Schema auto-patched successfully.");
}

fixSchema().catch(console.error);
