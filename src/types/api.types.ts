/**
 * API Type Definitions
 * Central type definitions for all API integrations
 */

// Proficiency levels
export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

// Skill dimension from API
export interface SkillDimension {
  name: string;
  description: string;
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

// Assessment Types
export type DimensionCode = 'FND' | 'PRM' | 'ASE' | 'ETH' | 'COL';
export type DifficultyLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

export interface EvaluatedDimension {
  dimension: DimensionCode;
  difficulty_level: DifficultyLevel;
}

export interface AssessmentStartRequest {
  assessment_type: 'basic' | 'advanced';
  role: string;
  evaluated_dimensions: EvaluatedDimension[];
  question_count: number;
  experience_years: number;
  company: string;
  country: string;
}

export interface AssessmentQuestion {
  question_id: number;
  question_text: string;
  dimension: DimensionCode;
  difficulty_level: DifficultyLevel;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
}

export interface AssessmentStartResponse {
  session_id: number;
  assessment_type: 'basic' | 'advanced';
  started_at: string;
  questions: AssessmentQuestion[];
}

// Dimension from API
export interface Dimension {
  dimension_id: number;
  dimension_code: DimensionCode;
  name: string;
  description: string;
}

// Role from API
export interface Role {
  role_id: number;
  name: string;
  created_at: string;
}

// Save Answer types
export type SelectedOption = 'A' | 'B' | 'C' | 'D';

export interface SaveAnswerRequest {
  session_id: number;
  question_id: number;
  selected_option: SelectedOption;
}

export interface SaveAnswerResponse {
  is_correct: boolean;
  message: string;
}

// Assessment Summary types
export interface AssessmentMetadata {
  experience_years: number;
  company: string;
  country: string;
  role: string;
}

export interface CompetencyBreakdown {
  dimension: DimensionCode;
  total_questions: number;
  correct_answers: number;
}

export interface AssessmentSummary {
  session_id: number;
  assessment_type: 'basic' | 'advanced';
  started_at: string;
  completed_at: string | null;
  metadata: AssessmentMetadata;
  total_questions: number;
  total_correct: number;
  competency_breakdown: CompetencyBreakdown[];
}

// Aggregate Report Types
export interface DimensionScoreBreakdown {
  dimension: DimensionCode;
  total_questions: number;
  correct_answers: number;
  score_percentage: number;
}

export interface BasicAssessmentReport {
  user_id: number;
  total_assessments: number;
  total_questions: number;
  total_correct: number;
  overall_score_percentage: number;
  dimension_scores: DimensionScoreBreakdown[];
}
