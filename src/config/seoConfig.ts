const BASE_URL = 'https://aifluens.com';
const SITE_NAME = 'AI Fluens';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

export interface PageSEO {
  title: string;
  description: string;
  noIndex?: boolean;
}

export const seoConfig: Record<string, PageSEO> = {
  '/': {
    title: 'AI Fluens - AI Skill Gap Analysis & Personalized Upskilling Plans',
    description:
      'Discover your AI skill gaps and get personalized upskilling plans. AI Fluens helps professionals assess their AI proficiency, identify areas for improvement, and create structured learning paths for career advancement.',
  },
  '/skills': {
    title: 'Your AI Skills | AI Fluens',
    description:
      'View your personalized AI skill profile. See which competencies matter most for your role and where to focus your learning.',
  },
  '/login': {
    title: 'Sign In | AI Fluens',
    description:
      'Sign in to AI Fluens to access your AI skill assessments, results, and personalized upskilling plans.',
  },
  '/how-it-works': {
    title: 'How It Works | AI Fluens',
    description:
      'Learn how AI Fluens assesses your AI skills in 3 simple steps: tell us about yourself, take an assessment, and get a personalized upskilling plan.',
  },
  '/pricing': {
    title: 'Pricing | AI Fluens',
    description:
      'Start with a free basic AI assessment or upgrade to the advanced plan for a comprehensive skill gap analysis and personalized weekly learning plan.',
  },
  '/faq': {
    title: 'Frequently Asked Questions | AI Fluens',
    description:
      'Find answers to common questions about AI Fluens, our AI skill assessments, personalized learning plans, pricing, and data security.',
  },
  '/about': {
    title: 'About Us | AI Fluens',
    description:
      'AI Fluens helps professionals identify AI skill gaps and build personalized learning paths. Learn about our mission, values, and approach.',
  },
  '/contact': {
    title: 'Contact Us | AI Fluens',
    description:
      'Get in touch with the AI Fluens team. We\'re here to answer questions about our AI skill assessments and upskilling plans.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | AI Fluens',
    description:
      'Read the AI Fluens privacy policy to understand how we collect, use, and protect your personal information and assessment data.',
  },
  '/terms-of-use': {
    title: 'Terms of Use | AI Fluens',
    description:
      'Review the AI Fluens terms of use governing your access and use of our AI skill assessment and upskilling platform.',
  },
  '/refund-policy': {
    title: 'Refund Policy | AI Fluens',
    description:
      'Learn about our refund policy for the AI Fluens advanced assessment, including eligibility, timelines, and how to request a refund.',
  },
  // Protected routes — noIndex
  '/assessment': {
    title: 'Choose Assessment | AI Fluens',
    description: 'Choose your AI skill assessment type.',
    noIndex: true,
  },
  '/basic-assessment': {
    title: 'Basic Assessment | AI Fluens',
    description: 'Take the AI Fluens basic skill assessment.',
    noIndex: true,
  },
  '/basic-results': {
    title: 'Assessment Results | AI Fluens',
    description: 'View your basic assessment results.',
    noIndex: true,
  },
  '/advanced-assessment': {
    title: 'Advanced Assessment | AI Fluens',
    description: 'Take the AI Fluens advanced skill assessment.',
    noIndex: true,
  },
  '/advanced-results': {
    title: 'Advanced Results | AI Fluens',
    description: 'View your advanced assessment results.',
    noIndex: true,
  },
  '/upskill-plan': {
    title: 'Your Upskill Plan | AI Fluens',
    description: 'Your personalized AI upskilling plan.',
    noIndex: true,
  },
  '/payment': {
    title: 'Get Advanced Assessment | AI Fluens',
    description: 'Upgrade to the advanced AI skill assessment.',
    noIndex: true,
  },
  '/profile': {
    title: 'Your Profile | AI Fluens',
    description: 'Manage your AI Fluens profile.',
    noIndex: true,
  },
  '/resume-assessment': {
    title: 'Resume Assessment | AI Fluens',
    description: 'Resume your in-progress assessment.',
    noIndex: true,
  },
  '/assessment-progress': {
    title: 'Assessment Progress | AI Fluens',
    description: 'View your assessment progress.',
    noIndex: true,
  },
  '/auth-callback': {
    title: 'Signing In... | AI Fluens',
    description: 'Completing sign-in.',
    noIndex: true,
  },
};

export { BASE_URL, SITE_NAME, DEFAULT_IMAGE };
