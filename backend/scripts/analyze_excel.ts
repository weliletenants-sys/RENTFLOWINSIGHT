import * as XLSX from 'xlsx';
import path from 'path';

const filePath = path.join(__dirname, '../../skills/welile_database_export.xlsx');
console.log('Reading ' + filePath);
const workbook = XLSX.readFile(filePath);

console.log('Sheets found: ' + workbook.SheetNames.length);
for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    if (data.length > 0) {
       console.log(`[${sheetName}]: ${data.length} rows`);
    }
}
