import { useCallback, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigateWithParams } from './useNavigateWithParams';
import { profileService } from '../services/profileService';
import { assessmentService } from '../services/assessmentService';
import { fluencyService } from '../services/fluencyService';
import { isAuthError } from '../utils/errorUtils';
import type { IncompleteAssessmentSession } from '../types/context.types';

export type NavigationDestination = '/' | '/skills' | '/assessment-progress' | '/login' | null;

export interface SmartNavigationResult {
  destination: NavigationDestination;
  hasProfile: boolean;
  incompleteAssessment: IncompleteAssessmentSession | null;
  requiresLogout?: boolean;
}

export function useSmartNavigation() {
  const navigate = useNavigateWithParams();
  const {
    isLoggedIn,
    logout,
    setIncompleteAssessment,
    setProfileData,
    setSkills,
    setApiProfile,
    profileData,
    skills
  } = useApp();
  const [isNavigating, setIsNavigating] = useState(false);
  const isNavigatingRef = useRef(false);

  const loadProfileData = useCallback(async (): Promise<boolean> => {
    // Skip if data is already loaded
    if (profileData && skills.length > 0) {
      return true;
    }

    try {
      // Fetch the user's profile from backend
      const profileResult = await profileService.getProfile();

      if (!profileResult.success || !profileResult.data) {
        console.error('Failed to load profile data:', profileResult.error);
        return false;
      }

      const userProfile = profileResult.data;

      // Map UserProfile to ProfileData for context
      const contextProfileData = {
        experience: userProfile.experience_years.toString(),
        role: userProfile.role,
        title: userProfile.title || '',
        company: userProfile.company,
        country: userProfile.country,
        company_type: userProfile.company_type || undefined,
        geography: userProfile.geography || undefined,
        goal: userProfile.goal || undefined,
      };

      setProfileData(contextProfileData);

      // Generate skills using fluency service
      const fluencyResult = await fluencyService.resolveProfile({
        experience_years: userProfile.experience_years,
        role: userProfile.role,
        title: userProfile.title || undefined,
        company: userProfile.company,
        country: userProfile.country,
        company_type: userProfile.company_type || undefined,
        geography: userProfile.geography || undefined,
        goal: userProfile.goal || undefined,
      });

      if (fluencyResult.success && fluencyResult.data) {
        setApiProfile(fluencyResult.data);

        const apiSkills = fluencyResult.data.profile.map(skillDimension => ({
          name: skillDimension.name,
          level: skillDimension.proficiency.toLowerCase(),
          description: skillDimension.description
        }));

        setSkills(apiSkills);
      } else {
        console.error('Failed to generate skills:', fluencyResult.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error loading profile data:', error);
      return false;
    }
  }, [profileData, skills, setProfileData, setSkills, setApiProfile]);

  const determineDestination = useCallback(async (): Promise<SmartNavigationResult> => {
    if (!isLoggedIn) {
      return { destination: '/', hasProfile: false, incompleteAssessment: null };
    }

    try {
      const profileCheck = await profileService.checkProfile();

      if (!profileCheck.success) {
        if (isAuthError(profileCheck.error)) {
          return { destination: '/login', hasProfile: false, incompleteAssessment: null, requiresLogout: true };
        }
        console.error('Profile check failed:', profileCheck.error);
        return { destination: null, hasProfile: false, incompleteAssessment: null };
      }

      const hasProfile = profileCheck.data?.hasProfile === true;

      if (!hasProfile) {
        return { destination: '/', hasProfile: false, incompleteAssessment: null };
      }

      const incompleteCheck = await assessmentService.checkIncompleteAssessment();

      if (!incompleteCheck.success) {
        if (isAuthError(incompleteCheck.error)) {
          return { destination: '/login', hasProfile: false, incompleteAssessment: null, requiresLogout: true };
        }
        console.error('Incomplete assessment check failed:', incompleteCheck.error);
        return { destination: '/skills', hasProfile: true, incompleteAssessment: null };
      }

      const incompleteAssessment = incompleteCheck.data;

      if (incompleteAssessment) {
        return { destination: '/assessment-progress', hasProfile: true, incompleteAssessment };
      }

      return { destination: '/skills', hasProfile: true, incompleteAssessment: null };
    } catch (error) {
      console.error('Smart navigation error:', error);
      return { destination: null, hasProfile: false, incompleteAssessment: null };
    }
  }, [isLoggedIn]);

  const smartNavigate = useCallback(async () => {
    if (isNavigatingRef.current) return;

    isNavigatingRef.current = true;
    setIsNavigating(true);
    try {
      const result = await determineDestination();

      if (result.requiresLogout) {
        logout();
      }

      if (result.destination === null) {
        return;
      }

      if (result.incompleteAssessment && setIncompleteAssessment) {
        setIncompleteAssessment(result.incompleteAssessment);
      }

      // Load profile data before navigating to skills page (not needed for assessment-progress)
      if (result.hasProfile && result.destination === '/skills') {
        const loaded = await loadProfileData();
        if (!loaded) {
          console.error('Failed to load profile data, staying on current page');
          return;
        }
      }

      navigate(result.destination);
    } catch (error) {
      console.error('Smart navigation error:', error);
    } finally {
      isNavigatingRef.current = false;
      setIsNavigating(false);
    }
  }, [determineDestination, navigate, setIncompleteAssessment, loadProfileData, logout]);

  return {
    smartNavigate,
    determineDestination,
    isNavigating,
  };
}
