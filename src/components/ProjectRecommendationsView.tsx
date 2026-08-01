import React, { useState } from 'react';
import { ProjectRecommendation, UserProfile } from '../types';
import { Code, Copy, Check, Sparkles, Layers, ArrowRight, RefreshCw } from 'lucide-react';

interface ProjectRecommendationsViewProps {
  projects: ProjectRecommendation[];
  userProfile: UserProfile;
  onGenerateCustomProjects: () => void;
  isGenerating: boolean;
}

export const ProjectRecommendationsView: React.FC<ProjectRecommendationsViewProps> = ({
  projects,
  userProfile,
  onGenerateCustomProjects,
  isGenerating,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [copiedBullet, setCopiedBullet] = useState<string | null>(null);

  const handleCopyBullet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBullet(text);
    setTimeout(() => setCopiedBullet(null), 2000);
  };

  const filteredProjects = projects.filter(
    p => selectedDifficulty === 'All' || p.difficulty === selectedDifficulty
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">AI Portfolio Project Recommendations</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Industry-aligned hands-on portfolio projects calculated to showcase missing technologies for{' '}
            <span className="font-bold text-slate-800">{userProfile.targetRole}</span>.
          </p>
        </div>

        <button
          onClick={onGenerateCustomProjects}
          disabled={isGenerating}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Generating Projects...' : 'Generate AI Projects'}</span>
        </button>
      </div>

      {/* Difficulty Filter */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-800">Filter by Complexity:</span>
        <div className="flex items-center gap-2">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(diff => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedDifficulty === diff
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 hover:border-slate-300 transition-colors"
          >
            {/* Title & Difficulty */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full ${
                      project.difficulty === 'Advanced'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : project.difficulty === 'Intermediate'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {project.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{project.description}</p>
              </div>
            </div>

            {/* Tech Stack Badges */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Recommended Tech Stack
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Deliverables & Architecture Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" /> Key Features to Engineer
                </span>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  {project.keyFeatures.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                <span className="text-xs font-bold text-blue-900 block flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Hiring Manager Portfolio Impact
                </span>
                <p className="text-xs text-blue-800 leading-relaxed">{project.portfolioImpactReason}</p>
              </div>
            </div>

            {/* STAR Resume Bullet Templates */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Copyable STAR Resume Bullet Points
              </span>
              <div className="space-y-2">
                {project.resumeBulletSuggestions.map((bullet, bIdx) => (
                  <div
                    key={bIdx}
                    className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs flex items-start justify-between gap-3 group"
                  >
                    <p className="font-mono leading-relaxed">{bullet}</p>
                    <button
                      onClick={() => handleCopyBullet(bullet)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors shrink-0"
                      title="Copy bullet point"
                    >
                      {copiedBullet === bullet ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
