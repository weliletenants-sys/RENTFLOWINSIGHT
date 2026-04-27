import { UserPlus, Users, BarChart3, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ToolItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function ToolItem({ icon, label, onClick }: ToolItemProps) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-xl border border-primary/5 shadow-sm hover:border-primary/30 transition-all group"
    >
      <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );
}

interface AgentToolsGridProps {
  onNewClientClick?: () => void;
}

export default function AgentToolsGrid({ onNewClientClick }: AgentToolsGridProps) {
  const navigate = useNavigate();
  return (
    <section className="px-4 py-6">
      <h3 className="text-lg font-bold mb-4 px-1">Agent Tools</h3>
      <div className="grid grid-cols-2 gap-4">
        
        <ToolItem 
          icon={<UserPlus size={24} />} 
          label="New Client" 
          onClick={onNewClientClick || (() => console.log('New Client Clicked'))}
        />
        
        <ToolItem 
          icon={<Users size={24} />} 
          label="Sub Agents" 
          onClick={() => navigate('/dashboard/agent/sub-agents')}
        />
        
        <ToolItem 
          icon={<BarChart3 size={24} />} 
          label="Reports" 
          onClick={() => console.log('Reports Clicked')}
        />
        
        <ToolItem 
          icon={<HelpCircle size={24} />} 
          label="Support" 
          onClick={() => console.log('Support Clicked')}
        />
        
      </div>
    </section>
  );
}
