import React from 'react';
import { UserProfile, CareerMatch, SkillGapAnalysis, CareerRoadmap, ActiveTab } from '../types';
import { ReadinessGauge } from './ReadinessGauge';
import { CustomRadarChart } from './CustomRadarChart';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Target,
  Zap,
  MessageSquare,
  Award,
  Layers
} from 'lucide-react';

interface DashboardViewProps {
  userProfile: UserProfile;
  careerMatches: CareerMatch[];
  skillGap: SkillGapAnalysis;
  roadmap: CareerRoadmap;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectRole: (role: string) => void;
  onOpenProfile: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userProfile,
  careerMatches,
  skillGap,
  roadmap,
  setActiveTab,
  onSelectRole,
  onOpenProfile,
}) => {
  const currentRoleMatch = careerMatches.find(r => r.roleTitle === userProfile.targetRole) || careerMatches[0];

  // Map user skill domains to 6 radar chart dimensions
  const domainScores: Record<string, { current: number; target: number }> = {
    Frontend: { current: 0, target: 85 },
    Backend: { current: 0, target: 80 },
    Database: { current: 0, target: 75 },
    DevOps: { current: 0, target: 70 },
    'AI Tools': { current: 0, target: 65 },
    SoftSkills: { current: 0, target: 80 },
  };

  userProfile.skills.forEach(s => {
    const val = s.level * 20; // convert 1-5 to 0-100
    if (s.category === 'frontend') domainScores.Frontend.current = Math.max(domainScores.Frontend.current, val);
    else if (s.category === 'backend') domainScores.Backend.current = Math.max(domainScores.Backend.current, val);
    else if (s.category === 'database') domainScores.Database.current = Math.max(domainScores.Database.current, val);
    else if (s.category === 'devops' || s.category === 'cloud') domainScores.DevOps.current = Math.max(domainScores.DevOps.current, val);
    else if (s.category === 'ai' || s.category === 'tools') domainScores['AI Tools'].current = Math.max(domainScores['AI Tools'].current, val);
    else if (s.category === 'soft') domainScores.SoftSkills.current = Math.max(domainScores.SoftSkills.current, val);
  });

  const radarData = Object.entries(domainScores).map(([domain, val]) => ({
    domain,
    current: val.current || 30, // baseline fallback
    target: val.target
  }));

  const completedMilestonesCount = roadmap.milestones.filter(m => m.status === 'completed').length;
  const criticalGaps = skillGap.missingCoreSkills.filter(s => s.importance === 'Critical');

  return (
    <div className="space-y-6">
      {/* Welcome & Target Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-xs font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Career Intelligence Active
              </span>
              <span className="text-xs text-slate-300">Updated today</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {userProfile.name.split(' ')[0]}!
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Targeting <span className="text-blue-300 font-semibold">{userProfile.targetRole}</span>. You possess{' '}
              <span className="text-emerald-400 font-bold">{userProfile.skills.length} verified competencies</span>. Complete your current roadmap phase to boost market readiness.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('roadmap')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4" /> Resume AI Roadmap
            </button>
            <button
              onClick={onOpenProfile}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-xs rounded-xl transition-all"
            >
              Update Skills
            </button>
          </div>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Readiness Gauge Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" /> Real-time Job Readiness
            </h3>
            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              AI Evaluated
            </span>
          </div>

          <ReadinessGauge score={skillGap.readinessScore} size={220} label={`Target: ${userProfile.targetRole}`} />

          <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-center mt-2">
            <p className="text-xs text-slate-600">
              <span className="font-semibold text-slate-900">{skillGap.currentMatchPercent}% match</span> with current industry benchmarks.
            </p>
          </div>
        </div>

        {/* Radar Chart Skill Domain Coverage */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Skill Domain Mastery
            </h3>
            <button
              onClick={() => setActiveTab('skill_gap')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Full Matrix <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <CustomRadarChart data={radarData} size={240} />

          <p className="text-[11px] text-slate-500 text-center mt-2">
            Highest domain strength in <span className="font-bold text-slate-700">Frontend Development</span>.
          </p>
        </div>

        {/* Quick Career Stats & Action Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" /> Key Milestone Metrics
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider block">Target Role Fit</span>
                <span className="text-2xl font-extrabold text-blue-900 mt-1 block">
                  {currentRoleMatch?.matchPercentage || 82}%
                </span>
                <span className="text-[10px] text-blue-700 mt-0.5 block truncate">{userProfile.targetRole}</span>
              </div>

              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider block">Roadmap Progress</span>
                <span className="text-2xl font-extrabold text-indigo-900 mt-1 block">
                  {roadmap.overallProgressPercentage}%
                </span>
                <span className="text-[10px] text-indigo-700 mt-0.5 block">{completedMilestonesCount} of {roadmap.milestones.length} Phases</span>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
                <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider block">Missing Skills</span>
                <span className="text-2xl font-extrabold text-amber-900 mt-1 block">
                  {skillGap.missingCoreSkills.length}
                </span>
                <span className="text-[10px] text-amber-800 mt-0.5 block">{criticalGaps.length} Critical Priority</span>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
                <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider block">Learning Streak</span>
                <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">
                  12 Days
                </span>
                <span className="text-[10px] text-emerald-800 mt-0.5 block">Consistent Pace</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs font-bold">Ask AI Career Mentor</p>
                <p className="text-[11px] text-slate-400">Get advice or mock interview tips</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('mentor_chat')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Chat
            </button>
          </div>
        </div>
      </div>

      {/* Critical Skill Gap & Next Steps Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Priority Missing Skills */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Critical Skill Gap Priority
              </h3>
              <p className="text-xs text-slate-500">Technologies to bridge for {userProfile.targetRole}</p>
            </div>
            <button
              onClick={() => setActiveTab('skill_gap')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              View All ({skillGap.missingCoreSkills.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {skillGap.missingCoreSkills.slice(0, 3).map((skill, i) => (
              <div key={i} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{skill.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      skill.importance === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {skill.importance}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{skill.reason}</p>
                </div>
                <button
                  onClick={() => setActiveTab('roadmap')}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                >
                  Learn in Roadmap
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* AI Actionable Career Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> AI Action Plan Recommendations
                </h3>
                <p className="text-xs text-slate-500">Data-backed steps to maximize your portfolio impact</p>
              </div>
            </div>

            <div className="space-y-3">
              {skillGap.topActionableAdvice.map((advice, i) => (
                <div key={i} className="p-3.5 bg-blue-50/40 border border-blue-100 rounded-xl flex items-start gap-3">
                  <div className="p-1.5 bg-blue-600 text-white rounded-lg mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {advice}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need portfolio project ideas?</span>
            <button
              onClick={() => setActiveTab('projects')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Explore AI Recommended Projects <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
