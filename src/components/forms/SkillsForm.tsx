'use client';

import { useState } from 'react';
import { useResume, CategorizedSkills } from '@/context/resume-context';
import { X, Sparkles, Loader2 } from 'lucide-react';

interface SkillCategoryProps {
  title: string;
  category: keyof CategorizedSkills;
  skills: string[];
  onAddSkill: (category: keyof CategorizedSkills, skill: string) => void;
  onRemoveSkill: (category: keyof CategorizedSkills, skill: string) => void;
}

function SkillCategory({ title, category, skills, onAddSkill, onRemoveSkill }: SkillCategoryProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const skill = inputValue.trim();
      if (skill && !skills.includes(skill)) {
        onAddSkill(category, skill);
        setInputValue('');
      }
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-slate-700">
        {title} ({skills.length})
      </h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
          >
            {skill}
            <button
              onClick={() => onRemoveSkill(category, skill)}
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
        placeholder={`Add ${title.toLowerCase()}...`}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
      />
    </div>
  );
}

const SUGGESTED_SKILLS = {
  technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
  soft: ['Team Leadership', 'Problem Solving'],
  tools: ['Git', 'Docker', 'AWS'],
};

export default function SkillsForm() {
  const { resumeData, addSkill, removeSkill } = useResume();
  const [isSuggesting, setIsSuggesting] = useState(false);

  const handleSuggestSkills = () => {
    setIsSuggesting(true);
    setTimeout(() => {
      SUGGESTED_SKILLS.technical.forEach((skill) => {
        if (!resumeData.skills.technical.includes(skill)) {
          addSkill('technical', skill);
        }
      });
      SUGGESTED_SKILLS.soft.forEach((skill) => {
        if (!resumeData.skills.soft.includes(skill)) {
          addSkill('soft', skill);
        }
      });
      SUGGESTED_SKILLS.tools.forEach((skill) => {
        if (!resumeData.skills.tools.includes(skill)) {
          addSkill('tools', skill);
        }
      });
      setIsSuggesting(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-900 uppercase tracking-wide">Skills</h3>
        <button
          onClick={handleSuggestSkills}
          disabled={isSuggesting}
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 disabled:opacity-50"
        >
          {isSuggesting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isSuggesting ? 'Loading...' : 'Suggest Skills'}
        </button>
      </div>

      <div className="space-y-6">
        <SkillCategory
          title="Technical Skills"
          category="technical"
          skills={resumeData.skills.technical}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
        />

        <SkillCategory
          title="Soft Skills"
          category="soft"
          skills={resumeData.skills.soft}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
        />

        <SkillCategory
          title="Tools & Technologies"
          category="tools"
          skills={resumeData.skills.tools}
          onAddSkill={addSkill}
          onRemoveSkill={removeSkill}
        />
      </div>
    </div>
  );
}
