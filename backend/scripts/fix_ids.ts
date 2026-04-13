import fs from 'fs';

let schema = fs.readFileSync('../prisma/schema.prisma', 'utf8');
const models = schema.split(/^model /m);

for (let i = 1; i < models.length; i++) {
  const model = models[i];
  if (!model.includes('@id') && !model.includes('@@id') && !model.includes('@unique') && !model.includes('@@unique')) {
     const lastBraceIndex = model.lastIndexOf('}');
     if (lastBraceIndex !== -1) {
       models[i] = model.substring(0, lastBraceIndex) + '  @@ignore\n}' + model.substring(lastBraceIndex + 1);
     }
  }
}

fs.writeFileSync('../prisma/schema.prisma', models.join('model '));
console.log('Fixed missing IDs');
