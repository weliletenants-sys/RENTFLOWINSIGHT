import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();
const AGENTS_DIR = path.join(__dirname, '../../AGENTS');

const importCSV = async (filename: string, modelName: string) => {
    const filePath = path.join(AGENTS_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    console.log(`Importing ${filename} into ${modelName}...`);
    const results: any[] = [];
    
    return new Promise((resolve) => {
        fs.createReadStream(filePath)
            .pipe(csv({ separator: ';' }))
            .on('data', (data: any) => {
                const cleanedData: any = {};
                for (const key in data) {
                    let val = data[key];
                    if (val === '') {
                        cleanedData[key] = null;
                    } else if (!isNaN(Number(val)) && val.trim() !== '') {
                        // keep IDs and strings as strings
                        if (
                          key.includes('phone') || key.includes('number') || key.includes('id') || 
                          key.includes('name') || key.includes('status') || key.includes('description') || 
                          key.includes('method') || key.includes('notes') || key.includes('type') || 
                          key.includes('reason') || key.includes('token') || key.includes('url') || key.includes('created_at') || key.includes('updated_at')
                        ) {
                            cleanedData[key] = val;
                        } else {
                            cleanedData[key] = Number(val);
                        }
                    } else if (val === 't' || val === 'true') {
                        cleanedData[key] = true;
                    } else if (val === 'f' || val === 'false') {
                        cleanedData[key] = false;
                    } else {
                        cleanedData[key] = val;
                    }
                }
                results.push(cleanedData);
            })
            .on('end', async () => {
                try {
                    if (!(prisma as any)[modelName]) {
                        console.log(`Skipping ${modelName} - model not found in Prisma Client.`);
                        resolve(true);
                        return;
                    }
                    
                    const count = await (prisma as any)[modelName].count();
                    if (count > 0) {
                        console.log(`${modelName} already has ${count} records. Skipping import to avoid duplicates.`);
                        resolve(true);
                        return;
                    }
                    
                    if (results.length > 0) {
                        await (prisma as any)[modelName].createMany({
                            data: results,
                            skipDuplicates: true
                        });
                        console.log(`Successfully imported ${results.length} records into ${modelName}.`);
                    } else {
                        console.log(`No records to import for ${modelName}.`);
                    }
                    resolve(true);
                } catch (error) {
                    console.error(`Error importing ${modelName}:`, error);
                    resolve(false);
                }
            });
    });
};

const main = async () => {
    try {
        await importCSV('agent_advances.csv', 'agentAdvances');
        await importCSV('agent_advance_ledger.csv', 'agentAdvanceLedger');
        await importCSV('agent_collections.csv', 'agentCollections');
        await importCSV('agent_commission_payouts.csv', 'agentCommissionPayouts');
        await importCSV('agent_earnings.csv', 'agentEarnings');
        await importCSV('agent_goals.csv', 'agentGoals');
        await importCSV('agent_receipts.csv', 'agentReceipts');
        await importCSV('agent_subagents.csv', 'agentSubagents');
        await importCSV('agent_visits.csv', 'agentVisits');
        
        console.log("Agent CSV Imports Complete!");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
};

main();
