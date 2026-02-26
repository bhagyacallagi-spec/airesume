'use client';

import { ResumeData } from '@/context/resume-context';

interface ModernTemplateProps {
  data: ResumeData;
}

export default function ModernTemplate({ data }: ModernTemplateProps) {
  const { personalInfo, summary, education, experience, projects, skills, links } = data;

  return (
    <div className="bg-white p-8 min-h-full">
      {/* Header - Centered */}
      <div className="text-center border-b border-slate-200 pb-6 mb-6">
        {personalInfo.name && (
          <h1 className="text-4xl font-light text-black tracking-tight">
            {personalInfo.name}
          </h1>
        )}
        <div className="flex flex-wrap justify-center gap-4 mt-3 text-sm text-slate-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm">
          {links.github && (
            <a href={`https://${links.github}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-black">
              {links.github}
            </a>
          )}
          {links.linkedin && (
            <a href={`https://${links.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-black">
              {links.linkedin}
            </a>
          )}
          {links.website && (
            <a href={`https://${links.website}`} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-black">
              {links.website}
            </a>
          )}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex gap-8">
        {/* Left Column */}
        <div className="w-2/3 space-y-5">
          {/* Summary */}
          {summary && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                About
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-2 border-slate-200 pl-4 break-inside-avoid-page">
                    <h3 className="font-semibold text-black">{exp.title}</h3>
                    <div className="text-sm text-slate-600">
                      {exp.company}{exp.location && ` • ${exp.location}`}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {exp.startDate} - {exp.endDate}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-slate-700 mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((proj) => (
                  <div key={proj.id} className="border-l-2 border-slate-200 pl-4 break-inside-avoid-page">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-black">{proj.title}</h3>
                      <div className="flex gap-2">
                        {proj.liveUrl && (
                          <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-black">
                            Live ↗
                          </a>
                        )}
                        {proj.githubUrl && (
                          <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-black">
                            GitHub ↗
                          </a>
                        )}
                      </div>
                    </div>
                    {proj.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.techStack.map((tech) => (
                          <span key={tech} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {proj.description && (
                      <p className="text-sm text-slate-700 mt-2 leading-relaxed">{proj.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-1/3 space-y-5">
          {/* Skills */}
          {(skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0) && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Skills
              </h2>
              <div className="space-y-2">
                {skills.technical.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Technical</span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.technical.map((skill) => (
                        <span key={skill} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.soft.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Soft Skills</span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.soft.map((skill) => (
                        <span key={skill} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {skills.tools.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Tools</span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.tools.map((skill) => (
                        <span key={skill} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="break-inside-avoid-page">
                    <h3 className="font-medium text-black text-sm">{edu.school}</h3>
                    <div className="text-xs text-slate-600">
                      {edu.degree}{edu.field && `, ${edu.field}`}
                    </div>
                    <div className="text-xs text-slate-400">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
