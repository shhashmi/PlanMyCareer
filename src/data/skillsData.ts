import { Skill } from '../types/context.types';

interface Question {
  question: string;
  options: string[];
}

interface StudyMaterial {
  title: string;
  url: string;
  type: string;
}

type RoleSkillsMap = {
  [key: string]: Skill[];
};

type AssessmentQuestionsMap = {
  [key: string]: Question[];
};

type StudyMaterialsMap = {
  [key: string]: StudyMaterial[];
};

export const roleSkillsMap: RoleSkillsMap = {
  'Software Engineer': [
    { name: 'Prompt Engineering', level: 'intermediate', description: 'Crafting effective prompts for AI models' },
    { name: 'AI-Assisted Coding', level: 'advanced', description: 'Using GitHub Copilot and similar tools' },
    { name: 'ML Model Integration', level: 'intermediate', description: 'Integrating pre-trained models into applications' },
    { name: 'LLM APIs', level: 'advanced', description: 'Working with OpenAI, Anthropic, and similar APIs' },
    { name: 'AI Testing & Debugging', level: 'basic', description: 'Testing AI-generated code and outputs' },
    { name: 'Vector Databases', level: 'intermediate', description: 'Using Pinecone, Weaviate for embeddings' },
    { name: 'RAG Systems', level: 'advanced', description: 'Building retrieval-augmented generation pipelines' },
  ],
  'Product Manager': [
    { name: 'AI Product Strategy', level: 'advanced', description: 'Defining AI product roadmaps' },
    { name: 'Prompt Engineering Basics', level: 'intermediate', description: 'Understanding prompt design' },
    { name: 'AI Ethics & Governance', level: 'intermediate', description: 'Managing AI risks and compliance' },
    { name: 'AI Use Case Identification', level: 'advanced', description: 'Finding AI opportunities' },
    { name: 'AI Vendor Evaluation', level: 'intermediate', description: 'Assessing AI tools and platforms' },
    { name: 'AI Metrics & KPIs', level: 'basic', description: 'Measuring AI product success' },
  ],
  'Data Analyst': [
    { name: 'AI-Powered Analytics', level: 'advanced', description: 'Using AI for data insights' },
    { name: 'Natural Language Queries', level: 'intermediate', description: 'Querying data with natural language' },
    { name: 'Automated Reporting', level: 'intermediate', description: 'AI-driven report generation' },
    { name: 'Predictive Analytics', level: 'advanced', description: 'Using ML for predictions' },
    { name: 'Data Visualization with AI', level: 'basic', description: 'AI-enhanced visualizations' },
    { name: 'AI Data Cleaning', level: 'intermediate', description: 'Automated data preparation' },
  ],
  'Marketing Manager': [
    { name: 'AI Content Generation', level: 'advanced', description: 'Creating content with AI tools' },
    { name: 'AI-Powered SEO', level: 'intermediate', description: 'AI tools for search optimization' },
    { name: 'Personalization Engines', level: 'intermediate', description: 'AI-driven customer personalization' },
    { name: 'Predictive Customer Analytics', level: 'basic', description: 'Forecasting customer behavior' },
    { name: 'AI Ad Optimization', level: 'intermediate', description: 'AI-powered advertising' },
    { name: 'Chatbot Design', level: 'basic', description: 'Designing conversational AI' },
  ],
  'Designer': [
    { name: 'AI Image Generation', level: 'advanced', description: 'Creating visuals with AI tools' },
    { name: 'AI Design Assistants', level: 'intermediate', description: 'Using AI in design workflows' },
    { name: 'Prompt Engineering for Design', level: 'intermediate', description: 'Crafting prompts for visual AI' },
    { name: 'AI UX Research', level: 'basic', description: 'AI tools for user research' },
    { name: 'AI Prototyping', level: 'intermediate', description: 'Rapid prototyping with AI' },
  ],
  'HR Manager': [
    { name: 'AI Recruitment Tools', level: 'advanced', description: 'AI-powered hiring platforms' },
    { name: 'AI Resume Screening', level: 'intermediate', description: 'Automated candidate filtering' },
    { name: 'AI Employee Analytics', level: 'intermediate', description: 'Workforce analytics with AI' },
    { name: 'AI Learning Platforms', level: 'basic', description: 'AI-driven training systems' },
    { name: 'AI Performance Analysis', level: 'basic', description: 'AI-assisted performance reviews' },
  ],
  'Other': [
    { name: 'AI Fundamentals', level: 'basic', description: 'Understanding AI basics' },
    { name: 'Prompt Engineering', level: 'intermediate', description: 'Writing effective prompts' },
    { name: 'AI Tool Selection', level: 'basic', description: 'Choosing the right AI tools' },
    { name: 'AI Ethics', level: 'basic', description: 'Understanding AI ethics' },
    { name: 'AI Productivity', level: 'intermediate', description: 'Using AI to boost productivity' },
  ]
};

export const getLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    beginner: '#6366f1',
    intermediate: '#10b981',
    advanced: '#f59e0b',
    expert: '#ef4444'
  };
  return colors[level.toLowerCase()] || colors.beginner;
};

export const getLevelNumber = (level: string): number => {
  const numbers: Record<string, number> = {
    beginner: 3,
    intermediate: 5,
    advanced: 7,
    expert: 9
  };
  return numbers[level.toLowerCase()] || 3;
};

export const assessmentQuestions: AssessmentQuestionsMap = {
  'Prompt Engineering': [
    { question: 'How often do you write prompts for AI tools?', options: ['Never', 'Occasionally', 'Regularly', 'Daily'] },
    { question: 'Can you effectively use system prompts and context?', options: ['No', 'Basic understanding', 'Comfortable', 'Expert'] },
  ],
  'AI-Assisted Coding': [
    { question: 'How familiar are you with GitHub Copilot or similar tools?', options: ['Never used', 'Tried once', 'Use occasionally', 'Use daily'] },
    { question: 'Can you effectively refine AI code suggestions?', options: ['No', 'Sometimes', 'Usually', 'Always'] },
  ],
  'default': [
    { question: 'How would you rate your knowledge in this area?', options: ['Beginner', 'Some experience', 'Proficient', 'Expert'] },
    { question: 'How often do you apply this skill?', options: ['Never', 'Occasionally', 'Regularly', 'Daily'] },
  ]
};

export const studyMaterials: StudyMaterialsMap = {
  'Prompt Engineering': [
    { title: 'Prompt Engineering Guide', url: 'https://www.promptingguide.ai/', type: 'Guide' },
    { title: 'OpenAI Prompt Best Practices', url: 'https://platform.openai.com/docs/guides/prompting', type: 'Documentation' },
    { title: 'Learn Prompting Course', url: 'https://learnprompting.org/', type: 'Course' },
  ],
  'AI-Assisted Coding': [
    { title: 'GitHub Copilot Documentation', url: 'https://docs.github.com/copilot', type: 'Documentation' },
    { title: 'AI Pair Programming Guide', url: 'https://github.blog/ai-and-ml/', type: 'Blog' },
  ],
  'LLM APIs': [
    { title: 'OpenAI API Documentation', url: 'https://platform.openai.com/docs', type: 'Documentation' },
    { title: 'Anthropic Claude Guide', url: 'https://docs.anthropic.com/', type: 'Documentation' },
  ],
  'default': [
    { title: 'AI Fundamentals Course', url: 'https://www.coursera.org/learn/ai-for-everyone', type: 'Course' },
    { title: 'Google AI Education', url: 'https://ai.google/education/', type: 'Learning Hub' },
  ]
};
