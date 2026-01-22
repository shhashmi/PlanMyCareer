import { useEffect } from 'react';

const BASE_TITLE = 'AI Fluens';

export const usePageTitle = (title?: string) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${BASE_TITLE}`;
    } else {
      document.title = `${BASE_TITLE} - AI Skill Gap Analysis & Personalized Upskilling Plans`;
    }
    
    return () => {
      document.title = `${BASE_TITLE} - AI Skill Gap Analysis & Personalized Upskilling Plans`;
    };
  }, [title]);
};

export const pageTitles = {
  home: undefined,
  skills: 'Your AI Skills',
  login: 'Sign In',
  assessment: 'Choose Assessment',
  basicAssessment: 'Basic Assessment',
  basicResults: 'Assessment Results',
  advancedAssessment: 'Advanced Assessment',
  advancedResults: 'Advanced Results',
  upskillPlan: 'Your Upskill Plan',
  payment: 'Get Advanced Assessment',
  profile: 'Your Profile',
  resumeAssessment: 'Resume Assessment',
  privacyPolicy: 'Privacy Policy',
  termsOfUse: 'Terms of Use'
};
