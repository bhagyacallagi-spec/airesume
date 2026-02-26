'use client';

import { useResume } from '@/context/resume-context';
import ClassicTemplate from './templates/ClassicTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalTemplate from './templates/MinimalTemplate';

export default function ResumePreview() {
  const { resumeData, template } = useResume();
  const { personalInfo, summary, education, experience, projects, skills } = resumeData;

  const hasAnyContent = 
    personalInfo.name || 
    personalInfo.email || 
    summary || 
    education.length > 0 || 
    experience.length > 0 ||
    projects.length > 0 ||
    skills.technical.length > 0 ||
    skills.soft.length > 0 ||
    skills.tools.length > 0;

  if (!hasAnyContent) {
    return (
      <div className="h-full flex items-center justify-center text-slate-400 min-h-[600px]">
        <div className="text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">Start filling out the form to see your resume preview</p>
        </div>
      </div>
    );
  }

  // Render selected template
  switch (template) {
    case 'modern':
      return <ModernTemplate data={resumeData} />;
    case 'minimal':
      return <MinimalTemplate data={resumeData} />;
    case 'classic':
    default:
      return <ClassicTemplate data={resumeData} />;
  }
}
