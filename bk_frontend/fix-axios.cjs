const fs = require('fs');
const files = [
  'src/services/cooApi.ts', 
  'src/services/execApi.ts', 
  'src/services/executiveApi.ts', 
  'src/services/funderApi.ts', 
  'src/services/hrApi.ts', 
  'src/services/managerApi.ts', 
  'src/services/rolesApi.ts'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes("import axios")) {
    fs.writeFileSync(f, "import axios from 'axios';\n" + content);
    console.log("Fixed", f);
  }
});
