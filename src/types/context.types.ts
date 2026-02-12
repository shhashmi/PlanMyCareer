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
  priority?: number; // 1-10, lower = higher importance for the role
}

export interface AssessmentResult {
  skillName: string;
  score: number;
  level: string;
  [key: string]: any;
}

// LocalStorage setter type - accepts value, updater function, or null to clear
type LocalStorageSetter<T> = (value: T | ((prev: T) => T) | null) => void;

export interface AppContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  profileData: ProfileData | null;
  setProfileData: LocalStorageSetter<ProfileData | null>;
  skills: Skill[];
  setSkills: LocalStorageSetter<Skill[]>;
  assessmentResults: AssessmentResult[] | null;
  setAssessmentResults: LocalStorageSetter<AssessmentResult[] | null>;
  advancedResults: any;
  setAdvancedResults: LocalStorageSetter<any>;
  advancedSessionId: number | null;
  setAdvancedSessionId: LocalStorageSetter<number | null>;
  upskillPlan: any;
  setUpskillPlan: LocalStorageSetter<any>;
  apiProfile: FluencyProfileResponse | null;
  setApiProfile: LocalStorageSetter<FluencyProfileResponse | null>;
  incompleteAssessment: IncompleteAssessmentSession | null;
  setIncompleteAssessment: LocalStorageSetter<IncompleteAssessmentSession | null>;
  roles: Role[];
  rolesLoading: boolean;
  isPaid: boolean;
  refreshPaidStatus: () => Promise<void>;
}
