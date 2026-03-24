const fs = require('fs');

let code = fs.readFileSync('c:/Users/USER/Documents/RENTFLOWINSIGHT/backend/src/controllers/cfo.controller.ts', 'utf8');

const regex = /^\s*\/\/ Build date filter for Ledger queries if provided[\s\S]*?if \(end_date\) createdFilter\.created_at\.lte = String\(end_date\);\n\s*}\s*$/m;

if (regex.test(code)) {
  code = code.replace(regex, '');
  fs.writeFileSync('c:/Users/USER/Documents/RENTFLOWINSIGHT/backend/src/controllers/cfo.controller.ts', code);
  console.log('Removed manual dateFilter block successfully.');
} else {
  console.log('Could not find the target block to remove.');
}
