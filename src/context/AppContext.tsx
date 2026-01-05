import { createContext, useContext, useState, ReactNode } from 'react';
import type { AppContextType, User, ProfileData, Skill, AssessmentResult } from '../types/context.types';
import type { FluencyProfileResponse } from '../types/api.types';

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[] | null>(null);
  const [advancedResults, setAdvancedResults] = useState<any>(null);
  const [upskillPlan, setUpskillPlan] = useState<any>(null);
  const [apiProfile, setApiProfile] = useState<FluencyProfileResponse | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AppContext.Provider value={{
      user,
      isLoggedIn,
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
      setApiProfile
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
