import React, { useState } from 'react';
import { useHREmployees } from './hooks/useHRQueries';
import { ExecutiveDashboardLayout } from '../components/layout/ExecutiveDashboardLayout';

export default function HREmployeeDirectory() {
  const { data: employees, isLoading } = useHREmployees();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees?.filter((emp: any) => 
    emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <ExecutiveDashboardLayout role="hr" title="Employee Directory">
      <div className="p-4 md:p-8 w-full max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employee Directory</h1>
            <p className="text-muted-foreground mt-1">Search and manage all internal staff profiles.</p>
          </div>
          <div className="w-full md:w-72">
            <input 
              type="text" 
              placeholder="Search by dept or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse mt-8">
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
            <div className="h-32 bg-muted rounded-xl"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredEmployees.map((emp: any) => (
              <div key={emp.id} className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
                    {emp.department?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{emp.position || 'Staff'}</h3>
                    <p className="text-sm text-muted-foreground">{emp.department || 'Unassigned'}</p>
                    <p className="text-xs text-muted-foreground mt-2 font-mono bg-muted/50 inline-block px-2 py-0.5 rounded">
                      ID: {emp.user_id?.substring(0, 8)}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/30 p-3 border-t text-sm font-medium text-center text-primary cursor-pointer hover:bg-muted/50 transition-colors">
                  View Full Profile
                </div>
              </div>
            ))}
            
            {filteredEmployees.length === 0 && (
               <div className="col-span-full pt-12 pb-12 text-center border-2 border-dashed rounded-xl">
                 <p className="text-muted-foreground">No employees found matching your search.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </ExecutiveDashboardLayout>
  );
}
