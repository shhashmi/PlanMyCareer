/**
 * Assessment API Service
 * Handles all interactions with the Assessment API
 * Extensible for additional assessment-related endpoints
 */

import api from './api';
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
} from '../types/api.types';

// Mapping from proficiency levels to difficulty levels
const PROFICIENCY_TO_DIFFICULTY: Record<string, DifficultyLevel> = {
  'Beginner': 'Basic',
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
    try {
      const response = await api.get<{ status: string; data: { dimensions: Dimension[] } }>('/v1/questions/dimensions');
      this.dimensionsCache = response.data.data.dimensions;
      return {
        success: true,
        data: response.data.data.dimensions,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.error || error.message || 'Failed to fetch dimensions',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Get all available roles
   */
  async getRoles(): Promise<ApiResponse<Role[]>> {
    try {
      const response = await api.get<{ status: string; data: { roles: Role[] } }>('/v1/questions/roles');
      this.rolesCache = response.data.data.roles;
      return {
        success: true,
        data: response.data.data.roles,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.error || error.message || 'Failed to fetch roles',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Start a new assessment session
   */
  async startAssessment(request: AssessmentStartRequest): Promise<ApiResponse<AssessmentStartResponse>> {
    try {
      const response = await api.post<{ status: string; data: AssessmentStartResponse }>('/v1/assessments/start', request);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.error || error.message || 'Failed to start assessment',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Save an answer for a question
   */
  async saveAnswer(request: SaveAnswerRequest): Promise<ApiResponse<SaveAnswerResponse>> {
    try {
      const response = await api.post<{ status: string; data: SaveAnswerResponse }>('/v1/assessments/save-answer', request);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.error || error.message || 'Failed to save answer',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Submit assessment to mark it as complete
   */
  async submitAssessment(request: SubmitAssessmentRequest): Promise<ApiResponse<SubmitAssessmentResponse>> {
    try {
      const response = await api.post<{ status: string; data: SubmitAssessmentResponse }>('/v1/assessments/submit', request);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.error || error.message || 'Failed to submit assessment',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Get assessment summary
   */
  async getAssessmentSummary(sessionId: number): Promise<ApiResponse<AssessmentSummary>> {
    try {
      const response = await api.get<{ status: string; data: AssessmentSummary }>(`/v1/assessments/${sessionId}/summary`);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.error || error.message || 'Failed to get assessment summary',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Map API profile to evaluated dimensions for assessment
   * Uses fetched dimensions to map skill names to dimension codes
   */
  mapProfileToDimensions(apiProfile: FluencyProfileResponse, dimensions: Dimension[]): EvaluatedDimension[] {
    console.log('📊 Mapping profile to dimensions:', { profile: apiProfile.profile, dimensions });
    
    const nameToCode: Record<string, DimensionCode> = {};
    dimensions.forEach(dim => {
      nameToCode[dim.name.toLowerCase().trim()] = dim.dimension_code;
    });

    const result = apiProfile.profile
      .map(skill => {
        const normalizedName = skill.name.toLowerCase().trim();
        const dimensionCode = nameToCode[normalizedName];
        const difficultyLevel = PROFICIENCY_TO_DIFFICULTY[skill.proficiency];

        console.log('🔍 Mapping skill:', { 
          skillName: skill.name, 
          normalizedName,
          proficiency: skill.proficiency,
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
        };
      })
      .filter((dim): dim is EvaluatedDimension => dim !== null);

    console.log('✅ Mapped dimensions:', result);
    return result;
  }

  /**
   * Build assessment start request from profile data
   */
  async buildStartRequest(
    apiProfile: FluencyProfileResponse,
    assessmentType: 'basic' | 'advanced' = 'basic',
    questionCount: number = 15
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

    const evaluatedDimensions = this.mapProfileToDimensions(apiProfile, dimensions);

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
   * Returns the incomplete assessment if exists, null otherwise
   */
  async checkIncompleteAssessment(): Promise<ApiResponse<IncompleteAssessmentResponse | null>> {
    try {
      const response = await api.get<{ status: string; data: IncompleteAssessmentResponse }>('/v1/assessments/incomplete');
      return {
        success: true,
        data: response.data.data,
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
    try {
      const response = await api.post<{ status: string; data: IncompleteAssessmentResponse }>('/v1/assessments/resume');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.message || error.message || 'Failed to resume assessment',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Get basic assessment aggregate report
   * Returns aggregated scores across all completed basic assessments
   */
  async getBasicAssessmentReport(): Promise<ApiResponse<BasicAssessmentReport>> {
    try {
      const response = await api.get<{ status: string; data: BasicAssessmentReport }>('/v1/reports/basic-assessment');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.message || error.message || 'Failed to get assessment report',
          details: error.response?.data,
        },
      };
    }
  }
}

// Export singleton instance
export const assessmentService = new AssessmentService();

// Export class for creating new instances if needed
export default AssessmentService;
