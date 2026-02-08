import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { AppContextType, User, ProfileData, Skill, AssessmentResult, IncompleteAssessmentSession } from '../types/context.types';
import type { FluencyProfileResponse, Role } from '../types/api.types';
import api from '../services/api';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use the useLocalStorage hook for all persisted state
  const [profileData, setProfileData] = useLocalStorage<ProfileData | null>('profileData', null);
  const [skills, setSkills] = useLocalStorage<Skill[]>('skills', []);
  const [assessmentResults, setAssessmentResults] = useLocalStorage<AssessmentResult[] | null>('assessmentResults', null);
  const [advancedResults, setAdvancedResults] = useLocalStorage<any>('advancedResults', null);
  const [advancedSessionId, setAdvancedSessionId] = useLocalStorage<number | null>('advancedSessionId', null);
  const [upskillPlan, setUpskillPlan] = useLocalStorage<any>('upskillPlan', null);
  const [apiProfile, setApiProfile] = useLocalStorage<FluencyProfileResponse | null>('apiProfile', null);
  const [incompleteAssessment, setIncompleteAssessment] = useLocalStorage<IncompleteAssessmentSession | null>('incompleteAssessment', null);
  const [roles, setRoles] = useLocalStorage<Role[]>('roles', []);

  const [rolesLoading, setRolesLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get('/v1/auth/me');
        if (response.data.status === 'success') {
          setUser(response.data.data.user);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log('No active session found.');
      } finally {
        setLoading(false);
      }
    };

    const fetchRoles = async (cachedRoles: Role[]) => {
      if (cachedRoles.length === 0) {
        setRolesLoading(true);
        try {
          const rolesResponse = await api.get('/v1/questions/roles');
          if (rolesResponse.data.status === 'success') {
            setRoles(rolesResponse.data.data.roles);
          }
        } catch (error) {
          console.error('Failed to fetch roles:', error);
        } finally {
          setRolesLoading(false);
        }
      }
    };

    checkSession();
    fetchRoles(roles);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    try {
      await api.post('/v1/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      localStorage.clear();
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn,
      loading,
      login,
      logout,
      profileData,
      setProfileData,
      skills,
      setSkills,
      assessmentResults,
      setAssessmentResults,
      advancedResults,
      setAdvancedResults,
      advancedSessionId,
      setAdvancedSessionId,
      upskillPlan,
      setUpskillPlan,
      apiProfile,
      setApiProfile,
      incompleteAssessment,
      setIncompleteAssessment,
      roles,
      rolesLoading
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
