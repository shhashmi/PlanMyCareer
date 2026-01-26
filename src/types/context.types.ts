/**
 * Context Type Definitions
 * Types for application state management
 */

import { FluencyProfileResponse, IncompleteAssessmentCheckResponse, Role } from './api.types';

// Session summary from incomplete assessment check (without questions)
export type IncompleteAssessmentSession = NonNullable<IncompleteAssessmentCheckResponse['session']>;

export interface User {
  email: string;
  name?: string;
  [key: string]: any;
}

export interface ProfileData {
  experience: string;
  role: string;
  company: string;
  country: string;
  company_type?: string;
  geography?: string;
  goal?: string;
}

export interface Skill {
  name: string;
  level: string;
  description: string;
}

export interface AssessmentResult {
  skillName: string;
  score: number;
  level: string;
  [key: string]: any;
}

export interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  profileData: ProfileData | null;
  setProfileData: (data: ProfileData | null) => void;
  skills: Skill[];
  setSkills: (skills: Skill[]) => void;
  assessmentResults: AssessmentResult[] | null;
  setAssessmentResults: (results: AssessmentResult[] | null) => void;
  advancedResults: any;
  setAdvancedResults: (results: any) => void;
  upskillPlan: any;
  setUpskillPlan: (plan: any) => void;
  apiProfile: FluencyProfileResponse | null;
  setApiProfile: (profile: FluencyProfileResponse | null) => void;
  incompleteAssessment: IncompleteAssessmentSession | null;
  setIncompleteAssessment: (assessment: IncompleteAssessmentSession | null) => void;
  roles: Role[];
  rolesLoading: boolean;
}
