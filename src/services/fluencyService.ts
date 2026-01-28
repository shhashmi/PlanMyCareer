/**
 * Fluency API Service
 * Handles all interactions with the AI Fluens API
 * Extensible for additional fluency-related endpoints
 */

import api from './api';
import { wrapDirectApiCall } from '../utils/apiWrapper';
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
    return wrapDirectApiCall(
      () => api.post<FluencyProfileResponse>('/v2/fluency/resolve', profileData),
      'Failed to resolve profile'
    );
  }

  /**
   * Map form data to API request format
   * Useful for transforming UI form data to API schema
   */
  mapFormDataToRequest(formData: ProfileFormData): ProfileRequestData {
    return {
      experience_years: parseInt(formData.experience) || 0,
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
    const required: (keyof ProfileRequestData)[] = ['experience_years', 'role', 'company', 'country'];
    const missing = required.filter(field => profileData[field] === undefined || profileData[field] === '');

    if (missing.length > 0) {
      return {
        valid: false,
        missingFields: missing,
        message: `Missing required fields: ${missing.join(', ')}`,
      };
    }

    if (profileData.experience_years !== undefined && (profileData.experience_years < 0 || profileData.experience_years > 100)) {
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
