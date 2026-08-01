import React, { useState } from 'react';
import { CareerRoadmap, UserProfile } from '../types';
import {
  Map,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ExternalLink,
  Code2,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';

interface RoadmapViewProps {
  roadmap: CareerRoadmap;
  userProfile: UserProfile;
  onToggleMilestoneStatus: (milestoneId: string) => void;
  onRegenerateRoadmap: () => void;
  isRegenerating: boolean;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  userProfile,
  onToggleMilestoneStatus,
  onRegenerateRoadmap,
  isRegenerating,
}) => {
  const [expandedMilestones, setExpandedMilestones] = useState<Record<string, boolean>>({
    m1: true,
    m2: true,
  });

  const toggleExpand = (id: string) => {
    setExpandedMilestones(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = roadmap.milestones.filter(m => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / (roadmap.milestones.length || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <Map className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Personalized Career Learning Roadmap</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Structured 12-week milestone roadmap custom generated for <span className="font-bold text-slate-800">{userProfile.targetRole}</span>.
          </p>
        </div>

        {/* Regenerate AI Button */}
        <button
          onClick={onRegenerateRoadmap}
          disabled={isRegenerating}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Generating AI Roadmap...' : 'Regenerate with AI'}</span>
        </button>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">Roadmap Completion</span>
            <h3 className="text-2xl font-extrabold text-white mt-0.5">{progressPercent}% Mastered</h3>
          </div>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-bold">
            {completedCount} of {roadmap.milestones.length} Phases Completed
          </span>
        </div>

        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <p className="text-xs text-slate-400">
          Checking off completed phases dynamically recalculates your real-time Job Readiness Score across the platform.
        </p>
      </div>

      {/* Milestones Timeline */}
      <div className="space-y-6">
        {roadmap.milestones.map((milestone) => {
          const isCompleted = milestone.status === 'completed';
          const isInProgress = milestone.status === 'in_progress';
          const isExpanded = !!expandedMilestones[milestone.id];

          return (
            <div
              key={milestone.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isCompleted
                  ? 'border-emerald-200 shadow-2xs bg-emerald-50/10'
                  : isInProgress
                  ? 'border-blue-300 ring-1 ring-blue-500/20 shadow-xs'
                  : 'border-slate-200'
              }`}
            >
              {/* Milestone Header */}
              <div className="p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer" onClick={() => toggleExpand(milestone.id)}>
                <div className="flex items-start gap-3 sm:gap-4 flex-1">
                  {/* Status Check Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleMilestoneStatus(milestone.id);
                    }}
                    className="mt-0.5 transition-transform active:scale-90"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : isInProgress ? (
                      <Circle className="w-6 h-6 text-blue-600 stroke-[2.5]" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                        {milestone.phaseName}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" /> {milestone.estimatedWeeks} Weeks
                      </span>
                    </div>

                    <h3 className={`text-base sm:text-lg font-bold mt-1 ${isCompleted ? 'text-slate-700 line-through' : 'text-slate-900'}`}>
                      {milestone.title}
                    </h3>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`hidden sm:inline-block px-2.5 py-1 text-xs font-bold rounded-full ${
                    isCompleted ? 'bg-emerald-50 text-emerald-700' : isInProgress ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Milestone Details (Expandable) */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-5">
                  {/* Skills to gain */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Key Competencies Mastered in this Phase
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {milestone.skillsToGain.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Courses & Docs */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
                      Curated Free Learning Resources
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {milestone.courses.map((course, idx) => (
                        <a
                          key={idx}
                          href={course.link || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-white border border-slate-200 rounded-xl hover:border-blue-400 transition-colors flex items-center justify-between group"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors block">
                              {course.title}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {course.platform} • {course.free ? 'Free' : 'Premium'} ({course.type})
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Hands-on Project Deliverables */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                      <Code2 className="w-4 h-4" /> Phase Hands-on Deliverable
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">{milestone.handsonProject.title}</h4>
                    <p className="text-xs text-slate-600">{milestone.handsonProject.description}</p>
                    <ul className="text-xs text-slate-700 space-y-1 pt-1">
                      {milestone.handsonProject.keyDeliverables.map((deliv, dIdx) => (
                        <li key={dIdx} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
