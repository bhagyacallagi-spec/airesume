'use client';

import { ResumeData } from '@/context/resume-context';

export function generatePlainTextResume(data: ResumeData): string {
  const { personalInfo, summary, education, experience, projects, skills, links } = data;
  
  const lines: string[] = [];
  
  // Name
  if (personalInfo.name) {
    lines.push(personalInfo.name);
    lines.push('');
  }
  
  // Contact
  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (links.github) contactParts.push(links.github);
  if (links.linkedin) contactParts.push(links.linkedin);
  if (links.website) contactParts.push(links.website);
  
  if (contactParts.length > 0) {
    lines.push(contactParts.join(' | '));
    lines.push('');
  }
  
  // Summary
  if (summary) {
    lines.push('SUMMARY');
    lines.push(summary);
    lines.push('');
  }
  
  // Experience
  if (experience.length > 0) {
    lines.push('EXPERIENCE');
    experience.forEach(exp => {
      lines.push(`${exp.title} | ${exp.company}${exp.location ? `, ${exp.location}` : ''}`);
      lines.push(`${exp.startDate} - ${exp.endDate}`);
      if (exp.description) {
        lines.push(exp.description);
      }
      lines.push('');
    });
  }
  
  // Education
  if (education.length > 0) {
    lines.push('EDUCATION');
    education.forEach(edu => {
      lines.push(`${edu.school} | ${edu.degree}${edu.field ? `, ${edu.field}` : ''}`);
      lines.push(`${edu.startDate} - ${edu.endDate}`);
      lines.push('');
    });
  }
  
  // Projects
  if (projects.length > 0) {
    lines.push('PROJECTS');
    projects.forEach(proj => {
      const links: string[] = [];
      if (proj.liveUrl) links.push(proj.liveUrl);
      if (proj.githubUrl) links.push(proj.githubUrl);
      lines.push(`${proj.title}${links.length > 0 ? ` | ${links.join(' | ')}` : ''}`);
      if (proj.techStack.length > 0) {
        lines.push(`Technologies: ${proj.techStack.join(', ')}`);
      }
      if (proj.description) {
        lines.push(proj.description);
      }
      lines.push('');
    });
  }
  
  // Skills
  const allSkills = [...skills.technical, ...skills.soft, ...skills.tools];
  if (allSkills.length > 0) {
    lines.push('SKILLS');
    if (skills.technical.length > 0) {
      lines.push(`Technical: ${skills.technical.join(', ')}`);
    }
    if (skills.soft.length > 0) {
      lines.push(`Soft Skills: ${skills.soft.join(', ')}`);
    }
    if (skills.tools.length > 0) {
      lines.push(`Tools: ${skills.tools.join(', ')}`);
    }
  }
  
  return lines.join('\n');
}

export function validateResumeForExport(data: ResumeData): {
  isValid: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  if (!data.personalInfo.name.trim()) {
    warnings.push('Name is missing');
  }
  
  if (data.experience.length === 0 && data.projects.length === 0) {
    warnings.push('No experience or projects added');
  }
  
  return {
    isValid: warnings.length === 0,
    warnings,
  };
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

export function triggerPrint(): void {
  window.print();
}
