/**
 * Fluency API Service
 * Handles all interactions with the AI Fluens API
 * Extensible for additional fluency-related endpoints
 */

import api from './api';
import type {
  ProfileRequestData,
  ProfileFormData,
  FluencyProfileResponse,
  ApiResponse,
  ValidationResult,
} from '../types/api.types';

class FluencyService {
  /**
   * Resolve user profile and get AI skill proficiency analysis
   */
  async resolveProfile(profileData: ProfileRequestData): Promise<ApiResponse<FluencyProfileResponse>> {
    try {
      const response = await api.post<FluencyProfileResponse>('/v1/fluency/resolve', profileData);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.error || error.message || 'Failed to resolve profile',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Map form data to API request format
   * Useful for transforming UI form data to API schema
   */
  mapFormDataToRequest(formData: ProfileFormData): ProfileRequestData {
    return {
      experience_years: parseInt(formData.experience_years) || 0,
      role: formData.role || '',
      title: formData.title || '',
      company: formData.company || '',
      country: formData.country || '',
      company_type: formData.company_type || '',
      geography: formData.geography || formData.country || '',
      ...(formData.goal && { goal: formData.goal }),
    };
  }

  /**
   * Validate profile data before sending
   */
  validateProfileData(profileData: Partial<ProfileRequestData>): ValidationResult {
    const required: (keyof ProfileRequestData)[] = ['experience_years', 'role', 'title', 'company', 'country'];
    const missing = required.filter(field => !profileData[field]);

    if (missing.length > 0) {
      return {
        valid: false,
        missingFields: missing,
        message: `Missing required fields: ${missing.join(', ')}`,
      };
    }

    if (profileData.experience_years !== undefined && (profileData.experience_years < 0 || profileData.experience_years > 50)) {
      return {
        valid: false,
        message: 'Experience must be between 0 and 50 years',
      };
    }

    return { valid: true };
  }

  /**
   * Get the latest profile for the authenticated user
   */
  async getProfile(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get<any>('/profile');
      return {
        success: true,
        data: response.data.data.profile,
      };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: true,
          data: null, // No profile found
        };
      }
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.message || error.message || 'Failed to fetch profile',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Create a new profile for the authenticated user
   */
  async createProfile(profileData: any): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<any>('/profile', profileData);
      return {
        success: true,
        data: response.data.data.profile,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.message || error.message || 'Failed to create profile',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Check if user has a profile
   */
  async checkProfile(): Promise<ApiResponse<{ hasProfile: boolean }>> {
    try {
      const response = await api.get<any>('/profile/check');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.message || error.message || 'Failed to check profile',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Get incomplete assessment session if exists
   */
  async getIncompleteSession(): Promise<ApiResponse<any>> {
    try {
      const response = await api.get<any>('/assessments/incomplete');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.message || error.message || 'Failed to check incomplete session',
          details: error.response?.data,
        },
      };
    }
  }

  /**
   * Reset an incomplete assessment session
   */
  async resetSession(sessionId: number): Promise<ApiResponse<any>> {
    try {
      const response = await api.post<any>(`/assessments/${sessionId}/reset`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.message || error.message || 'Failed to reset session',
          details: error.response?.data,
        },
      };
    }
  }
}

// Export singleton instance
export const fluencyService = new FluencyService();

// Export class for creating new instances if needed
export default FluencyService;
