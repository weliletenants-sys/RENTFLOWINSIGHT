const fs = require('fs');
const path = require('path');

const modules = [
  'auth', 'tenant', 'funder', 'cfo', 'supporter',
  'roles', 'wallets', 'applications', 'rent-requests', 'upload'
];

const backendDir = __dirname;
const routesDir = path.join(backendDir, 'src', 'routes');
const apiDir = path.join(backendDir, 'src', 'api');
const indexFile = path.join(apiDir, 'index.ts');

modules.forEach(mod => {
  const targetDir = path.join(apiDir, mod);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const sourcePath = path.join(routesDir, `${mod}.routes.ts`);
  const targetPath = path.join(targetDir, `${mod}.routes.ts`);
  
  if (fs.existsSync(sourcePath)) {
    fs.renameSync(sourcePath, targetPath);
    console.log(`Moved ${mod}.routes.ts`);
  }

  if (fs.existsSync(targetPath)) {
    let content = fs.readFileSync(targetPath, 'utf8');
    // Replace relative paths going up one dir to going up two dirs
    content = content.replace(/from '\.\.\//g, "from '../../");
    content = content.replace(/from "\.\.\//g, 'from "../../');
    fs.writeFileSync(targetPath, content);
    console.log(`Updated imports in ${mod}.routes.ts`);
  }
});

// Update index.ts to reflect the new modular structure rather than the old /routes folder
if (fs.existsSync(indexFile)) {
  let indexContent = fs.readFileSync(indexFile, 'utf8');
  modules.forEach(mod => {
    const regex = new RegExp(`from '\\.\\./routes/${mod}\\.routes';`, 'g');
    indexContent = indexContent.replace(regex, `from './${mod}/${mod}.routes';`);
  });
  fs.writeFileSync(indexFile, indexContent);
  console.log('Updated index.ts imports');
}
