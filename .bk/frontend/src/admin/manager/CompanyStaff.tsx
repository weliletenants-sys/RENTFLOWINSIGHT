import { Users } from 'lucide-react';
import UserProfilesTable from './components/UserProfilesTable';

export default function CompanyStaff() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-inter">
      {/* Header Scope */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          <Users className="text-blue-600" size={32} />
          Company Staff
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Global access control center. Dictate RBAC boundaries, manage profiles, and promote standard users to agents or managers securely.
        </p>
      </div>

      <div className="mt-8">
        <UserProfilesTable />
      </div>

    </div>
  );
}
