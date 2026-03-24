const fs = require('fs');

let code = fs.readFileSync('c:/Users/USER/Documents/RENTFLOWINSIGHT/backend/src/controllers/cfo.controller.ts', 'utf8');
let lines = code.split('\n');

// Find the index of "// Build date filter for Ledger queries if provided"
const startIndex = lines.findIndex(l => l.includes('// Build date filter for Ledger queries if provided'));

if (startIndex !== -1) {
   lines.splice(startIndex, 15);
   fs.writeFileSync('c:/Users/USER/Documents/RENTFLOWINSIGHT/backend/src/controllers/cfo.controller.ts', lines.join('\n'));
   console.log('Removed 15 lines starting at ' + startIndex);
} else {
   console.log('Line not found');
}
