/**
 * Assessment Type Definitions
 */

export interface Message {
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

export interface SkillScore {
  score: number;
  skillName: string;
  name: string;
  level: string;
  description: string;
}

export interface LearningResource {
  title: string;
  url: string;
  type: string;
  duration?: string;
}

export interface WeeklyTask {
  skill: string;
  task: string;
  resources: LearningResource[];
}

export interface UpskillWeek {
  week: number;
  tasks: WeeklyTask[];
}
