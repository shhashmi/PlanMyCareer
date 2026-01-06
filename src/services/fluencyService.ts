/**
 * Fluency API Service
 * Handles all interactions with the AI Fluens API
 * Extensible for additional fluency-related endpoints
 */

import ApiService from './apiService';
import type {
  ProfileRequestData,
  ProfileFormData,
  FluencyProfileResponse,
  ApiResponse,
  ValidationResult,
} from '../types/api.types';

class FluencyService extends ApiService {
  constructor() {
    // Development: Use relative URL (proxied via Vite to localhost:8080)
    // Production: Use production API domain directly
    const baseURL = import.meta.env.PROD
      ? 'https://api.aifluens.com'
      : '';
    super(baseURL);
  }

  /**
   * Resolve user profile and get AI skill proficiency analysis
   */
  async resolveProfile(profileData: ProfileRequestData): Promise<ApiResponse<FluencyProfileResponse>> {
    try {
      const response = await this.post<FluencyProfileResponse>('/api/fluency/resolve', profileData);
      return {
        success: true,
        data: response,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.status || 0,
          message: error.message || 'Failed to resolve profile',
          details: error.data,
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
      experience: parseInt(formData.experience) || 0,
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
    const required: (keyof ProfileRequestData)[] = ['experience', 'role', 'title', 'company', 'country'];
    const missing = required.filter(field => !profileData[field]);

    if (missing.length > 0) {
      return {
        valid: false,
        missingFields: missing,
        message: `Missing required fields: ${missing.join(', ')}`,
      };
    }

    if (profileData.experience !== undefined && (profileData.experience < 0 || profileData.experience > 100)) {
      return {
        valid: false,
        message: 'Experience must be between 0 and 100 years',
      };
    }

    return { valid: true };
  }
}

// Export singleton instance
export const fluencyService = new FluencyService();

// Export class for creating new instances if needed
export default FluencyService;
