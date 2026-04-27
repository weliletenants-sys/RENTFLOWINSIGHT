const fs = require('fs');
const path = require('path');

const auditPath = path.join(__dirname, 'src/admin/superadmin/SuperAdminAuditLogs.tsx');
const usersPath = path.join(__dirname, 'src/admin/superadmin/SuperAdminUserManagement.tsx');

// --- AUDIT LOGS ---
let auditContent = fs.readFileSync(auditPath, 'utf8');

// Inject imports
if (!auditContent.includes('import axios')) {
  auditContent = auditContent.replace(
    /import \{ Search, Filter, Download \} from 'lucide-react';/,
    "import { Search, Filter, Download } from 'lucide-react';\nimport { useState, useEffect } from 'react';\nimport axios from 'axios';"
  );
}

// Replace dummy logs array with state 
auditContent = auditContent.replace(
  /const dummyLogs = \[\s*\{ id: '1'.*?\n.*?\n.*?\n\s*\];/,
  `const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/system/audit-logs')
      .then(res => {
        setLogs(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        // Fallback for demo purposes if backend fails
        setLogs([
           { id: '1', created_at: '2026-03-20T14:32:00Z', user_id: 'API-FAIL', actor_role: 'SYSTEM', action_type: 'FETCH_ERROR', target_id: 'API', ip_address: 'localhost' }
        ]);
        setLoading(false);
      });
  }, []);`
);

// Map the keys
auditContent = auditContent.replace(/dummyLogs\.map\(log/g, 'logs.map(log');
auditContent = auditContent.replace(/log\.timestamp/g, "new Date(log.created_at).toLocaleString()");
auditContent = auditContent.replace(/log\.actor/g, "log.user_id");
auditContent = auditContent.replace(/log\.role/g, "log.actor_role");
auditContent = auditContent.replace(/log\.action/g, "log.action_type");
auditContent = auditContent.replace(/log\.target/g, "log.target_id");
auditContent = auditContent.replace(/log\.ip/g, "log.ip_address");

fs.writeFileSync(auditPath, auditContent, 'utf8');

// --- USER MANAGEMENT ---
let usersContent = fs.readFileSync(usersPath, 'utf8');

if (!usersContent.includes('import axios')) {
  usersContent = usersContent.replace(
    /import \{ Search, Filter, MoreVertical, Shield, AlertTriangle, UserCheck, Settings, Download \} from 'lucide-react';/,
    "import { Search, Filter, MoreVertical, Shield, AlertTriangle, UserCheck, Settings, Download } from 'lucide-react';\nimport { useState, useEffect } from 'react';\nimport axios from 'axios';"
  );
}

usersContent = usersContent.replace(
  /const dummyUsers = \[\s*.*?\}?\n\s*\];/ms,
  `const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/identity/users')
      .then(res => {
        setUsers(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        setLogs([
           { id: 'usr_fail', name: 'API Error', email: 'error@welile.com', role: 'UNKNOWN', status: 'Frozen' }
        ]);
        setLoading(false);
      });
  }, []);`
);

usersContent = usersContent.replace(/dummyUsers\.map\(\(user\)/g, 'users.map((user)');

fs.writeFileSync(usersPath, usersContent, 'utf8');

console.log("Successfully purged SuperAdmin mock variables and wired live Axios telemetry!");
