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
  session_id: number;
  resumed?: boolean; // true when resuming an in-progress assessment
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

// Advanced Assessment API Types
export interface AdvancedAssessmentSummary {
  session_id: number;
  agent_assessment_id: string;
  status: 'in_progress' | 'completed';
  started_at: string;
  completed_at: string | null;
  total_questions_answered: number;
  track: string;
  experience: string;
  fluencies: { code: string; name: string; target_level: string }[];
  can_start_new: boolean;
  cooldown_ends_at: string | null;
}

export interface TranscriptEntry {
  question_number: number;
  fluency_code: string;
  module_id: string;
  subtopic_title: string | null;
  asked_at_level: string;
  question_text: string;
  user_response: string;
  expected_good_response: string | null;
  score: number | null;
  score_justification: string | null;
  module_scores: Record<string, number> | null;
}

export interface AdvancedAssessmentStatusResponse {
  data: AdvancedAssessmentSummary | null;
  can_start_new: boolean;
}

// Assessment Output types (from agent assessment results)
export interface AssessmentOutputMetadata {
  assessment_id: string;
  track: string;
  experience: string;
  started_at: string;
  completed_at: string;
  total_questions_asked: number;
  fluencies_assessed: number;
}

export interface ModuleResult {
  module_id: string;
  module_title: string;
  signal_score: number;
  demonstrated_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'insufficient_data';
  questions_asked: number;
  is_focus_area: boolean;
}

export interface FluencyResult {
  code: string;
  name: string;
  target_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  demonstrated_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'insufficient_data';
  confidence: 'high' | 'medium' | 'low';
  modules: ModuleResult[];
}

export interface AssessmentOutput {
  metadata: AssessmentOutputMetadata;
  fluency_results: FluencyResult[];
  overall_summary: string;
}

export interface AdvancedAssessmentResultsResponse {
  data: {
    results: AssessmentOutput;
    transcript: TranscriptEntry[];
  };
}

// Error shape returned by initialize on cooldown (409)
export interface CooldownError {
  error_type: 'cooldown_active';
  message: string;
  cooldown_ends_at: string;
}

// Upskill Plan Types
export interface UpskillPlanItem {
  item_id: number;
  fluency_code: string;
  fluency_name: string;
  module_id: string;
  module_title: string;
  subtopic_id: string;
  subtopic_title: string;
  level: string;
  priority: number;
  status: 'pending' | 'done';
  completed_at: string | null;
  rationale: string | null;
}

export interface UpskillWeek {
  week_number: number;
  items: UpskillPlanItem[];
}

export interface UpskillPlanProgress {
  completed: number;
  remaining: number;
  percentage: number;
}

export interface UpskillPlanResponse {
  plan_id: number;
  session_id: number;
  total_items: number;
  total_weeks: number;
  hours_per_week: number;
  is_active: boolean;
  track: string;
  progress: UpskillPlanProgress;
  weeks: UpskillWeek[];
  created_at: string;
}

export interface UpskillPlanUpdateRequest {
  is_active: boolean;
}

export interface UpskillPlanMarkItemsRequest {
  item_ids: number[];
}

export interface UpskillPlanMarkItemsResponse {
  data: { updated_count: number };
}

// Paid Status
export interface PaidStatusResponse {
  is_paid: boolean;
  payment_valid_till: string | null;
}

// Study Material Content
export interface StudyMaterialContentSection {
  heading: string;
  body: string;
  key_points: string[];
}

export interface StudyMaterialExercise {
  title: string;
  instructions: string;
  hints: string[];
  solution_guide: string;
}

export interface StudyMaterialScenario {
  scenario: string;
  options: string[];
  discussion: string;
}

export interface StudyMaterialDebate {
  statement: string;
  for_arguments: string[];
  against_arguments: string[];
  facilitator_note: string;
}

export interface StudyMaterialSelfAssessment {
  question: string;
  answer: string;
}

export interface StudyMaterialResource {
  title: string;
  type: string;
  description: string;
}

export interface StudyMaterialContent {
  subtopic_id: string;
  track: string;
  fluency_code: string;
  subtopic_title: string;
  level: string;
  type: string;
  tldr_summary: string;
  think_before_you_read: string;
  learning_objectives: string[];
  prerequisites: string[];
  estimated_study_time_minutes: number;
  content_sections: StudyMaterialContentSection[];
  exercises: StudyMaterialExercise[];
  what_would_you_do_scenarios: StudyMaterialScenario[];
  debate_this: StudyMaterialDebate;
  quick_win: string;
  self_assessment_questions: StudyMaterialSelfAssessment[];
  confidence_check: {
    before_prompt: string;
    after_prompt: string;
    reflection: string;
  };
  resources: StudyMaterialResource[];
  key_takeaways: string[];
}
