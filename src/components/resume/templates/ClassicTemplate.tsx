'use client';

import { ResumeData } from '@/context/resume-context';

interface ClassicTemplateProps {
  data: ResumeData;
}

export default function ClassicTemplate({ data }: ClassicTemplateProps) {
  const { personalInfo, summary, education, experience, projects, skills, links } = data;

  return (
    <div className="bg-white p-8 min-h-full">
      {/* Header */}
      <div className="border-b-2 border-black pb-4 mb-4">
        {personalInfo.name && (
          <h1 className="text-3xl font-bold text-black uppercase tracking-wide">
            {personalInfo.name}
          </h1>
        )}
        <div className="flex flex-wrap gap-3 mt-2 text-sm text-slate-700">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {personalInfo.location && <span>• {personalInfo.location}</span>}
        </div>
        <div className="flex flex-wrap gap-3 mt-1 text-sm">
          {links.github && (
            <a href={`https://${links.github}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-black">
              {links.github}
            </a>
          )}
          {links.linkedin && (
            <a href={`https://${links.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-black">
              {links.linkedin}
            </a>
          )}
          {links.website && (
            <a href={`https://${links.website}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-black">
              {links.website}
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
            Summary
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
            Experience
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="break-inside-avoid-page">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-black">{exp.title}</h3>
                  <span className="text-sm text-slate-600">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                <div className="text-sm text-slate-700">
                  {exp.company}{exp.location && `, ${exp.location}`}
                </div>
                {exp.description && (
                  <p className="text-sm text-slate-800 mt-1 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id} className="break-inside-avoid-page">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-black">{edu.school}</h3>
                  <span className="text-sm text-slate-600">
                    {edu.startDate} - {edu.endDate}
                  </span>
                </div>
                <div className="text-sm text-slate-700">
                  {edu.degree}{edu.field && `, ${edu.field}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-bold text-black uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
            Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="break-inside-avoid-page">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-black">{proj.title}</h3>
                  <div className="flex gap-2">
                    {proj.liveUrl && (
                      <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-black">
                        Live
                      </a>
                    )}
                    {proj.githubUrl && (
                      <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-black">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
                {proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {proj.description && (
                  <p className="text-sm text-slate-800 mt-2 leading-relaxed">{proj.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {(skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0) && (
        <div>
          <h2 className="text-sm font-bold text-black uppercase tracking-wider border-b border-slate-300 pb-1 mb-2">
            Skills
          </h2>
          <div className="space-y-2">
            {skills.technical.length > 0 && (
              <div>
                <span className="text-xs text-slate-500 uppercase">Technical: </span>
                <span className="text-sm text-slate-800">{skills.technical.join(', ')}</span>
              </div>
            )}
            {skills.soft.length > 0 && (
              <div>
                <span className="text-xs text-slate-500 uppercase">Soft Skills: </span>
                <span className="text-sm text-slate-800">{skills.soft.join(', ')}</span>
              </div>
            )}
            {skills.tools.length > 0 && (
              <div>
                <span className="text-xs text-slate-500 uppercase">Tools: </span>
                <span className="text-sm text-slate-800">{skills.tools.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
