import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const vaultDir = path.join(__dirname, 'data_vault');
if (!fs.existsSync(vaultDir)) {
    fs.mkdirSync(vaultDir);
}

const csvDir = path.join(__dirname, '../../skills/unzipped_export');
const files = fs.readdirSync(csvDir);

console.log(`Discovered ${files.length} CSV payloads. Commencing extraction into Data Vault...`);

let totalProcessed = 0;

for (const file of files) {
    if (!file.endsWith('.csv')) continue;
    
    const tableName = file.replace('.csv', '');
    const filePath = path.join(csvDir, file);
    
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        
        // Handle empty files seamlessly
        if (!fileContent.trim()) {
            console.log(`[${tableName}] -> 0 rows (Empty File)`);
            continue;
        }

        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            cast: true // automatically convert numbers and booleans
        });
        
        if (records.length > 0) {
            fs.writeFileSync(path.join(vaultDir, `${tableName}.json`), JSON.stringify(records, null, 2));
            console.log(`[${tableName}] -> Saved ${records.length} records!`);
            totalProcessed += records.length;
        } else {
            console.log(`[${tableName}] -> 0 rows`);
        }
    } catch(e: any) {
        console.error(`Error parsing ${file}: ${e.message}`);
    }
}

console.log(`\nPhase 1 Complete! Data Vault secured. Total rows mathematically locked down: ${totalProcessed}`);
