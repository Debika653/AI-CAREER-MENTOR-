import React, { useState } from 'react';
import { SkillGapAnalysis, UserProfile, ActiveTab } from '../types';
import {
  BarChart2,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Zap,
  ArrowRight
} from 'lucide-react';

interface SkillGapViewProps {
  skillGap: SkillGapAnalysis;
  userProfile: UserProfile;
  setActiveTab: (tab: ActiveTab) => void;
  onAddSkillToProfile: (skillName: string, category: any) => void;
}

export const SkillGapView: React.FC<SkillGapViewProps> = ({
  skillGap,
  userProfile,
  setActiveTab,
  onAddSkillToProfile,
}) => {
  const [filterImportance, setFilterImportance] = useState<'All' | 'Critical' | 'Important'>('All');

  const filteredCoreGaps = skillGap.missingCoreSkills.filter((item) => {
    if (filterImportance === 'All') return true;
    return item.importance === filterImportance;
  });

  const totalHoursNeeded = skillGap.missingCoreSkills.reduce((acc, curr) => acc + curr.estimatedHoursToMaster, 0);

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Skill Gap Analysis System</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive breakdown of missing frameworks, technologies, and soft skills required for{' '}
            <span className="font-bold text-slate-800">{userProfile.targetRole}</span>.
          </p>
        </div>

        {/* Total Estimated Prep Hours */}
        <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="p-3 bg-amber-500 text-white rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Total Estimated Learning</span>
            <span className="text-xl font-extrabold text-slate-900">~{totalHoursNeeded} Hours</span>
            <span className="text-[10px] text-slate-500 block">Spread over 12 weeks</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <span className="text-xs font-bold text-slate-800">Filter Missing Core Skills:</span>
        <div className="flex items-center gap-2">
          {(['All', 'Critical', 'Important'] as const).map((imp) => (
            <button
              key={imp}
              onClick={() => setFilterImportance(imp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterImportance === imp
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {imp} Priority
            </button>
          ))}
        </div>
      </div>

      {/* Main Missing Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCoreGaps.map((skill, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md uppercase tracking-wider">
                    {skill.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{skill.name}</h3>
                </div>

                <span
                  className={`px-2.5 py-1 text-xs font-extrabold rounded-full ${
                    skill.importance === 'Critical'
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {skill.importance} Gap
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {skill.reason}
              </p>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Estimated Time to Master: <strong className="text-slate-800">{skill.estimatedHoursToMaster} Hours</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => onAddSkillToProfile(skill.name, skill.category)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-blue-600" /> Mark as Learning
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" /> Start in AI Roadmap
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Breakdown: Soft Skills & Strengths to Leverage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Soft Skills Gaps */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Recommended Soft Skill Competencies</h3>
          </div>
          <div className="space-y-2">
            {skillGap.missingSoftSkills.map((ss, idx) => (
              <div key={idx} className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl text-xs font-semibold text-amber-900 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                <span>{ss}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Strengths */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Your Core Competitive Strengths</h3>
          </div>
          <div className="space-y-2">
            {skillGap.strengthsToLeverage.map((st, idx) => (
              <div key={idx} className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs font-medium text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{st}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
