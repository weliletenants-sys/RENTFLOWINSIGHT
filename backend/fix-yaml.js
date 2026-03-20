const fs = require('fs');

let content = fs.readFileSync('openapi.yaml', 'utf8');
const appendStart = content.indexOf('  /api/auth/registrations:');

if (appendStart > -1) {
   const block = content.slice(appendStart);
   content = content.slice(0, appendStart); // remove block from end
   
   // Inject it perfectly right before the components node
   const compMatch = content.match(/\r?\ncomponents:/);
   if (compMatch) {
       const before = content.slice(0, compMatch.index);
       const after = content.slice(compMatch.index);
       content = before + '\n' + block + after;
   }
   
   fs.writeFileSync('openapi.yaml', content);
   console.log('Successfully realigned OpenAPI schema block!');
} else {
   console.log('Could not find injection block');
}
