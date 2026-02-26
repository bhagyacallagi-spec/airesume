'use client';

import { useState } from 'react';
import { useResume } from '@/context/resume-context';
import { Plus, X, ChevronDown, ChevronUp, AlertCircle, Link as LinkIcon, Github } from 'lucide-react';
import { getBulletGuidance } from '@/lib/bullet-guidance';

const MAX_DESCRIPTION_LENGTH = 200;

interface TechStackInputProps {
  techStack: string[];
  onChange: (techStack: string[]) => void;
}

function TechStackInput({ techStack, onChange }: TechStackInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tech = inputValue.trim();
      if (tech && !techStack.includes(tech)) {
        onChange([...techStack, tech]);
        setInputValue('');
      }
    }
  };

  const removeTech = (techToRemove: string) => {
    onChange(techStack.filter((tech) => tech !== techToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {techStack.map((tech) => (
          <span
            key={tech}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded"
          >
            {tech}
            <button
              onClick={() => removeTech(tech)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add technology and press Enter"
        className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
      />
    </div>
  );
}

export default function ProjectsForm() {
  const { resumeData, addProject, updateProject, removeProject } = useResume();
  const [isAdding, setIsAdding] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    techStack: [] as string[],
    liveUrl: '',
    githubUrl: '',
  });

  const handleAdd = () => {
    if (newProject.title) {
      addProject(newProject);
      setNewProject({ title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' });
      setIsAdding(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const descriptionCharCount = newProject.description.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide">Projects</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="space-y-3">
        {resumeData.projects.map((proj) => (
          <div key={proj.id} className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            {/* Header - Always visible */}
            <div
              className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-slate-100"
              onClick={() => toggleExpand(proj.id)}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-900">{proj.title}</span>
                <div className="flex gap-1.5">
                  {proj.liveUrl && <LinkIcon className="w-3.5 h-3.5 text-slate-400" />}
                  {proj.githubUrl && <Github className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeProject(proj.id);
                  }}
                  className="p-1 text-slate-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
                {expandedId === proj.id ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {expandedId === proj.id && (
              <div className="px-3 pb-3 space-y-3 border-t border-slate-200">
                <div className="pt-3 space-y-3">
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                    placeholder="Project Title"
                    className="w-full bg-white px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />

                  <div>
                    <textarea
                      value={proj.description}
                      onChange={(e) => {
                        if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                          updateProject(proj.id, { description: e.target.value });
                        }
                      }}
                      placeholder="Project description..."
                      rows={3}
                      className="w-full bg-white px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
                    />
                    <div className="flex justify-between mt-1">
                      {proj.description && getBulletGuidance(proj.description) && (
                        <div className="flex items-start gap-1.5 text-xs text-amber-600">
                          <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          <span>{getBulletGuidance(proj.description)}</span>
                        </div>
                      )}
                      <span className={`text-xs ${proj.description.length >= MAX_DESCRIPTION_LENGTH ? 'text-amber-600' : 'text-slate-400'}`}>
                        {proj.description.length}/{MAX_DESCRIPTION_LENGTH}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Tech Stack</label>
                    <TechStackInput
                      techStack={proj.techStack}
                      onChange={(techStack) => updateProject(proj.id, { techStack })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">Live URL (optional)</label>
                      <input
                        type="text"
                        value={proj.liveUrl || ''}
                        onChange={(e) => updateProject(proj.id, { liveUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-white px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">GitHub URL (optional)</label>
                      <input
                        type="text"
                        value={proj.githubUrl || ''}
                        onChange={(e) => updateProject(proj.id, { githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full bg-white px-2 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 space-y-3">
            <input
              type="text"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
              placeholder="Project Title"
              className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
            />

            <div>
              <textarea
                value={newProject.description}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                    setNewProject({ ...newProject, description: e.target.value });
                  }
                }}
                placeholder="Project description..."
                rows={3}
                className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none"
              />
              <div className="flex justify-between mt-1">
                {newProject.description && getBulletGuidance(newProject.description) && (
                  <div className="flex items-start gap-1.5 text-xs text-amber-600">
                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{getBulletGuidance(newProject.description)}</span>
                  </div>
                )}
                <span className={`text-xs ${descriptionCharCount >= MAX_DESCRIPTION_LENGTH ? 'text-amber-600' : 'text-slate-400'}`}>
                  {descriptionCharCount}/{MAX_DESCRIPTION_LENGTH}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block">Tech Stack</label>
              <TechStackInput
                techStack={newProject.techStack}
                onChange={(techStack) => setNewProject({ ...newProject, techStack })}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Live URL (optional)</label>
                <input
                  type="text"
                  value={newProject.liveUrl}
                  onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">GitHub URL (optional)</label>
                <input
                  type="text"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full px-2 py-1.5 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleAdd}
                className="px-3 py-1.5 bg-slate-900 text-white text-sm rounded hover:bg-slate-800"
              >
                Add Project
              </button>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setNewProject({ title: '', description: '', techStack: [], liveUrl: '', githubUrl: '' });
                }}
                className="px-3 py-1.5 text-slate-600 text-sm hover:text-slate-900"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
