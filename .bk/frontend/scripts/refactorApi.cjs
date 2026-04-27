const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/services');

const files = fs.readdirSync(dir).filter(f => f.endsWith('Api.ts') && f !== 'apiClient.ts' && f !== 'authApi.ts');

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Regex to remove imports of axios
  content = content.replace(/import axios[^{]*from 'axios';?\n?/, '');
  content = content.replace(/import axios, \{ AxiosError \} from 'axios';?\n?/, '');

  // Add apiClient import
  if (!content.includes("import { apiClient }")) {
      content = "import { apiClient } from './apiClient';\n" + content;
  }

  // Remove API const
  content = content.replace(/const API =.*?\n\n?/g, '');

  content = content.replace(/const \w+Client = axios\.create\(\{[^}]*\}\);\n*/g, '');
  content = content.replace(/const \w+Client = axios\.create\([\s\S]*?\);\n*/g, '');
  
  // Remove request interceptors
  content = content.replace(/\w+Client\.interceptors\.request\.use\([\s\S]*?(?=\n\n|\nexport)/g, '');
  
  // Remove response interceptors
  content = content.replace(/\w+Client\.interceptors\.response\.use\([\s\S]*?(?=\n\n|\nexport)/g, '');

  content = content.replace(/\w+Client\./g, 'apiClient.');

  // Optional string updates if baseURL endpoints need fixing. e.g. some used `/v1` or `/api/agent`.
  // Wait, if it has `apiClient` mapping to `/api/v2`, endpoints like `/agent/statistics` become `/api/v2/agent/statistics`
  // That matches the new backend routing exactly!
  // If some endpoints started with `/v1/`, let's remove `/v1` since baseURL handles v2 mapping, or assume they are fully v2 compliant.
  content = content.replace(/apiClient\.(get|post|put|patch|delete)\('\/v[12]\//g, "apiClient.$1('/");

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Successfully refactored files:', files);
