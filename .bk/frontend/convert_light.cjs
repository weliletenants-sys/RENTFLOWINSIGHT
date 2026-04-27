const fs = require('fs');
let code = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');

// 1. General Background
code = code.replace('bg-gradient-mesh bg-[#020617] text-[#F8FAFC]', 'bg-[#ffffff] text-slate-900');

// 2. Text Colors
code = code.replace(/text-white/g, 'text-slate-900');
code = code.replace(/text-slate-300/g, 'text-slate-600');
code = code.replace(/text-slate-400/g, 'text-slate-500');

// 3. Card Backgrounds
code = code.replace(/bg-white\/5/g, 'bg-white shadow-sm border-slate-200');
code = code.replace(/bg-white\/10/g, 'bg-slate-50 border-slate-200');
code = code.replace(/bg-white\/20/g, 'bg-slate-100 border-slate-200');
code = code.replace(/bg-white\/\[0\.02\]/g, 'bg-slate-50');

// 4. Borders
code = code.replace(/border-white\/[0-9]+/g, 'border-slate-200');

// 5. Dark Backgrounds
code = code.replace(/bg-black/g, 'bg-slate-50');
code = code.replace(/bg-\[#0F172A\]/g, 'bg-white');
code = code.replace(/bg-slate-900/g, 'bg-white');
code = code.replace(/bg-slate-800/g, 'bg-slate-100');

// 6. Buttons
code = code.replace(/bg-white text-\[#0A192F\]/g, 'bg-[#6d28d9] text-white');
// Since text-white was already replaced with text-slate-900, we find the old Outlined button:
code = code.replace(/border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-white/g, 'border-[#6d28d9] text-[#6d28d9] font-bold rounded-xl hover:bg-slate-50');

// 7. Navbar - fix the text colors because it has a purple background!
// The navbar text became text-slate-900. Let's fix it back.
// Find the nav block and replace inside it
const navStart = code.indexOf('<nav');
const navEnd = code.indexOf('</nav>') + 6;
if (navStart !== -1 && navEnd !== -1) {
    let navCode = code.substring(navStart, navEnd);
    navCode = navCode.replace(/text-slate-900/g, 'text-white');
    navCode = navCode.replace(/text-slate-600/g, 'text-slate-200'); 
    navCode = navCode.replace(/bg-\[#6d28d9\] text-white/g, 'bg-white text-[#6d28d9]'); // Fix "Sign Up" button inside nav back to white
    code = code.substring(0, navStart) + navCode + code.substring(navEnd);
}

// 8. Footer - make it look good in light mode
const footerStart = code.indexOf('<footer');
const footerEnd = code.indexOf('</footer>') + 9;
if (footerStart !== -1 && footerEnd !== -1) {
    let footerCode = code.substring(footerStart, footerEnd);
    // Footer is bg-slate-50 now. Let's make text dark.
    footerCode = footerCode.replace(/text-white/g, 'text-slate-900');
    footerCode = footerCode.replace(/text-slate-500/g, 'text-slate-600');
    code = code.substring(0, footerStart) + footerCode + code.substring(footerEnd);
}

fs.writeFileSync('src/pages/LandingPage.tsx', code);
console.log('Conversion to light mode complete.');
