/**
 * API Type Definitions
 * Central type definitions for all API integrations
 */

// Proficiency levels
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

// Skill dimension from API
export interface SkillDimension {
  dimension: string;
  name: string;
  proficiency: ProficiencyLevel;
}

// API Profile Response
export interface FluencyProfileResponse {
  profile: SkillDimension[];
  metadata: {
    experience_range: string;
    role: string;
    title: string;
    company: string;
    country: string;
    geography: string;
    goal?: string;
    max_allowed_level: ProficiencyLevel;
  };
}

// Profile Request Data
export interface ProfileRequestData {
  experience: number;
  role: string;
  title: string;
  company: string;
  country: string;
  company_type: string;
  geography: string;
  goal?: string;
}

// Form Data
export interface ProfileFormData {
  experience: string;
  role: string;
  title: string;
  company: string;
  country: string;
  company_type: string;
  geography: string;
  goal: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

// API Error
export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

// Validation Result
export interface ValidationResult {
  valid: boolean;
  missingFields?: string[];
  message?: string;
}
