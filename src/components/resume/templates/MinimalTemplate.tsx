'use client';

import { ResumeData } from '@/context/resume-context';

interface MinimalTemplateProps {
  data: ResumeData;
}

export default function MinimalTemplate({ data }: MinimalTemplateProps) {
  const { personalInfo, summary, education, experience, projects, skills, links } = data;

  return (
    <div className="bg-white p-8 min-h-full">
      {/* Header - Minimal */}
      <div className="mb-8">
        {personalInfo.name && (
          <h1 className="text-2xl font-normal text-black">
            {personalInfo.name}
          </h1>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
          {links.github && (
            <a href={`https://${links.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-black">
              {links.github}
            </a>
          )}
          {links.linkedin && (
            <a href={`https://${links.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:text-black">
              {links.linkedin}
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs text-slate-400 uppercase tracking-widest mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid-page">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-black text-sm">{exp.title}</h3>
                  <span className="text-xs text-slate-400">
                    {exp.startDate}–{exp.endDate}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {exp.company}{exp.location && `, ${exp.location}`}
                </div>
                {exp.description && (
                  <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs text-slate-400 uppercase tracking-widest mb-3">Education</h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid-page">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-black text-sm">{edu.school}</h3>
                  <span className="text-xs text-slate-400">
                    {edu.startDate}–{edu.endDate}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {edu.degree}{edu.field && `, ${edu.field}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xs text-slate-400 uppercase tracking-widest mb-3">Projects</h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid-page">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-medium text-black text-sm">{proj.title}</h3>
                  <div className="flex gap-2">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-black">
                        Live
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-black">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                {proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="text-xs text-slate-500">{tech}</span>
                    ))}
                  </div>
                )}
                {proj.description && (
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0) && (
        <div>
          <h2 className="text-xs text-slate-400 uppercase tracking-widest mb-2">Skills</h2>
          <div className="space-y-1.5">
            {skills.technical.length > 0 && (
              <p className="text-sm text-slate-600">
                <span className="text-slate-400">Technical: </span>
                {skills.technical.join(' • ')}
              </p>
            )}
            {skills.soft.length > 0 && (
              <p className="text-sm text-slate-600">
                <span className="text-slate-400">Soft: </span>
                {skills.soft.join(' • ')}
              </p>
            )}
            {skills.tools.length > 0 && (
              <p className="text-sm text-slate-600">
                <span className="text-slate-400">Tools: </span>
                {skills.tools.join(' • ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
