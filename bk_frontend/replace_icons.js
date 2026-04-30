import fs from 'fs';
let content = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');

content = content.replace('import { UserPlus, UserCheck, Rocket, Zap, CalendarDays, LineChart, ShieldCheck } from \'lucide-react\';', 'import { UserPlus, UserCheck, Rocket, Zap, CalendarDays, LineChart, ShieldCheck, Home, Users, CreditCard } from \'lucide-react\';');
content = content.replace('<span className="material-symbols-outlined text-violet-300">home</span>', '<Home className="text-violet-500 w-6 h-6" />');
content = content.replace('<span className="material-symbols-outlined text-violet-300">group</span>', '<Users className="text-violet-500 w-6 h-6" />');
content = content.replace('<span className="material-symbols-outlined text-violet-300">payments</span>', '<CreditCard className="text-violet-500 w-6 h-6" />');

fs.writeFileSync('src/pages/LandingPage.tsx', content, 'utf8');
