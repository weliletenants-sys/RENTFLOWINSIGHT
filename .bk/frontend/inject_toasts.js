import fs from 'fs';

const file = 'src/funder/FunderAccountSettings.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. Import
txt = txt.replace(/import \{ useState \} from 'react';/, "import { useState } from 'react';\nimport toast from 'react-hot-toast';");

// 2. Avatar
txt = txt.replace(
  /reader\.onload = \(e\) => setAvatarPreview\(e\.target\?\.result as string\);/,
  "reader.onload = (e) => { setAvatarPreview(e.target?.result as string); toast.success('Profile photo updated successfully!'); };"
);

// 3. Alerts
txt = txt.replace(
  /alert\("Mobile money number must be exactly 10 digits starting with 0 \(e\.g\., 077\.\.\., 070\.\.\.\)\. Do not use \+256\."\);/,
  "toast.error('Mobile money number must be exactly 10 digits starting with 0. Do not use +256.');"
);

// 4. State updates
txt = txt.replace(/setEditingAccountId\(null\);/g, "setEditingAccountId(null); toast.success('Account details updated!');");
txt = txt.replace(/setIsAddingAccount\(false\);/g, "setIsAddingAccount(false); toast.success('New withdrawal account added!');");
txt = txt.replace(/setAccountToDelete\(null\);/g, "setAccountToDelete(null); toast.success('Withdrawal method removed securely!');");

// 5. Save Profile
txt = txt.replace(
  /<button className="w-full mt-4 cursor-pointer bg-slate-900 text-white font-bold py-3\.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md text-sm">/,
  '<button onClick={() => toast.success("Personal profile saved successfully!")} className="w-full mt-4 cursor-pointer bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md text-sm">'
);

// 6. Change Password
txt = txt.replace(
  /<button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-sm text-sm">/,
  '<button onClick={(e) => { e.preventDefault(); if(newPassword.length < 8) { toast.error("Password does not meet criteria"); return; } toast.success("Password updated securely!"); setNewPassword(""); }} className="cursor-pointer w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-sm text-sm">'
);

// 7. Freeze Wallet
txt = txt.replace(
  /<button className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap">/,
  '<button onClick={() => toast.success("Wallet operations immediately frozen!")} className="cursor-pointer flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-colors whitespace-nowrap">'
);

fs.writeFileSync(file, txt);
console.log('Toasts applied.');
