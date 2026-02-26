'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

const STORAGE_KEY = 'resumeBuilderData';
const TEMPLATE_KEY = 'resumeBuilderTemplate';

export type TemplateType = 'classic' | 'modern' | 'minimal';

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
}

export interface Links {
  github: string;
  linkedin: string;
  website: string;
}

export interface CategorizedSkills {
  technical: string[];
  soft: string[];
  tools: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: CategorizedSkills;
  links: Links;
}

const defaultResumeData: ResumeData = {
  personalInfo: {
    name: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: {
    technical: [],
    soft: [],
    tools: [],
  },
  links: {
    github: '',
    linkedin: '',
    website: '',
  },
};

const sampleResumeData: ResumeData = {
  personalInfo: {
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
  },
  summary: 'Software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, user experience, and mentoring junior developers.',
  education: [
    {
      id: '1',
      school: 'Stanford University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015',
      endDate: '2019',
    },
  ],
  experience: [
    {
      id: '1',
      company: 'TechCorp Inc.',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021',
      endDate: 'Present',
      description: 'Led a team of 5 engineers to rebuild the core platform. Improved performance by 40% and reduced deployment time by 60%.',
    },
    {
      id: '2',
      company: 'StartupXYZ',
      title: 'Software Engineer',
      location: 'Palo Alto, CA',
      startDate: '2019',
      endDate: '2021',
      description: 'Built the customer dashboard from scratch using React and Node.js. Grew user base from 1K to 50K MAU.',
    },
  ],
  projects: [
    {
      id: '1',
      title: 'Open Source CLI Tool',
      description: 'A command-line tool for automating developer workflows with 10K+ GitHub stars.',
      techStack: ['TypeScript', 'Node.js'],
      githubUrl: 'github.com/alex/cli-tool',
    },
  ],
  skills: {
    technical: ['TypeScript', 'React', 'Node.js', 'Python', 'AWS'],
    soft: ['Team Leadership', 'Problem Solving'],
    tools: ['Git', 'Docker', 'PostgreSQL', 'GraphQL'],
  },
  links: {
    github: 'github.com/alexjohnson',
    linkedin: 'linkedin.com/in/alexjohnson',
    website: 'alexjohnson.dev',
  },
};

export interface ATSScore {
  score: number;
  maxScore: number;
  breakdown: {
    summary: number;
    projects: number;
    experience: number;
    skills: number;
    links: number;
    metrics: number;
    education: number;
  };
}

export interface Suggestion {
  id: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
}

interface ResumeContextType {
  resumeData: ResumeData;
  atsScore: ATSScore;
  suggestions: Suggestion[];
  template: TemplateType;
  setTemplate: (template: TemplateType) => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateSummary: (summary: string) => void;
  addEducation: (education: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addExperience: (experience: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  updateSkills: (category: keyof CategorizedSkills, skills: string[]) => void;
  addSkill: (category: keyof CategorizedSkills, skill: string) => void;
  removeSkill: (category: keyof CategorizedSkills, skill: string) => void;
  updateLinks: (links: Partial<Links>) => void;
  loadSampleData: () => void;
  clearData: () => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

// Helper function to calculate ATS Score
function calculateATSScore(data: ResumeData): ATSScore {
  const breakdown = {
    summary: 0,
    projects: 0,
    experience: 0,
    skills: 0,
    links: 0,
    metrics: 0,
    education: 0,
  };

  // +15 if summary length is 40-120 words
  const summaryWordCount = data.summary.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (summaryWordCount >= 40 && summaryWordCount <= 120) {
    breakdown.summary = 15;
  }

  // +10 if at least 2 projects
  if (data.projects.length >= 2) {
    breakdown.projects = 10;
  }

  // +10 if at least 1 experience entry
  if (data.experience.length >= 1) {
    breakdown.experience = 10;
  }

  // +10 if total skills across all categories >= 8 items
  const totalSkills = data.skills.technical.length + data.skills.soft.length + data.skills.tools.length;
  if (totalSkills >= 8) {
    breakdown.skills = 10;
  }

  // +10 if GitHub or LinkedIn link exists
  if (data.links.github || data.links.linkedin) {
    breakdown.links = 10;
  }

  // +15 if any experience/project bullet contains a number (%, X, k, etc.)
  const hasMetrics = [...data.experience, ...data.projects].some(item => {
    const text = 'description' in item ? item.description : '';
    return /\d|%|\b[kmb]\b/i.test(text);
  });
  if (hasMetrics) {
    breakdown.metrics = 15;
  }

  // +10 if education section has complete fields
  const hasCompleteEducation = data.education.some(edu => 
    edu.school && edu.degree && edu.field
  );
  if (hasCompleteEducation) {
    breakdown.education = 10;
  }

  const totalScore = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  
  return {
    score: Math.min(totalScore, 100),
    maxScore: 100,
    breakdown,
  };
}

// Helper function to generate suggestions
function generateSuggestions(data: ResumeData, score: ATSScore): Suggestion[] {
  const suggestions: Suggestion[] = [];

  if (score.breakdown.summary < 15) {
    suggestions.push({
      id: 'summary',
      message: 'Write a stronger summary (40–120 words).',
      priority: 'high',
    });
  }

  if (score.breakdown.projects < 10) {
    suggestions.push({
      id: 'projects',
      message: 'Add at least 2 projects.',
      priority: 'high',
    });
  }

  if (score.breakdown.metrics < 15) {
    suggestions.push({
      id: 'metrics',
      message: 'Add measurable impact (numbers) in bullets.',
      priority: 'high',
    });
  }

  if (score.breakdown.skills < 10) {
    suggestions.push({
      id: 'skills',
      message: 'Add more skills (target 8+).',
      priority: 'medium',
    });
  }

  if (score.breakdown.links < 10) {
    suggestions.push({
      id: 'links',
      message: 'Add GitHub or LinkedIn link.',
      priority: 'medium',
    });
  }

  if (score.breakdown.education < 10) {
    suggestions.push({
      id: 'education',
      message: 'Complete education section.',
      priority: 'low',
    });
  }

  return suggestions.slice(0, 3);
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [atsScore, setAtsScore] = useState<ATSScore>(calculateATSScore(defaultResumeData));
  const [suggestions, setSuggestions] = useState<Suggestion[]>(generateSuggestions(defaultResumeData, calculateATSScore(defaultResumeData)));
  const [template, setTemplateState] = useState<TemplateType>('classic');

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedTemplate = localStorage.getItem(TEMPLATE_KEY);
      
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setResumeData(parsed);
          const score = calculateATSScore(parsed);
          setAtsScore(score);
          setSuggestions(generateSuggestions(parsed, score));
        } catch (e) {
          console.error('Failed to parse stored resume data:', e);
        }
      }
      
      if (storedTemplate) {
        setTemplateState(storedTemplate as TemplateType);
      }
    }
  }, []);

  const setTemplate = useCallback((newTemplate: TemplateType) => {
    setTemplateState(newTemplate);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TEMPLATE_KEY, newTemplate);
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
      const score = calculateATSScore(resumeData);
      setAtsScore(score);
      setSuggestions(generateSuggestions(resumeData, score));
    }
  }, [resumeData]);

  const updatePersonalInfo = (info: Partial<PersonalInfo>) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...info },
    }));
  };

  const updateSummary = (summary: string) => {
    setResumeData((prev) => ({ ...prev, summary }));
  };

  const addEducation = (education: Omit<Education, 'id'>) => {
    const newEducation = { ...education, id: Date.now().toString() };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  };

  const updateEducation = (id: string, education: Partial<Education>) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, ...education } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addExperience = (experience: Omit<Experience, 'id'>) => {
    const newExperience = { ...experience, id: Date.now().toString() };
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExperience],
    }));
  };

  const updateExperience = (id: string, experience: Partial<Experience>) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, ...experience } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now().toString() };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) =>
        proj.id === id ? { ...proj, ...project } : proj
      ),
    }));
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id),
    }));
  };

  const updateSkills = (category: keyof CategorizedSkills, skills: string[]) => {
    setResumeData((prev) => ({
      ...prev,
      skills: { ...prev.skills, [category]: skills },
    }));
  };

  const addSkill = (category: keyof CategorizedSkills, skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], skill],
      },
    }));
  };

  const removeSkill = (category: keyof CategorizedSkills, skill: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((s) => s !== skill),
      },
    }));
  };

  const updateLinks = (links: Partial<Links>) => {
    setResumeData((prev) => ({
      ...prev,
      links: { ...prev.links, ...links },
    }));
  };

  const loadSampleData = useCallback(() => {
    setResumeData(sampleResumeData);
  }, []);

  const clearData = useCallback(() => {
    setResumeData(defaultResumeData);
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        atsScore,
        suggestions,
        template,
        setTemplate,
        updatePersonalInfo,
        updateSummary,
        addEducation,
        updateEducation,
        removeEducation,
        addExperience,
        updateExperience,
        removeExperience,
        addProject,
        updateProject,
        removeProject,
        updateSkills,
        addSkill,
        removeSkill,
        updateLinks,
        loadSampleData,
        clearData,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
