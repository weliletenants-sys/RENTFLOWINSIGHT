const fs = require('fs');

let code = fs.readFileSync('c:/Users/USER/Documents/RENTFLOWINSIGHT/backend/src/controllers/cfo.controller.ts', 'utf8');

code = code.replace("prisma.profiles.count({ where: { verified: true, ...createdFilter } })", "prisma.profiles.count({ where: { verified: true } })");
code = code.replace("prisma.userRoles.count({ where: { role: 'AGENT', enabled: true, ...createdFilter } })", "prisma.userRoles.count({ where: { role: 'AGENT', enabled: true } })");
code = code.replace("prisma.userRoles.count({ where: { role: 'TENANT', enabled: true, ...createdFilter } })", "prisma.userRoles.count({ where: { role: 'TENANT', enabled: true } })");
code = code.replace("prisma.userRoles.count({ where: { role: 'FUNDER', enabled: true, ...createdFilter } })", "prisma.userRoles.count({ where: { role: 'FUNDER', enabled: true } })");

fs.writeFileSync('c:/Users/USER/Documents/RENTFLOWINSIGHT/backend/src/controllers/cfo.controller.ts', code);
console.log('Date filters removed from absolute dashboard counts.');
