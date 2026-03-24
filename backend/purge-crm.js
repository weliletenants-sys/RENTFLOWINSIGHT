const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../frontend/src/admin/crm');
const mockFile = path.join(srcDir, 'data/mockNotifications.ts');
const typesFile = path.join(srcDir, 'types.ts');
const dashboardPath = path.join(srcDir, 'CrmDashboard.tsx');
const dataTablePath = path.join(srcDir, 'components/CrmDataTable.tsx');
const kpiGridPath = path.join(srcDir, 'components/CrmKpiGrid.tsx');

// 1. Create types.ts
const typesContent = `export interface NotificationItem {
  id: string;
  user_id: string;
  user_name: string;
  subject: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
`;
fs.writeFileSync(typesFile, typesContent, 'utf8');

// 2. Delete mock file completely
if (fs.existsSync(mockFile)) {
  fs.unlinkSync(mockFile);
}

// 3. Rewrite components to use types.ts instead of mock array
let dtContent = fs.readFileSync(dataTablePath, 'utf8');
dtContent = dtContent.replace(/import type \{ NotificationItem \} from '\.\.\/data\/mockNotifications';/g, "import type { NotificationItem } from '../types';");
fs.writeFileSync(dataTablePath, dtContent, 'utf8');

let kpiContent = fs.readFileSync(kpiGridPath, 'utf8');
kpiContent = kpiContent.replace(/import type \{ NotificationItem \} from '\.\.\/data\/mockNotifications';/g, "import type { NotificationItem } from '../types';");
fs.writeFileSync(kpiGridPath, kpiContent, 'utf8');

// 4. Rewrite standard dashboard
let dashContent = fs.readFileSync(dashboardPath, 'utf8');
dashContent = dashContent.replace(/import \{ mockNotifications \} from '\.\/data\/mockNotifications';/g, "import type { NotificationItem } from './types';\nimport { useEffect } from 'react';\nimport axios from 'axios';");

dashContent = dashContent.replace(/const \[activeTab, setActiveTab\] = useState\('triage'\);/g, `const [activeTab, setActiveTab] = useState('triage');
  const [liveNotifications, setLiveNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await axios.get('/api/crm/tickets');
        setLiveNotifications(data.tickets || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTickets();
  }, []);`);

dashContent = dashContent.replace(/mockNotifications\.filter/g, 'liveNotifications.filter');
dashContent = dashContent.replace(/notifications={mockNotifications}/g, 'notifications={liveNotifications}');

fs.writeFileSync(dashboardPath, dashContent, 'utf8');
console.log("CRM Dashboard UI successfully re-engineered to live API!");
