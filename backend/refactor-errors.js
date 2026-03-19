const fs = require('fs');
const path = require('path');

const utilsDir = path.join(__dirname, 'src', 'utils');
if (!fs.existsSync(utilsDir)) fs.mkdirSync(utilsDir, { recursive: true });

const problemTsPath = path.join(utilsDir, 'problem.ts');
const problemContent = `import { Response } from 'express';\n\nexport const problemResponse = (res: Response, status: number, title: string, detail: string, type: string) => {\n  return res.status(status).json({\n    type: 'about:blank',\n    title,\n    status,\n    detail,\n    instance: type\n  });\n};\n`;
fs.writeFileSync(problemTsPath, problemContent);

const controllersDir = path.join(__dirname, 'src', 'controllers');
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.controller.ts'));

files.forEach(file => {
    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Erase inline definition securely if it exists
    if (content.includes('const problemResponse = (res: Response')) {
        content = content.replace(/const problemResponse = [\s\S]*?};(\r?\n)+/, '');
        changed = true;
    }

    if (!content.includes('import { problemResponse }')) {
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const endOfLastImport = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLastImport) + "\nimport { problemResponse } from '../utils/problem';" + content.slice(endOfLastImport);
            changed = true;
        } else {
             content = "import { problemResponse } from '../utils/problem';\n" + content;
             changed = true;
        }
    }

    const regex = /res\.status\((\d+)\)\.json\(\{\s*(?:message|error):\s*['"\`](.*?)['"\`]\s*\}\)/g;
    
    if (regex.test(content)) {
        content = content.replace(regex, (match, status, message) => {
            let title = 'Error';
            if (status === '400') title = 'Validation Error';
            else if (status === '401') title = 'Unauthorized';
            else if (status === '403') title = 'Forbidden';
            else if (status === '404') title = 'Not Found';
            else if (status === '500') title = 'Internal Server Error';
            else if (status === '409') title = 'Conflict';
            
            const type = title.toLowerCase().replace(/\s+/g, '-');
            return `problemResponse(res, ${status}, '${title}', \`${message}\`, '${type}')`;
        });
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Refactored RFC 7807 responses in ${file}`);
    }
});
