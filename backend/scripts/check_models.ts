import fs from 'fs';

const schema1 = fs.readFileSync('../prisma/schema.prisma', 'utf8');
const schema2 = fs.readFileSync('./lovable_schema_raw.prisma', 'utf8');

const getModels = (text: string) => {
  const matches = [...text.matchAll(/model\s+([A-Za-z0-9_]+)\s+{/g)];
  return matches.map(m => m[1]);
};

const models1 = getModels(schema1);
const models2 = getModels(schema2);

const missingInSchema2 = models1.filter(m => !models2.includes(m));
console.log("Models in schema.prisma but NOT in lovable_schema_raw.prisma: ", missingInSchema2);
