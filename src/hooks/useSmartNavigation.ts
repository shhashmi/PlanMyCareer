import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { profileService } from '../services/profileService';
import { assessmentService } from '../services/assessmentService';
import type { IncompleteAssessmentResponse } from '../types/api.types';

export type NavigationDestination = '/' | '/skills' | '/assessment-progress';

export interface SmartNavigationResult {
  destination: NavigationDestination;
  hasProfile: boolean;
  incompleteAssessment: IncompleteAssessmentResponse | null;
}

export function useSmartNavigation() {
  const navigate = useNavigate();
  const { isLoggedIn, setIncompleteAssessment } = useApp();
  const [isNavigating, setIsNavigating] = useState(false);

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
      
      navigate(result.destination);
    } catch (error) {
      console.error('Smart navigation error:', error);
      navigate('/');
    } finally {
      setIsNavigating(false);
    }
  }, [isNavigating, determineDestination, navigate, setIncompleteAssessment]);

  return {
    smartNavigate,
    determineDestination,
    isNavigating,
  };
}
