import api from './api';
import { wrapApiCall } from '../utils/apiWrapper';
import type { ApiResponse } from '../types/api.types';

export interface UserProfile {
  profile_id: number;
  user_id: number;
  name: string | null;
  role: string;
  title: string | null;
  experience_years: number;
  company: string;
  country: string;
  company_type: string | null;
  geography: string | null;
  goal: string | null;
  is_active: boolean;
  metadata?: Record<string, any>;
}

export interface CreateProfileRequest {
  role: string;
  experience_years: number;
  company: string;
  country: string;
  name?: string;
  title?: string;
  company_type?: string;
  geography?: string;
  goal?: string;
  metadata?: Record<string, any>;
}

export interface ProfileCheckResponse {
  hasProfile: boolean;
}

class ProfileService {
  async checkProfile(): Promise<ApiResponse<ProfileCheckResponse>> {
    return wrapApiCall(
      () => api.get<{ status: string; data: ProfileCheckResponse }>('/v1/profile/check'),
      'Failed to check profile'
    );
  }

  async getProfile(): Promise<ApiResponse<UserProfile | null>> {
    return wrapApiCall<UserProfile | null, { profile: UserProfile | null }>(
      () => api.get<{ status: string; data: { profile: UserProfile | null } }>('/v1/profile'),
      'Failed to get profile',
      (data) => data.profile
    );
  }

  async createProfile(profileData: CreateProfileRequest): Promise<ApiResponse<UserProfile>> {
    return wrapApiCall<UserProfile, { profile: UserProfile }>(
      () => api.post<{ status: string; data: { profile: UserProfile } }>('/v1/profile', profileData),
      'Failed to create profile',
      (data) => data.profile
    );
  }

  async getProfileHistory(): Promise<ApiResponse<{ profiles: UserProfile[]; count: number }>> {
    return wrapApiCall(
      () => api.get<{ status: string; data: { profiles: UserProfile[]; count: number } }>('/v1/profile/history'),
      'Failed to get profile history'
    );
  }
}

export const profileService = new ProfileService();
