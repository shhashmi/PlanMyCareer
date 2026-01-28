/**
 * Assessment API Service
 * Handles all interactions with the Assessment API
 * Extensible for additional assessment-related endpoints
 */

import api from './api';
import { wrapApiCall, wrapVoidApiCall } from '../utils/apiWrapper';
import type {
  AssessmentStartRequest,
  AssessmentStartResponse,
  EvaluatedDimension,
  DimensionCode,
  DifficultyLevel,
  ApiResponse,
  FluencyProfileResponse,
  Dimension,
  Role,
  SaveAnswerRequest,
  SaveAnswerResponse,
  AssessmentSummary,
  BasicAssessmentReport,
  SubmitAssessmentRequest,
  SubmitAssessmentResponse,
  IncompleteAssessmentResponse,
  IncompleteAssessmentCheckResponse,
} from '../types/api.types';

// Mapping from proficiency levels to difficulty levels
const PROFICIENCY_TO_DIFFICULTY: Record<string, DifficultyLevel> = {
  'Basic': 'Basic',
  'Intermediate': 'Intermediate',
  'Advanced': 'Advanced',
  'Expert': 'Expert',
};

class AssessmentService {
  private dimensionsCache: Dimension[] | null = null;
  private rolesCache: Role[] | null = null;

  /**
   * Get all available dimensions
   */
  async getDimensions(): Promise<ApiResponse<Dimension[]>> {
    const response = await wrapApiCall<Dimension[], { dimensions: Dimension[] }>(
      () => api.get<{ status: string; data: { dimensions: Dimension[] } }>('/v1/questions/dimensions'),
      'Failed to fetch dimensions',
      (data) => data.dimensions
    );

    if (response.success && response.data) {
      this.dimensionsCache = response.data;
    }

    return response;
  }

  /**
   * Get all available roles
   */
  async getRoles(): Promise<ApiResponse<Role[]>> {
    const response = await wrapApiCall<Role[], { roles: Role[] }>(
      () => api.get<{ status: string; data: { roles: Role[] } }>('/v1/questions/roles'),
      'Failed to fetch roles',
      (data) => data.roles
    );

    if (response.success && response.data) {
      this.rolesCache = response.data;
    }

    return response;
  }

  /**
   * Start a new assessment session
   */
  async startAssessment(request: AssessmentStartRequest): Promise<ApiResponse<AssessmentStartResponse>> {
    return wrapApiCall(
      () => api.post<{ status: string; data: AssessmentStartResponse }>('/v1/assessments/start', request),
      'Failed to start assessment'
    );
  }

  /**
   * Save an answer for a question
   */
  async saveAnswer(request: SaveAnswerRequest): Promise<ApiResponse<SaveAnswerResponse>> {
    return wrapApiCall(
      () => api.post<{ status: string; data: SaveAnswerResponse }>('/v1/assessments/save-answer', request),
      'Failed to save answer'
    );
  }

  /**
   * Submit assessment to mark it as complete
   */
  async submitAssessment(request: SubmitAssessmentRequest): Promise<ApiResponse<SubmitAssessmentResponse>> {
    return wrapApiCall(
      () => api.post<{ status: string; data: SubmitAssessmentResponse }>('/v1/assessments/submit', request),
      'Failed to submit assessment'
    );
  }

  /**
   * Get assessment summary
   */
  async getAssessmentSummary(sessionId: number): Promise<ApiResponse<AssessmentSummary>> {
    return wrapApiCall(
      () => api.get<{ status: string; data: AssessmentSummary }>(`/v1/assessments/${sessionId}/summary`),
      'Failed to get assessment summary'
    );
  }

  /**
   * Map API profile to evaluated dimensions for assessment
   * Uses fetched dimensions to map skill names to dimension codes
   * @param apiProfile - The API profile response
   * @param dimensions - Available dimensions from the API
   * @param selectedSkillNames - Optional list of skill names to include (filters to these if provided)
   */
  mapProfileToDimensions(
    apiProfile: FluencyProfileResponse,
    dimensions: Dimension[],
    selectedSkillNames?: string[]
  ): EvaluatedDimension[] {
    console.log('📊 Mapping profile to dimensions:', { profile: apiProfile.profile, dimensions, selectedSkillNames });

    const nameToCode: Record<string, DimensionCode> = {};
    dimensions.forEach(dim => {
      nameToCode[dim.name.toLowerCase().trim()] = dim.dimension_code;
    });

    // Filter skills if selectedSkillNames is provided
    const skillsToMap = selectedSkillNames
      ? apiProfile.profile.filter(skill => selectedSkillNames.includes(skill.name))
      : apiProfile.profile;

    const result = skillsToMap
      .map(skill => {
        const normalizedName = skill.name.toLowerCase().trim();
        const dimensionCode = nameToCode[normalizedName];
        const difficultyLevel = PROFICIENCY_TO_DIFFICULTY[skill.proficiency];

        console.log('🔍 Mapping skill:', {
          skillName: skill.name,
          normalizedName,
          proficiency: skill.proficiency,
          priority: skill.priority,
          dimensionCode,
          difficultyLevel
        });

        if (!dimensionCode || !difficultyLevel) {
          console.warn('⚠️ Failed to map:', { skillName: skill.name, dimensionCode, difficultyLevel });
          return null;
        }

        return {
          dimension: dimensionCode,
          difficulty_level: difficultyLevel,
          priority: 11 - skill.priority, // Invert: API uses 1=highest, we want 10=highest
        };
      })
      .filter((dim): dim is EvaluatedDimension => dim !== null);

    console.log('✅ Mapped dimensions:', result);
    return result;
  }

  /**
   * Build assessment start request from profile data
   * @param apiProfile - The API profile response
   * @param assessmentType - Type of assessment (basic or advanced)
   * @param questionCount - Number of questions
   * @param selectedSkillNames - Optional list of skill names to include (filters to these if provided)
   */
  async buildStartRequest(
    apiProfile: FluencyProfileResponse,
    assessmentType: 'basic' | 'advanced' = 'basic',
    questionCount: number = 15,
    selectedSkillNames?: string[]
  ): Promise<AssessmentStartRequest> {
    // Fetch dimensions if not cached
    let dimensions = this.dimensionsCache;
    if (!dimensions) {
      const response = await this.getDimensions();
      if (response.success && response.data) {
        dimensions = response.data;
      } else {
        dimensions = [];
      }
    }

    const evaluatedDimensions = this.mapProfileToDimensions(apiProfile, dimensions, selectedSkillNames);

    return {
      assessment_type: assessmentType,
      role: apiProfile.metadata.role,
      evaluated_dimensions: evaluatedDimensions,
      question_count: questionCount,
      experience_years: parseInt(apiProfile.metadata.experience_range) || 0,
      company: apiProfile.metadata.company,
      country: apiProfile.metadata.country,
    };
  }

  /**
   * Get cached dimensions or fetch them
   */
  async getCachedDimensions(): Promise<Dimension[]> {
    if (this.dimensionsCache) {
      return this.dimensionsCache;
    }
    const response = await this.getDimensions();
    return response.data || [];
  }

  /**
   * Get cached roles or fetch them
   */
  async getCachedRoles(): Promise<Role[]> {
    if (this.rolesCache) {
      return this.rolesCache;
    }
    const response = await this.getRoles();
    return response.data || [];
  }

  /**
   * Check for incomplete assessment
   * Returns the session summary if exists, null otherwise
   */
  async checkIncompleteAssessment(): Promise<ApiResponse<IncompleteAssessmentCheckResponse['session'] | null>> {
    try {
      const response = await api.get<{ status: string; data: IncompleteAssessmentCheckResponse }>('/v1/assessments/incomplete');
      const { has_incomplete, session } = response.data.data;
      return {
        success: true,
        data: has_incomplete ? session : null,
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: true,
          data: null,
        };
      }
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.message || error.message || 'Failed to check incomplete assessment',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Resume an incomplete assessment
   */
  async resumeAssessment(): Promise<ApiResponse<IncompleteAssessmentResponse>> {
    return wrapApiCall(
      () => api.post<{ status: string; data: IncompleteAssessmentResponse }>('/v1/assessments/resume'),
      'Failed to resume assessment'
    );
  }

  /**
   * Get basic assessment aggregate report
   * Returns aggregated scores across all completed basic assessments
   */
  async getBasicAssessmentReport(): Promise<ApiResponse<BasicAssessmentReport>> {
    return wrapApiCall(
      () => api.get<{ status: string; data: BasicAssessmentReport }>('/v1/reports/basic-assessment'),
      'Failed to get assessment report'
    );
  }

  /**
   * Reset/delete an incomplete assessment session
   */
  async resetSession(sessionId: number): Promise<ApiResponse<void>> {
    return wrapVoidApiCall(
      () => api.post(`/v1/assessments/${sessionId}/reset`),
      'Failed to reset assessment'
    );
  }
}

// Export singleton instance
export const assessmentService = new AssessmentService();

// Export class for creating new instances if needed
export default AssessmentService;
