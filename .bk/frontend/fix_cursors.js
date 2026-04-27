import fs from 'fs';
const f = 'src/funder/FunderAccountSettings.tsx';
let txt = fs.readFileSync(f, 'utf8');

// Replace all buttons without cursor-pointer to have it
txt = txt.replace(/<button([\s\S]*?)className="([^"]*)"/g, (match, p1, p2) => {
  if (p2.includes('cursor-pointer') || p2.includes('cursor-not-allowed')) return match;
  return `<button${p1}className="cursor-pointer ${p2}"`;
});

// Also replace the navigation tabs
txt = txt.replace(/\{ id: 'security', label: 'Security & Auth'/g, "className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}\n                        onClick={() => setActiveTab(tab.id as any)}\n                      >\n/* REPLACE_ME */{ id: 'security', label: 'Security & Auth'");

txt = txt.replace(/className=\{\`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap \$\{[\s\S]*?\}\`\}/g, "className={`cursor-pointer flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}");

// Check mobile money/bank buttons which might not be `<button>` but rather `<div>`? No, they are `<button>`.
// Oh check the specific tabs:
// `<button onClick={() => setEditForm({...editForm, type: 'momo'})} className={`flex-1...`
// Our regex catches `<button ` with `className="` but here `className={` has backticks!

txt = txt.replace(/<button([\s\S]*?)className=\{`([^`]*)`/g, (match, p1, p2) => {
  if (p2.includes('cursor-pointer') || p2.includes('cursor-not-allowed')) return match;
  return `<button${p1}className={\`cursor-pointer ${p2}\``;
});

// Also, let's just make sure "close icons" (like the X) have cursor-pointer. Close icons are usually wrapped in a button. 
// Yes, `<button onClick={() => { setIsAddingAccount(false); setEditingAccountId(null); }} className="text-slate-400 hover:text-slate-600"><X ...`
// This will get caught by the first regex!

fs.writeFileSync(f, txt);
console.log('Fixed cursors');
