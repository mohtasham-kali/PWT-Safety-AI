import React, { useState } from 'react';
import { Mic, Send, Sparkles, AlertTriangle, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { generatePermitDetails, checkCompliance } from '../services/geminiService';
import { usePermits } from '../store/PermitContext';
import { PermitStatus, Severity } from '../types';

interface CreatePermitProps {
  onSuccess: () => void;
}

const CreatePermit: React.FC<CreatePermitProps> = ({ onSuccess }) => {
  const { addPermit } = usePermits();
  
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    submittedBy: 'Current User'
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stage, setStage] = useState<'input' | 'review'>('input');
  const [aiResult, setAiResult] = useState<any>(null);
  const [complianceResult, setComplianceResult] = useState<any>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.location) return;

    setIsAnalyzing(true);
    try {
      // Step 1: Authoring Agent
      const permitDetails = await generatePermitDetails(formData.description, formData.location);
      setAiResult(permitDetails);
      
      // Step 2: Compliance Agent (chained immediately for this UX)
      const compliance = await checkCompliance(permitDetails);
      setComplianceResult({
        ...compliance,
      });
      
      setStage('review');
    } catch (err) {
      console.error(err);
      alert('Failed to analyze permit. Please check your API key and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmitPermit = () => {
    if (!aiResult || !complianceResult) return;

    const newPermit = {
      id: `PTW-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      submittedBy: formData.submittedBy,
      location: formData.location,
      description: formData.description,
      
      permitType: aiResult.permit_type,
      summary: aiResult.summary,
      steps: aiResult.steps,
      hazards: aiResult.hazards,
      requiredControls: aiResult.required_controls,
      recommendedPPE: aiResult.recommended_ppe,
      preChecks: aiResult.pre_checks,
      suggestedSeverity: aiResult.suggested_severity === 'High' ? Severity.HIGH : aiResult.suggested_severity === 'Medium' ? Severity.MEDIUM : Severity.LOW,
      
      complianceCheck: {
        isConsistent: complianceResult.is_consistent,
        issues: complianceResult.issues.map((i: any) => ({
          issue: i.issue,
          severity: i.severity === 'High' ? Severity.HIGH : i.severity === 'Medium' ? Severity.MEDIUM : Severity.LOW
        })),
        autoFixSuggestions: complianceResult.auto_fix_suggestions,
        approvalRecommendation: complianceResult.approval_recommendation
      },
      
      status: PermitStatus.PENDING_REVIEW
    };

    addPermit(newPermit);
    onSuccess();
  };

  if (stage === 'review' && aiResult && complianceResult) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="p-6 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Review & Submit Permit</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">AI has analyzed your request.</p>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
              aiResult.suggested_severity === 'High' ? 'bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400' : 
              aiResult.suggested_severity === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' : 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
            }`}>
              {aiResult.suggested_severity} Risk
            </div>
          </div>
          
          <div className="p-6 grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Details</h3>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2">
                  <p className="dark:text-slate-200"><span className="font-medium">Type:</span> {aiResult.permit_type}</p>
                  <p className="dark:text-slate-200"><span className="font-medium">Location:</span> {formData.location}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{aiResult.summary}"</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Identified Hazards</h3>
                <ul className="space-y-2">
                  {aiResult.hazards.map((h: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <AlertTriangle className="w-4 h-4 text-orange-500 mt-1 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Required Controls</h3>
                <ul className="space-y-2">
                  {aiResult.required_controls.map((c: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {complianceResult.issues.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-lg p-4">
                  <h3 className="font-semibold text-orange-800 dark:text-orange-400 mb-2 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> Compliance Notices
                  </h3>
                  <ul className="list-disc list-inside text-sm text-orange-700 dark:text-orange-300 space-y-1">
                    {complianceResult.issues.map((issue: any, i: number) => (
                      <li key={i}>{issue.issue} <span className="text-xs font-bold opacity-75">({issue.severity})</span></li>
                    ))}
                  </ul>
                  {complianceResult.auto_fix_suggestions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-500/20">
                      <p className="text-xs font-semibold text-orange-800 dark:text-orange-400 mb-1">Suggestions:</p>
                      <ul className="text-xs text-orange-700 dark:text-orange-300 space-y-1">
                         {complianceResult.auto_fix_suggestions.map((fix: string, i: number) => (
                           <li key={i}>• {fix}</li>
                         ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button 
              onClick={() => setStage('input')}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors"
            >
              Back to Edit
            </button>
            <button 
              onClick={handleSubmitPermit}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-all flex items-center gap-2"
            >
              Submit for Approval <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create New Permit</h2>
          <p className="text-slate-500 dark:text-slate-400">Describe the work naturally. Our AI agents will structure the permit and check for compliance.</p>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Work Location</label>
            <input
              type="text"
              required
              placeholder="e.g. Tank Farm B, Unit 4"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-600 outline-none transition-all"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Work Description</label>
              <button type="button" className="text-xs text-emerald-600 dark:text-emerald-500 font-medium flex items-center gap-1 hover:text-emerald-700 dark:hover:text-emerald-400">
                <Mic className="w-3 h-3" /> Voice Input (Demo)
              </button>
            </div>
            <textarea
              required
              placeholder="Describe the job, tools used, and workers involved. E.g. 'We need to weld a bracket on the support beam in the warehouse. 2 workers, using arc welder and grinder.'"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:border-emerald-500 dark:focus:border-emerald-600 outline-none min-h-[160px] resize-y transition-all"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isAnalyzing}
              className="w-full py-4 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl font-semibold shadow-lg shadow-slate-900/10 dark:shadow-none transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Analyzing Safety Risks...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Permit with AI
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePermit;
