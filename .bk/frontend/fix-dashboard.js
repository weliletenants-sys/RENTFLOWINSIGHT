import fs from 'fs';

let content = fs.readFileSync('src/funder/FunderDashboard.tsx', 'utf8');

const importSearch = "import { Lightbulb } from 'lucide-react';";
const importReplace = "import { Lightbulb, Plus, ArrowUp } from 'lucide-react';";
if (content.includes(importSearch)) {
  content = content.replace(importSearch, importReplace);
}

// The lines use CRLF maybe, so we do exact string replace step by step
let lines = content.split(/\r?\n/);
let startIdx = lines.findIndex(l => l.includes('<div className="flex flex-col gap-3">'));
let endIdx = -1;
if (startIdx !== -1) {
  // Find matching closing div for gap-3
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].includes('                  </div>')) {
      endIdx = i;
      break;
    }
  }
}

if (startIdx !== -1 && endIdx !== -1) {
  const newButtons = `                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="group flex items-center gap-3 p-3 border border-slate-100 rounded-lg transition-all text-left hover:border-[var(--color-primary)]"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white"
                        style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                      >
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Add Funds</p>
                        <p className="text-xs text-slate-500">Deposit capital to your wallet</p>
                      </div>
                    </button>
                    <button
                      className="group flex items-center gap-3 p-3 border border-slate-100 rounded-lg transition-all text-left hover:border-[var(--color-primary)]"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center transition-colors group-hover:bg-[var(--color-primary)] group-hover:text-white"
                        style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Withdraw</p>
                        <p className="text-xs text-slate-500">Transfer returns to your account</p>
                      </div>
                    </button>
                  </div>`;
  
  lines.splice(startIdx, endIdx - startIdx + 1, newButtons);
  fs.writeFileSync('src/funder/FunderDashboard.tsx', lines.join('\n'));
  console.log('Replaced wallet buttons.');
} else {
  console.log('Could not find wallet buttons block.');
}
