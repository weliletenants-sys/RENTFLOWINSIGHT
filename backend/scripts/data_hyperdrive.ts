import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "https://wirntoujqoyjobfhyelc.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpcm50b3VqcW95am9iZmh5ZWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NjE1MTYsImV4cCI6MjA4MjEzNzUxNn0.5-zxcRPVxvpxNiXhoo5VHpIuvbtuOLfiI3ph8jPIod8";

const vaultDir = path.join(__dirname, 'data_vault');
if (!fs.existsSync(vaultDir)) {
    fs.mkdirSync(vaultDir);
}

const schema = fs.readFileSync(path.join(__dirname, '../prisma/schema.prisma'), 'utf8');
const tables: string[] = [];
const lines = schema.split('\n');
for (const line of lines) {
    const match = line.match(/@@map\("(.+)"\)/);
    if (match) {
        tables.push(match[1]);
    }
}

async function extractTable(tableName: string) {
    console.log(`Extracting [${tableName}]...`);
    let allData: any[] = [];
    let offset = 0;
    const limit = 1000;
    
    while (true) {
        // Use Range header for deterministic slicing vs limit/offset for performance
        const url = `${SUPABASE_URL}/rest/v1/${tableName}?select=*`;
        try {
            // Note: node fetch requires native fetch (node 18+)
            const response = await fetch(url, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Range-Unit': 'items',
                    'Range': `${offset}-${offset + limit - 1}`
                }
            });
            
            if (!response.ok) {
                if (response.status === 404 || response.status === 406 || response.status === 401) {
                     console.log(`  -> Skipped (Status: ${response.status}) either view or RLS restricted.`);
                     break;
                }
                const errText = await response.text();
                throw new Error(`Failed to fetch ${tableName}: ${response.status} ${errText}`);
            }
            
            const data = await response.json();
            if (!data || data.length === 0) {
                break;
            }
            
            allData = allData.concat(data);
            
            if (data.length < limit) {
                break; // Last page
            }
            
            offset += limit;
        } catch (e: any) {
            console.log(`  -> Error processing ${tableName}: ${e.message}`);
            break;
        }
    }
    
    if (allData.length > 0) {
        fs.writeFileSync(path.join(vaultDir, `${tableName}.json`), JSON.stringify(allData, null, 2));
        console.log(`  -> Saved ${allData.length} records!`);
    } else {
        console.log(`  -> No data found (0 records).`);
    }
}

async function run() {
    console.log(`Initializing Hyperdrive... Found ${tables.length} tables in Master Schema.`);
    for (const table of tables) {
        await extractTable(table);
    }
    console.log("Hyperdrive Phase 1: Mass Extraction Complete! Cargo secured in /data_vault/");
}

run();
