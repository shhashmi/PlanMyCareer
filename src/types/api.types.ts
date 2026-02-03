/**
 * API Type Definitions
 * Central type definitions for all API integrations
 */

// Proficiency levels (matches API v2 enum)
export type ProficiencyLevel = 'Basic' | 'Intermediate' | 'Advanced' | 'Expert';

// Skill dimension from API (v2 includes priority and code)
export interface SkillDimension {
  code: string;
  name: string;
  description: string;
  proficiency: ProficiencyLevel;
  priority: number; // 1-10, lower = higher importance for the role
}

// API Profile Response
export interface FluencyProfileResponse {
  profile: SkillDimension[];
  metadata: {
    experience: number;
    role: string;
    company: string;
    country: string;
    goal?: string | null;
  };
}

// Profile Request Data
export interface ProfileRequestData {
  experience_years: number;
  role: string;
  title?: string;
  company: string;
  country: string;
  company_type?: string;
  geography?: string;
  goal?: string;
  min_fluency_level?: DifficultyLevel;
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
  priority: number; // 1-10, 10 = highest priority (inverted from API's 1=highest)
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
  difficulty_level: DifficultyLevel;
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

// Submit Assessment types
export interface SubmitAssessmentRequest {
  session_id: number;
}

// DimensionScores is a map of dimension code to score percentage (0-100)
export type DimensionScores = Record<DimensionCode, number>;

// AssessmentSession returned by submit endpoint
export interface AssessmentSession {
  session_id: number;
  user_id: number;
  assessment_type: 'basic' | 'advanced';
  started_at: string;
  completed_at: string | null;
  is_complete: boolean;
  metadata: AssessmentMetadata;
}

// SubmitAssessmentResponse is now an AssessmentSession
export type SubmitAssessmentResponse = AssessmentSession;

// Question with answer state for resume
export interface QuestionWithState extends AssessmentQuestion {
  is_answered: boolean;
  selected_option: SelectedOption | null;
}

// Incomplete Assessment Check Response (from /v1/assessments/incomplete)
export interface IncompleteAssessmentCheckResponse {
  has_incomplete: boolean;
  session: {
    session_id: number;
    assessment_type: 'basic' | 'advanced';
    started_at: string;
    answered_count: number;
    total_questions: number;
  } | null;
}

// Incomplete Assessment Response (from /v1/assessments/resume - has full question data)
export interface IncompleteAssessmentResponse {
  session_id: number;
  assessment_type: 'basic' | 'advanced';
  started_at: string;
  questions: QuestionWithState[];
  answered_count: number;
  total_questions: number;
  metadata?: AssessmentMetadata;
  evaluated_dimensions?: EvaluatedDimension[];
}

// Agent API Types
export type CareerTrack = 'PM' | 'EM' | 'SE';

export interface AgentFluencyInput {
  code: string;
  name: string;
  target_level: 'basic' | 'intermediate' | 'advanced' | 'expert';
}

export interface AgentInitializeRequest {
  track: CareerTrack;
  experience: number;
  fluencies: AgentFluencyInput[];
}

export interface AgentInitializeResponse {
  thread_id: string;
}

export interface AgentConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentChatRequest {
  message: string;
  thread_id: string;
  conversation_history?: AgentConversationMessage[];
}

export interface AgentSSEEvent {
  type: 'token' | 'status' | 'done' | 'error';
  content: string;
  assessmentId?: string;
  assessmentComplete?: boolean;
}
