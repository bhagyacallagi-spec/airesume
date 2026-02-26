'use client';

import { useState, useMemo } from 'react';
import { useResume } from '@/context/resume-context';
import Link from 'next/link';
import { ArrowLeft, Printer, Copy, AlertCircle, Check } from 'lucide-react';
import TemplateSelector from '@/components/resume/TemplateSelector';
import ClassicTemplate from '@/components/resume/templates/ClassicTemplate';
import ModernTemplate from '@/components/resume/templates/ModernTemplate';
import MinimalTemplate from '@/components/resume/templates/MinimalTemplate';
import { generatePlainTextResume, validateResumeForExport, copyToClipboard, triggerPrint } from '@/lib/export-utils';

export default function PreviewPage() {
  const { resumeData, template } = useResume();
  const { personalInfo, summary, education, experience, projects, skills, links } = resumeData;
  
  const [copied, setCopied] = useState(false);
  
  const validation = useMemo(() => validateResumeForExport(resumeData), [resumeData]);
  
  const handleCopyText = async () => {
    const text = generatePlainTextResume(resumeData);
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handlePrint = () => {
    triggerPrint();
  };

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* Top Bar - Hidden in print */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-40 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/builder"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Builder</span>
          </Link>
          <h1 className="text-lg font-medium text-slate-900">Resume Preview</h1>
          <div className="w-32">
            <TemplateSelector />
          </div>
        </div>
      </div>
      
      {/* Export Bar - Hidden in print */}
      <div className="bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!validation.isValid && (
              <div className="flex items-center gap-2 text-amber-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Your resume may look incomplete.</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy as Text'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* Resume Display */}
      <div className="max-w-4xl mx-auto px-6 py-8 print:p-0 print:max-w-none">
        <div className="bg-white shadow-xl min-h-[800px] print:shadow-none print:min-h-0">
          {template === 'modern' && <ModernTemplate data={resumeData} />}
          {template === 'minimal' && <MinimalTemplate data={resumeData} />}
          {(template === 'classic' || !template) && (
            <div className="p-12 max-w-3xl mx-auto">
            {/* Header */}
            <div className="border-b-2 border-black pb-6 mb-6">
              {personalInfo.name ? (
                <h1 className="text-4xl font-bold text-black uppercase tracking-wider">
                  {personalInfo.name}
                </h1>
              ) : (
                <h1 className="text-4xl font-bold text-black uppercase tracking-wider">
                  Your Name
                </h1>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-700">
                {personalInfo.email && <span>{personalInfo.email}</span>}
                {personalInfo.phone && <span className="text-slate-400">|</span>}
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.location && <span className="text-slate-400">|</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
              </div>
              <div className="flex flex-wrap gap-4 mt-2 text-sm">
                {links.github && (
                  <>
                    <a href={`https://${links.github}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-black">
                      {links.github}
                    </a>
                  </>
                )}
                {links.linkedin && (
                  <>
                    <span className="text-slate-400">|</span>
                    <a href={`https://${links.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-black">
                      {links.linkedin}
                    </a>
                  </>
                )}
                {links.website && (
                  <>
                    <span className="text-slate-400">|</span>
                    <a href={`https://${links.website}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-black">
                      {links.website}
                    </a>
                  </>
                )}
              </div>
            </div>

            {/* Summary */}
            {(summary || personalInfo.name === '') && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-slate-300 pb-2 mb-3">
                  Summary
                </h2>
                <p className="text-sm text-slate-800 leading-relaxed">
                  {summary || 'A brief overview of your professional background and key strengths goes here.'}
                </p>
              </div>
            )}

            {/* Experience */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-slate-300 pb-2 mb-4">
                Experience
              </h2>
              {experience.length > 0 ? (
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-black text-base">{exp.title}</h3>
                        <span className="text-sm text-slate-600 font-medium">
                          {exp.startDate} - {exp.endDate}
                        </span>
                      </div>
                      <div className="text-sm text-slate-700 mt-0.5">
                        {exp.company}{exp.location && `, ${exp.location}`}
                      </div>
                      {exp.description && (
                        <p className="text-sm text-slate-800 mt-2 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-black text-base">Job Title</h3>
                      <span className="text-sm text-slate-600 font-medium">Start - End</span>
                    </div>
                    <div className="text-sm text-slate-700 mt-0.5">Company Name, Location</div>
                    <p className="text-sm text-slate-800 mt-2 leading-relaxed">
                      Description of your role and key achievements goes here.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Education */}
            <div className="mb-6">
              <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-slate-300 pb-2 mb-4">
                Education
              </h2>
              {education.length > 0 ? (
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-semibold text-black">{edu.school}</h3>
                        <span className="text-sm text-slate-600 font-medium">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                      <div className="text-sm text-slate-700">
                        {edu.degree}{edu.field && `, ${edu.field}`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-black">University Name</h3>
                    <span className="text-sm text-slate-600 font-medium">Start - End</span>
                  </div>
                  <div className="text-sm text-slate-700">Degree, Field of Study</div>
                </div>
              )}
            </div>

            {/* Projects */}
            {projects.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-slate-300 pb-2 mb-4">
                  Projects
                </h2>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id}>
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
            <div>
              <h2 className="text-sm font-bold text-black uppercase tracking-widest border-b border-slate-300 pb-2 mb-3">
                Skills
              </h2>
              {(skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0) ? (
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
              ) : (
                <p className="text-sm text-slate-800">List your key skills here, separated by commas</p>
              )}
            </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            margin: 0.5in;
            size: auto;
          }
          
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:p-0 {
            padding: 0 !important;
          }
          
          .print\\:max-w-none {
            max-width: none !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:min-h-0 {
            min-height: 0 !important;
          }
          
          .print\\:bg-white {
            background-color: white !important;
          }
          
          /* Ensure sections don't break awkwardly */
          .bg-white > div > div {
            break-inside: avoid;
          }
          
          /* Keep project/experience entries together */
          .space-y-3 > div,
          .space-y-4 > div {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          /* Ensure consistent spacing */
          * {
            color: black !important;
          }
          
          /* Remove colored accents */
          .text-slate-400,
          .text-slate-500,
          .text-slate-600 {
            color: #666 !important;
          }
          
          .text-slate-700,
          .text-slate-800 {
            color: #333 !important;
          }
          
          /* Links should show URL or be black */
          a {
            color: black !important;
            text-decoration: none !important;
          }
          
          /* Background colors to white/light gray */
          .bg-slate-100 {
            background-color: #f5f5f5 !important;
          }
          
          /* Border colors to gray */
          .border-slate-200,
          .border-slate-300 {
            border-color: #ccc !important;
          }
        }
      `}</style>
    </div>
  );
}
