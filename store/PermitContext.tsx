import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PermitData, PermitStatus, Severity } from '../types';

interface PermitContextType {
  permits: PermitData[];
  addPermit: (permit: PermitData) => void;
  updatePermitStatus: (id: string, status: PermitStatus, notes?: string) => void;
  getPermit: (id: string) => PermitData | undefined;
}

const PermitContext = createContext<PermitContextType | undefined>(undefined);

export const PermitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initial dummy data for demo purposes
  const [permits, setPermits] = useState<PermitData[]>([
    {
      id: 'PTW-1001',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      submittedBy: 'John Doe',
      location: 'Tank Farm B, Unit 4',
      description: 'Repairing a leak on the condensate line. Requires welding.',
      permitType: 'Hot Work',
      summary: 'Welding repair on condensate line at Tank Farm B.',
      steps: ['Isolate line', 'Drain residue', 'Gas test', 'Weld patch', 'Inspect'],
      hazards: ['Fire/Explosion', 'Hot surfaces', 'UV radiation'],
      requiredControls: ['Fire watch', 'Hot work permit', 'Screens/Barricades', 'Gas detector'],
      recommendedPPE: ['Welding helmet', 'Leather gloves', 'FR Coveralls'],
      preChecks: ['Area cleared of combustibles', 'Extinguisher present'],
      suggestedSeverity: Severity.HIGH,
      status: PermitStatus.APPROVED,
      complianceCheck: {
        isConsistent: true,
        issues: [],
        autoFixSuggestions: [],
        approvalRecommendation: 'Approve'
      }
    }
  ]);

  const addPermit = (permit: PermitData) => {
    setPermits((prev) => [permit, ...prev]);
  };

  const updatePermitStatus = (id: string, status: PermitStatus, notes?: string) => {
    setPermits((prev) => prev.map(p => {
      if (p.id === id) {
        return { ...p, status, supervisorNotes: notes };
      }
      return p;
    }));
  };

  const getPermit = (id: string) => permits.find(p => p.id === id);

  return (
    <PermitContext.Provider value={{ permits, addPermit, updatePermitStatus, getPermit }}>
      {children}
    </PermitContext.Provider>
  );
};

export const usePermits = () => {
  const context = useContext(PermitContext);
  if (!context) {
    throw new Error('usePermits must be used within a PermitProvider');
  }
  return context;
};
