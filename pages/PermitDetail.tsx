import React, { useState } from 'react';
import { usePermits } from '../store/PermitContext';
import { PermitStatus, Severity } from '../types';
import { ArrowLeft, AlertTriangle, ShieldCheck, CheckCircle2, UserCheck, XCircle, FileText } from 'lucide-react';

interface PermitDetailProps {
  permitId: string;
  onBack: () => void;
}

const PermitDetail: React.FC<PermitDetailProps> = ({ permitId, onBack }) => {
  const { getPermit, updatePermitStatus } = usePermits();
  const permit = getPermit(permitId);
  const [notes, setNotes] = useState('');

  if (!permit) return <div>Permit not found</div>;

  const handleAction = (status: PermitStatus) => {
    updatePermitStatus(permitId, status, notes);
    onBack();
  };

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{permit.permitType} Permit</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-sm mt-1">ID: {permit.id}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                  permit.status === PermitStatus.PENDING_REVIEW ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 
                  permit.status === PermitStatus.APPROVED ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  {permit.status}
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">{permit.description}</p>
              <div className="flex gap-6 mt-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-2"><UserCheck className="w-4 h-4" /> {permit.submittedBy}</span>
                <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> {permit.location}</span>
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> {new Date(permit.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="p-6 space-y-8">
              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Risk Analysis</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" /> Hazards
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {permit.hazards.map((h, i) => <li key={i}>• {h}</li>)}
                    </ul>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Controls
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {permit.requiredControls.map((c, i) => <li key={i}>• {c}</li>)}
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Procedure</h3>
                <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300">
                  {permit.steps.map((step, i) => (
                    <li key={i} className="pl-2">{step}</li>
                  ))}
                </ol>
              </section>

              <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">PPE Required</h3>
                <div className="flex flex-wrap gap-2">
                  {permit.recommendedPPE.map((ppe, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-sm font-medium border border-slate-200 dark:border-slate-700">
                      {ppe}
                    </span>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-6 border border-indigo-100 dark:border-indigo-500/20">
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5" /> AI Compliance Check
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-indigo-800 dark:text-indigo-200">Consistency Check</span>
                {permit.complianceCheck?.isConsistent ? (
                   <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Pass</span>
                ) : (
                   <span className="text-orange-600 dark:text-orange-400 font-bold flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> Issues</span>
                )}
              </div>

              {permit.complianceCheck && permit.complianceCheck.issues.length > 0 && (
                <div className="bg-white/60 dark:bg-slate-900/40 rounded-lg p-3 text-sm text-indigo-900 dark:text-indigo-200">
                  <p className="font-semibold mb-2 text-xs uppercase opacity-70">Flagged Issues:</p>
                  <ul className="space-y-2">
                    {permit.complianceCheck.issues.map((iss, i) => (
                      <li key={i} className="leading-tight">• {iss.issue}</li>
                    ))}
                  </ul>
                </div>
              )}
              
               <div className="pt-2 border-t border-indigo-200 dark:border-indigo-500/20">
                 <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">AI Recommendation:</p>
                 <p className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{permit.complianceCheck?.approvalRecommendation}</p>
               </div>
            </div>
          </div>

          {/* Supervisor Actions */}
          {permit.status === PermitStatus.PENDING_REVIEW && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">Supervisor Action</h3>
              <textarea
                className="w-full p-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg mb-4 text-sm focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 outline-none"
                placeholder="Add notes for approval or rejection..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleAction(PermitStatus.REJECTED)}
                  className="px-4 py-2 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => handleAction(PermitStatus.APPROVED)}
                  className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white/90 rounded-lg font-medium transition-colors flex justify-center items-center gap-2 shadow-lg shadow-slate-900/10 dark:shadow-none"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
              </div>
            </div>
          )}
          
          {permit.status === PermitStatus.APPROVED && (
             <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl p-6 text-center">
               <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
               <h3 className="font-bold text-emerald-900 dark:text-emerald-300">Permit Approved</h3>
               <p className="text-emerald-700 dark:text-emerald-400 text-sm mt-1">Work is authorized to proceed.</p>
               <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-500">
                 Authorized by Supervisor at {new Date().toLocaleTimeString()}
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermitDetail;
