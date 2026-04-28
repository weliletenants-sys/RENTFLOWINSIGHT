const fs = require('fs');
let f = fs.readFileSync('funder-onboarding-standalone.html', 'utf8');
f = f.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*/g, '');
fs.writeFileSync('funder-onboarding-standalone.html', f);
console.log('Done');
