// =============================================================================
// project.model.ts — Project data models
// =============================================================================

export type GitSource = 'github' | 'gitlab' | 'both' | 'manual';

export interface Project {
  id: string;
  name: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  homepage?: string;
  technologies: string[];
  category: string;
  language?: string;
  stars: number;
  forks: number;
  source: GitSource;
  githubUrl?: string;
  gitlabUrl?: string;
  featured: boolean;
  pinned: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  year?: number;
  role?: string;
  company?: string;
  highlights?: string[];
  topics?: string[];
  license?: string;
  hasDemo: boolean;
}

export interface PinnedProject {
  name: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string | null;
  featured: boolean;
  pinned: boolean;
  order: number;
  technologies: string[];
  category: string;
  highlights?: string[];
  year?: number;
  role?: string;
  company?: string;
}

export interface ProjectFilter {
  search: string;
  category: string;
  language: string;
  source: string;
  featured: boolean | null;
}

export interface ProjectStats {
  total: number;
  github: number;
  gitlab: number;
  featured: number;
  categories: Record<string, number>;
  languages: Record<string, number>;
}
