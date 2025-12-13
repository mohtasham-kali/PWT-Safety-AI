export enum PermitStatus {
  DRAFT = 'Draft',
  PENDING_REVIEW = 'Pending Review',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  ACTIVE = 'Active',
  CLOSED = 'Closed',
  SUSPENDED = 'Suspended'
}

export enum Severity {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface PermitData {
  id: string;
  createdAt: string;
  submittedBy: string;
  location: string;
  description: string;
  
  // AI Generated Fields
  permitType: string;
  summary: string;
  steps: string[];
  hazards: string[];
  requiredControls: string[];
  recommendedPPE: string[];
  preChecks: string[];
  suggestedSeverity: Severity;
  
  // Compliance Check
  complianceCheck?: ComplianceResult;
  
  status: PermitStatus;
  supervisorNotes?: string;
}

export interface ComplianceResult {
  isConsistent: boolean;
  issues: { issue: string; severity: Severity }[];
  autoFixSuggestions: string[];
  approvalRecommendation: 'Approve' | 'Require changes' | 'Reject';
}

export interface PermitDraft {
  description: string;
  location: string;
  submittedBy: string;
}