const fs = require('fs');

const schemaPath = 'prisma/schema.prisma';
let content = fs.readFileSync(schemaPath, 'utf8');

// 1. Remove dangling "String @id" lines which are invalid
content = content.replace(/^\s*String\s+@id\s*$/gm, '');

// 2. Add url = env("DATABASE_URL") to datasource block if missing
const datasourceRegex = /datasource db {[\s\S]*?}/;
const datasourceMatch = content.match(datasourceRegex);
if (datasourceMatch && !datasourceMatch[0].includes('url')) {
  content = content.replace(
    datasourceMatch[0],
    `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}`
  );
}

// 3. Inject missing primary keys: if a model doesn't have `@id` inside, add `id String @id @default(uuid())`
content = content.replace(/model\s+(\w+)\s*{([^}]*)}/g, (match, modelName, body) => {
  if (!body.includes('@id') && !body.includes('@@id')) {
    // Inject the ID at the top of the body
    const newBody = `\n  id String @id @default(uuid())` + body;
    return `model ${modelName} {${newBody}}`;
  }
  return match;
});

fs.writeFileSync(schemaPath, content, 'utf8');
console.log('Schema sanitized and IDs injected successfully.');
