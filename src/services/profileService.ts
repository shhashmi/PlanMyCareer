import api from './api';

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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    status: number;
    message: string;
  };
}

class ProfileService {
  async checkProfile(): Promise<ApiResponse<ProfileCheckResponse>> {
    try {
      const response = await api.get<{ status: string; data: ProfileCheckResponse }>('/v1/profile/check');
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
        },
      };
    }
  }

  async getProfile(): Promise<ApiResponse<UserProfile | null>> {
    try {
      const response = await api.get<{ status: string; data: { profile: UserProfile | null } }>('/v1/profile');
      return {
        success: true,
        data: response.data.data.profile,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.message || error.message || 'Failed to get profile',
        },
      };
    }
  }

  async createProfile(profileData: CreateProfileRequest): Promise<ApiResponse<UserProfile>> {
    try {
      const response = await api.post<{ status: string; data: { profile: UserProfile } }>('/v1/profile', profileData);
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
        },
      };
    }
  }

  async getProfileHistory(): Promise<ApiResponse<{ profiles: UserProfile[]; count: number }>> {
    try {
      const response = await api.get<{ status: string; data: { profiles: UserProfile[]; count: number } }>('/v1/profile/history');
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          status: error.response?.status || 0,
          message: error.response?.data?.message || error.message || 'Failed to get profile history',
        },
      };
    }
  }
}

export const profileService = new ProfileService();
