import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { profileService } from '../services/profileService';
import { assessmentService } from '../services/assessmentService';
import { fluencyService } from '../services/fluencyService';
import type { IncompleteAssessmentSession } from '../types/context.types';

export type NavigationDestination = '/' | '/skills' | '/assessment-progress';

export interface SmartNavigationResult {
  destination: NavigationDestination;
  hasProfile: boolean;
  incompleteAssessment: IncompleteAssessmentSession | null;
}

export function useSmartNavigation() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    setIncompleteAssessment,
    setProfileData,
    setSkills,
    setApiProfile,
    profileData,
    skills
  } = useApp();
  const [isNavigating, setIsNavigating] = useState(false);

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
        if (profileCheck.error?.status === 401) {
          return { destination: '/', hasProfile: false, incompleteAssessment: null };
        }
        console.error('Profile check failed:', profileCheck.error);
        return { destination: '/', hasProfile: false, incompleteAssessment: null };
      }

      const hasProfile = profileCheck.data?.hasProfile === true;

      if (!hasProfile) {
        return { destination: '/', hasProfile: false, incompleteAssessment: null };
      }

      const incompleteCheck = await assessmentService.checkIncompleteAssessment();
      
      if (!incompleteCheck.success) {
        if (incompleteCheck.error?.status === 401) {
          return { destination: '/', hasProfile: false, incompleteAssessment: null };
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
      return { destination: '/', hasProfile: false, incompleteAssessment: null };
    }
  }, [isLoggedIn]);

  const smartNavigate = useCallback(async () => {
    if (isNavigating) return;

    setIsNavigating(true);
    try {
      const result = await determineDestination();

      if (result.incompleteAssessment && setIncompleteAssessment) {
        setIncompleteAssessment(result.incompleteAssessment);
      }

      // Load profile data before navigating to protected pages
      if (result.hasProfile && (result.destination === '/skills' || result.destination === '/assessment-progress')) {
        const loaded = await loadProfileData();
        if (!loaded) {
          console.error('Failed to load profile data, redirecting to home');
          navigate('/');
          return;
        }
      }

      navigate(result.destination);
    } catch (error) {
      console.error('Smart navigation error:', error);
      navigate('/');
    } finally {
      setIsNavigating(false);
    }
  }, [isNavigating, determineDestination, navigate, setIncompleteAssessment, loadProfileData]);

  return {
    smartNavigate,
    determineDestination,
    isNavigating,
  };
}
