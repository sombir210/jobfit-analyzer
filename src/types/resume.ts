export type JobDomain = 'technical' | 'telecom' | 'other';

export type Suitability = 'suitable' | 'partially_suitable' | 'not_suitable';

export interface RecommendedRole {
  title: string;
  description: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface RoleMatch {
  roleId: string;
  roleTitle: string;
  description: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  requiredSkillsCount: number;
  matchedRequiredCount: number;
}

export interface AnalysisResults {
  matchScore: number;
  suitability: Suitability;
  extractedSkills: string[];
  education: string[];
  experienceYears: number;
  summary: string;
  keyStrengths: string[];
  areasForImprovement: string[];
  missingSkills: string[];
  recommendedRoles: RecommendedRole[];
  allRoleMatches: RoleMatch[];
}

export interface AnalysisResponse {
  success: boolean;
  analysisId?: string;
  results: AnalysisResults;
  error?: string;
}

export const DOMAIN_LABELS: Record<JobDomain, string> = {
  technical: 'Technical (Software / IT)',
  telecom: 'Telecom',
  other: 'Other / Non-Tech',
};

export const SUITABILITY_CONFIG: Record<Suitability, { label: string; color: string; bgColor: string }> = {
  suitable: {
    label: 'Suitable',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  partially_suitable: {
    label: 'Partially Suitable',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  not_suitable: {
    label: 'Not Suitable',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
};