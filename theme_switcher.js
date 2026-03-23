const fs = require('fs');
const path = require('path');

const DIRECTORY = path.join(__dirname, 'frontend/src/admin');
const SUPER_VIEWS_DIR = path.join(DIRECTORY, 'super/views');

const FILES_TO_UPDATE = [
  path.join(DIRECTORY, 'super/AdminLayout.tsx'),
  path.join(SUPER_VIEWS_DIR, 'SystemOverview.tsx'),
  path.join(SUPER_VIEWS_DIR, 'UserMatrix.tsx'),
  path.join(SUPER_VIEWS_DIR, 'RoleIntelligence.tsx'),
  path.join(SUPER_VIEWS_DIR, 'AuditLogs.tsx'),
  path.join(SUPER_VIEWS_DIR, 'IdentityAccess.tsx'),
  path.join(SUPER_VIEWS_DIR, 'GlobalConfig.tsx')
];

const REPLACEMENTS = [
  // Backgrounds: Dark -> Light
  { regex: /bg-\[#131313\]/g, replacement: 'bg-white' }, // Core background
  { regex: /bg-\[#0e0e0e\]/g, replacement: 'bg-slate-50' }, // Low background
  { regex: /bg-\[#1c1b1b\]/g, replacement: 'bg-white' }, // Sidebar
  { regex: /bg-\[#20201f\]/g, replacement: 'bg-white' }, // Cards / Containers
  { regex: /bg-\[#2a2a2a\]/g, replacement: 'bg-slate-50' }, // High background
  { regex: /bg-\[#353535\]/g, replacement: 'bg-slate-100' }, // Highest background
  
  // Text colors
  { regex: /text-\[#e5e2e1\]/g, replacement: 'text-slate-900' }, // Primary text
  { regex: /text-\[#cfc2d7\]/g, replacement: 'text-slate-500' }, // Secondary text
  { regex: /text-\[#988ca0\]/g, replacement: 'text-slate-400' }, // Outline text
  
  // Borders
  { regex: /border-\[#4c4354\]\/10/g, replacement: 'border-slate-200' },
  { regex: /border-\[#4c4354\]\/15/g, replacement: 'border-slate-200' },
  { regex: /border-\[#4c4354\]\/5/g, replacement: 'border-slate-100' },
  { regex: /border-\[#20201f\]/g, replacement: 'border-slate-200' },
  { regex: /border-\[#353535\]/g, replacement: 'border-slate-200' },
  { regex: /border-transparent/g, replacement: 'border-transparent' }, // Ignore

  // The custom Primary Purples to new Primary #9234eb requested by user
  // "Text white where there's purple and purple where there's white"
  // For buttons/solid backgrounds: primary is #9234eb and text inside is white
  
  // Existing dark theme primary was 'bg-[#dcb8ff]' for active nav / small labels 
  // and 'bg-[#9234eb]' with 'text-[#e5e2e1]' for buttons.
  
  // 1. Primary background -> Vibrant Purple (#9234eb)
  // Let's ensure old primary elements use the new scheme.
  { regex: /bg-\[#dcb8ff\]/g, replacement: 'bg-[#9234eb]' }, // Active states
  { regex: /text-\[#dcb8ff\]/g, replacement: 'text-[#9234eb]' }, // Active text
  { regex: /border-\[#dcb8ff\]/g, replacement: 'border-[#9234eb]' }, // Active border
  
  { regex: /bg-\[#9234eb\]\/20/g, replacement: 'bg-[#9234eb]/10' }, // Tint
  { regex: /bg-\[#9234eb\]/g, replacement: 'bg-[#9234eb]' }, // Solid button 
  
  // 2. White where there's purple text?
  // User: "TEXT WHITE WHERE THERE'S PURPLE AND PURPLE WHERE THERE'S WHITE"
  // Meaning buttons that used to be purple with dark text should now be purple with white text.
  // We don't have many direct purple texts on dark, but we have text-[#e5e2e1] inside bg-[#9234eb] which we mapped to text-slate-900 above.
  // Wait! If I map text-[#e5e2e1] -> text-slate-900 globally, then button text becomes dark!
  // I must be careful. Buttons currently have `text-[#e5e2e1]` or similar inside `bg-[#dcb8ff]`.
];

// Execute the replacements
FILES_TO_UPDATE.forEach((filePath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Perform bulk replacement
    REPLACEMENTS.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });

    // Special targeted replacements for the buttons
    // If a button has 'bg-[#9234eb]' and 'text-slate-900', we change it back to 'text-white'
    content = content.replace(/bg-\[#9234eb\](.*?)text-slate-900/g, 'bg-[#9234eb]$1text-white');
    content = content.replace(/bg-white(.*?)text-white/g, 'bg-white$1text-[#9234eb]'); // text purple where there is white?

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  } else {
    console.log(`File not found: ${filePath}`);
  }
});
