import { X, UserCheck, Briefcase, Home, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentRegisterDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgentRegisterDialog({ isOpen, onClose }: AgentRegisterDialogProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const registrationOptions = [
    {
      id: 'tenant',
      title: 'Tenant',
      description: 'Register a new tenant for a property',
      icon: <UserCheck size={24} />,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      action: () => {
        onClose();
        navigate('/agent-register-tenant');
      }
    },
    {
      id: 'sub-agent',
      title: 'Sub-Agent',
      description: 'Onboard a new agent under your network',
      icon: <Briefcase size={24} />,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      action: () => {
        onClose();
        navigate('/agent-register-subagent');
      }
    },
    {
      id: 'landlord',
      title: 'Landlord',
      description: 'Register a property owner',
      icon: <Home size={24} />,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      action: () => {
        onClose();
        navigate('/agent-register-landlord');
      }
    },
    {
      id: 'investor',
      title: 'Invest for a Partner',
      description: 'Initiate investment on behalf of a partner',
      icon: <TrendingUp size={24} />,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
      action: () => {
        onClose();
        navigate('/agent-register-investor');
      }
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        
        {/* Dialog Content */}
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Register User</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Select the type of user to register</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-3">
            {registrationOptions.map((option) => (
              <button
                key={option.id}
                onClick={option.action}
                className="w-full flex items-center p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-[#6d28d9]/50 rounded-2xl group transition-all text-left shadow-sm hover:shadow-md"
              >
                <div className={`size-12 rounded-xl flex items-center justify-center mr-4 ${option.color}`}>
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[#6d28d9] transition-colors">
                    {option.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {option.description}
                  </p>
                </div>
                <div className="ml-2 text-slate-300 group-hover:text-[#6d28d9] transition-colors">
                  <ChevronRight size={20} />
                </div>
              </button>
            ))}
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
