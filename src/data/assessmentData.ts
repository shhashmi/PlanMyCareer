/**
 * Shared assessment data constants
 * Used by AssessmentChoice and AssessmentProgress pages
 */

export const BASIC_ASSESSMENT_FEATURES = [
  'Short personalized assessment',
  'Instant skill gap visualization',
  'Actionable recommendations',
  'Results delivered immediately'
];

export const ADVANCED_ASSESSMENT_FEATURES = [
  'Detailed personalized assessment',
  'Instant skill gap visualization',
  'Weekly learning plan tailored to your schedule',
  'Hands-on assignments for practical experience',
  'Extended support to complete assignments'
];

export const BASIC_ASSESSMENT_INFO = {
  title: 'Basic Assessment',
  description: 'A quick, personalized evaluation with instant insights',
  price: 'Free',
  duration: '5-10 minutes',
  features: BASIC_ASSESSMENT_FEATURES
};

export const ADVANCED_ASSESSMENT_INFO = {
  title: 'Advanced Assessment',
  description: 'Comprehensive evaluation with structured learning and hands-on practice',
  price: '$20',
  priceNote: 'one-time',
  features: ADVANCED_ASSESSMENT_FEATURES
};
