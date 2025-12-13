import React from 'react';
import { usePermits } from '../store/PermitContext';
import { PermitStatus, Severity } from '../types';
import { Clock, CheckCircle2, AlertOctagon, MoreHorizontal, ChevronRight, Search } from 'lucide-react';

interface DashboardProps {
  onSelectPermit: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectPermit }) => {
  const { permits } = usePermits();
  
  const getStatusColor = (status: PermitStatus) => {
    switch (status) {
      case PermitStatus.APPROVED: return 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
      case PermitStatus.PENDING_REVIEW: return 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
      case PermitStatus.REJECTED: return 'text-red-700 bg-red-50 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20';
      case PermitStatus.SUSPENDED: return 'text-slate-700 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
      default: return 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const pendingCount = permits.filter(p => p.status === PermitStatus.PENDING_REVIEW).length;
  const activeCount = permits.filter(p => p.status === PermitStatus.ACTIVE || p.status === PermitStatus.APPROVED).length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Pending Approval</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{pendingCount}</h3>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg text-amber-600 dark:text-amber-500">
            <Clock className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Active Permits</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{activeCount}</h3>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between transition-colors">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Critical Issues</p>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">0</h3>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-lg text-red-600 dark:text-red-500">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search permits by ID, location, or type..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 outline-none transition-colors"
          />
        </div>
        <select className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-colors">
          <option>All Statuses</option>
          <option>Pending Review</option>
          <option>Active</option>
          <option>Closed</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Work Summary</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Severity</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {permits.map((permit) => (
              <tr 
                key={permit.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                onClick={() => onSelectPermit(permit.id)}
              >
                <td className="px-6 py-4 font-mono text-sm text-slate-500 dark:text-slate-400">{permit.id}</td>
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900 dark:text-slate-200">{permit.summary}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{permit.location} • {new Date(permit.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                    {permit.permitType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    permit.suggestedSeverity === Severity.HIGH ? 'bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400' :
                    permit.suggestedSeverity === Severity.MEDIUM ? 'bg-orange-100 dark:bg-orange-500/10 text-orange-800 dark:text-orange-400' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {permit.suggestedSeverity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getStatusColor(permit.status)}`}>
                    {permit.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <ChevronRight className="w-5 h-5 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {permits.length === 0 && (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400">
            No permits found. Create one to get started.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
