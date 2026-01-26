import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { AppContextType, User, ProfileData, Skill, AssessmentResult, IncompleteAssessmentSession } from '../types/context.types';
import type { FluencyProfileResponse, Role } from '../types/api.types';
import api from '../services/api';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(() => {
    const saved = localStorage.getItem('profileData');
    return saved ? JSON.parse(saved) : null;
  });
  const [skills, setSkills] = useState<Skill[]>(() => {
    const saved = localStorage.getItem('skills');
    return saved ? JSON.parse(saved) : [];
  });
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[] | null>(() => {
    const saved = localStorage.getItem('assessmentResults');
    return saved ? JSON.parse(saved) : null;
  });
  const [advancedResults, setAdvancedResults] = useState<any>(() => {
    const saved = localStorage.getItem('advancedResults');
    return saved ? JSON.parse(saved) : null;
  });
  const [upskillPlan, setUpskillPlan] = useState<any>(() => {
    const saved = localStorage.getItem('upskillPlan');
    return saved ? JSON.parse(saved) : null;
  });
  const [apiProfile, setApiProfile] = useState<FluencyProfileResponse | null>(() => {
    const saved = localStorage.getItem('apiProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const [incompleteAssessment, setIncompleteAssessment] = useState<IncompleteAssessmentSession | null>(() => {
    const saved = localStorage.getItem('incompleteAssessment');
    return saved ? JSON.parse(saved) : null;
  });
  const [roles, setRoles] = useState<Role[]>(() => {
    const saved = localStorage.getItem('roles');
    return saved ? JSON.parse(saved) : [];
  });
  const [rolesLoading, setRolesLoading] = useState(false);

  // Persistence Effects
  useEffect(() => {
    if (profileData) localStorage.setItem('profileData', JSON.stringify(profileData));
    else localStorage.removeItem('profileData');
  }, [profileData]);

  useEffect(() => {
    if (skills.length > 0) localStorage.setItem('skills', JSON.stringify(skills));
    else localStorage.removeItem('skills');
  }, [skills]);

  useEffect(() => {
    if (assessmentResults) localStorage.setItem('assessmentResults', JSON.stringify(assessmentResults));
    else localStorage.removeItem('assessmentResults');
  }, [assessmentResults]);

  useEffect(() => {
    if (advancedResults) localStorage.setItem('advancedResults', JSON.stringify(advancedResults));
    else localStorage.removeItem('advancedResults');
  }, [advancedResults]);

  useEffect(() => {
    if (upskillPlan) localStorage.setItem('upskillPlan', JSON.stringify(upskillPlan));
    else localStorage.removeItem('upskillPlan');
  }, [upskillPlan]);

  useEffect(() => {
    if (apiProfile) localStorage.setItem('apiProfile', JSON.stringify(apiProfile));
    else localStorage.removeItem('apiProfile');
  }, [apiProfile]);

  useEffect(() => {
    if (incompleteAssessment) localStorage.setItem('incompleteAssessment', JSON.stringify(incompleteAssessment));
    else localStorage.removeItem('incompleteAssessment');
  }, [incompleteAssessment]);

  useEffect(() => {
    if (roles.length > 0) localStorage.setItem('roles', JSON.stringify(roles));
    else localStorage.removeItem('roles');
  }, [roles]);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get('/v1/auth/me');
        if (response.data.status === 'success') {
          setUser(response.data.data.user);
          setIsLoggedIn(true);

          // Fetch roles if not in cache
          const cachedRoles = localStorage.getItem('roles');
          if (!cachedRoles || JSON.parse(cachedRoles).length === 0) {
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
        }
      } catch (error) {
        console.log('No active session found.');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
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
