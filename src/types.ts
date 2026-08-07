export interface Project {
  id: string;
  title: string;
  description: string;
  extendedDescription: string;
  category: 'systems' | 'web' | 'ai' | 'tools';
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface Skill {
  name: string;
  category: 'languages' | 'frontend' | 'backend' | 'systems';
  level: number; // 1 to 5
  description: string;
  iconName: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  institution: string;
  description: string;
  type: 'education' | 'experience' | 'milestone';
}
