export interface FAQItem {
  question: string;
  answer: string;
}

export const faqs: FAQItem[] = [
  {
    question: 'What is AI Fluens?',
    answer: 'AI Fluens is an AI-powered platform that helps professionals identify their AI skill gaps and provides personalized learning paths. We analyze your current role, experience, and goals to create a tailored assessment and upskilling plan that helps you stay competitive in an AI-driven world.'
  },
  {
    question: 'How long does the assessment take?',
    answer: 'The Basic Assessment takes approximately 10-15 minutes to complete. The Advanced Assessment is more comprehensive and typically takes 20-30 minutes. Both assessments adapt to your responses, so the exact time may vary slightly based on your answers.'
  },
  {
    question: 'What skills are assessed?',
    answer: 'We assess a range of AI-related competencies tailored to your role, including AI/ML fundamentals, prompt engineering, AI tool proficiency, data literacy, AI ethics and governance, and role-specific AI applications. The specific skills evaluated depend on your job function and industry.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we take data security very seriously. All personal information and assessment results are encrypted and stored securely. We never sell your data to third parties. You can review our full Privacy Policy for detailed information about how we protect and use your data.'
  },
  {
    question: 'Can I retake the assessment?',
    answer: 'Yes! You can retake the assessment anytime to track your progress as you develop new AI skills. We recommend retaking the assessment every few months to measure your improvement and update your learning plan.'
  },
  {
    question: "What's included in the Advanced plan?",
    answer: 'The Advanced Assessment ($20 one-time) includes a comprehensive skill gap analysis, detailed competency scores with insights, a personalized weekly learning plan, hands-on assignments to practice your skills, a curated library of learning resources, and progress tracking to monitor your improvement over time.'
  },
  {
    question: 'How is the learning plan personalized?',
    answer: 'Your learning plan is generated based on your assessment results, current role, experience level, and career goals. Our AI analyzes your skill gaps and creates a week-by-week roadmap with specific resources, exercises, and milestones tailored to your needs.'
  },
  {
    question: 'Do I need technical experience to use AI Fluens?',
    answer: 'No technical experience is required. AI Fluens is designed for professionals at all levels, from beginners exploring AI for the first time to experienced practitioners looking to expand their expertise. The assessment adapts to your background and experience level.'
  }
];
