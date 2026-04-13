import fs from 'fs';

const schema1 = fs.readFileSync('../prisma/schema.prisma', 'utf8');
const schema2 = fs.readFileSync('./lovable_schema_raw.prisma', 'utf8');

const extractModel = (schema: string, modelName: string) => {
  const match = schema.match(new RegExp(`model ${modelName} \\{[^}]+\\}`));
  return match ? match[0] : `Model ${modelName} not found`;
};

console.log('--- schema.prisma ---');
console.log(extractModel(schema1, 'Wallets'));
console.log(extractModel(schema1, 'LedgerTransactions'));

console.log('\n--- lovable_schema.prisma ---');
console.log(extractModel(schema2, 'Wallets'));
console.log(extractModel(schema2, 'LedgerTransactions'));
