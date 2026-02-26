'use client';

import { useResume } from '@/context/resume-context';
import { ArrowUp, Lightbulb } from 'lucide-react';

export default function ImprovementPanel() {
  const { resumeData, atsScore } = useResume();
  const { summary, experience, projects, skills } = resumeData;

  const improvements: { message: string; priority: number }[] = [];

  // Check projects count
  if (projects.length < 2) {
    improvements.push({
      message: 'Add at least 2 projects to strengthen your portfolio.',
      priority: 1,
    });
  }

  // Check for metrics in descriptions
  const hasMetrics = [...experience, ...projects].some(item => {
    const text = 'description' in item ? item.description : '';
    return /\d|%|\b[kmb]\b/i.test(text);
  });
  if (!hasMetrics) {
    improvements.push({
      message: 'Add measurable impact with numbers in your bullet points.',
      priority: 2,
    });
  }

  // Check summary length
  const summaryWordCount = summary.trim().split(/\s+/).filter(w => w.length > 0).length;
  if (summaryWordCount < 40) {
    improvements.push({
      message: 'Expand your summary to 40–120 words for better impact.',
      priority: 3,
    });
  }

  // Check skills count
  const totalSkills = skills.technical.length + skills.soft.length + skills.tools.length;
  if (totalSkills < 8) {
    improvements.push({
      message: 'Add more skills (target 8+) to improve ATS matching.',
      priority: 4,
    });
  }

  // Check experience
  if (experience.length === 0) {
    improvements.push({
      message: 'Add work experience or internship/project work.',
      priority: 5,
    });
  }

  // Sort by priority and take top 3
  const topImprovements = improvements
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  if (topImprovements.length === 0) {
    return (
      <div className="bg-green-50 rounded-xl border border-green-200 p-4">
        <div className="flex items-center gap-2 text-green-700">
          <ArrowUp className="w-5 h-5" />
          <span className="font-medium text-sm">Your resume is well-optimized!</span>
        </div>
        <p className="text-xs text-green-600 mt-1">
          Score: {atsScore.score}/100 - Keep up the good work.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-medium text-slate-900">Top 3 Improvements</h3>
      </div>
      <ul className="space-y-2">
        {topImprovements.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-slate-700">
            <span className="flex-shrink-0 w-5 h-5 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-xs font-medium">
              {index + 1}
            </span>
            <span>{item.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
