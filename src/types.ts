export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'cloud'
  | 'ai'
  | 'devops'
  | 'mobile'
  | 'soft'
  | 'design'
  | 'tools';

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1 to 5 (1: Beginner, 2: Elementary, 3: Intermediate, 4: Advanced, 5: Expert)
  verifiedBy?: 'github' | 'resume' | 'manual' | 'quiz' | 'project';
}

export interface UserProject {
  id: string;
  title: string;
  techStack: string[];
  description: string;
  repoUrl?: string;
  liveUrl?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  title: string; // e.g. "Computer Science Undergraduate"
  education: string; // e.g. "B.S. in Computer Science (2025)"
  experienceYears: number;
  targetRole: string; // e.g. "Full Stack Developer"
  skills: SkillItem[];
  softSkills: string[];
  projects: UserProject[];
  certifications: string[];
  interests: string[];
  githubUsername?: string;
  bio?: string;
  resumeText?: string;
  lastUpdated: string;
}

export interface CareerMatch {
  roleId: string;
  roleTitle: string;
  category: string;
  matchPercentage: number;
  readinessScore: number;
  demandLevel: 'High' | 'Very High' | 'Extreme' | 'Moderate';
  salaryRange: {
    min: number;
    max: number;
    currency: string;
  };
  keySkillsPresent: string[];
  keySkillsMissing: string[];
  rationale: string;
  careerGrowthOutlook: string;
  recommendedForUser?: boolean;
}

export interface MissingSkill {
  name: string;
  importance: 'Critical' | 'Important' | 'Optional';
  reason: string;
  category: SkillCategory;
  estimatedHoursToMaster: number;
}

export interface SkillGapAnalysis {
  targetRole: string;
  currentMatchPercent: number;
  readinessScore: number;
  missingCoreSkills: MissingSkill[];
  missingSoftSkills: string[];
  strengthsToLeverage: string[];
  topActionableAdvice: string[];
}

export interface CourseResource {
  title: string;
  platform: string;
  link?: string;
  free: boolean;
  type: 'Course' | 'Documentation' | 'Video' | 'Interactive';
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  phaseName: string;
  phaseNumber: number;
  estimatedWeeks: number;
  status: 'completed' | 'in_progress' | 'not_started';
  skillsToGain: string[];
  courses: CourseResource[];
  handsonProject: {
    title: string;
    description: string;
    keyDeliverables: string[];
  };
  codingChallenges: string[];
  certRecommendations?: string[];
}

export interface CareerRoadmap {
  targetRole: string;
  totalWeeks: number;
  milestones: RoadmapMilestone[];
  overallProgressPercentage: number;
  lastAiUpdate?: string;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  targetRole: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  techStack: string[];
  keyFeatures: string[];
  portfolioImpactReason: string;
  resumeBulletSuggestions: string[];
}

export interface BulletEnhancement {
  original: string;
  improved: string;
  rationale: string;
}

export interface ResumeAnalysisResult {
  overallScore: number;
  matchScoreForTargetRole: number;
  strengths: string[];
  weakPoints: string[];
  extractedSkills: string[];
  missingKeywords: string[];
  bulletPointEnhancements: BulletEnhancement[];
  actionPlan: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
}

export type ActiveTab =
  | 'dashboard'
  | 'career_match'
  | 'skill_gap'
  | 'roadmap'
  | 'projects'
  | 'resume'
  | 'mentor_chat';
