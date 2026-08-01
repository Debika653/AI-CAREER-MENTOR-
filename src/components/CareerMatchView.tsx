import React, { useState } from 'react';
import { CareerMatch, UserProfile } from '../types';
import { Target, Search, CheckCircle, AlertCircle, DollarSign, TrendingUp, Sparkles, Check } from 'lucide-react';

interface CareerMatchViewProps {
  careerMatches: CareerMatch[];
  userProfile: UserProfile;
  onSelectRole: (roleTitle: string) => void;
}

export const CareerMatchView: React.FC<CareerMatchViewProps> = ({
  careerMatches,
  userProfile,
  onSelectRole,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Web & Systems', 'Web & Mobile', 'Systems & Engineering', 'Data & AI', 'Cloud & Infrastructure', 'Design & Product'];

  const filteredMatches = careerMatches.filter((match) => {
    const matchesSearch = match.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.keySkillsPresent.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || match.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Career Path Matching Engine</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluating your current skill profile against 10+ tech roles, market demand, and compensation structures.
          </p>
        </div>

        {/* Current Active Goal Pill */}
        <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs text-slate-600">Active Target Goal:</span>
          <span className="text-xs font-bold text-blue-900">{userProfile.targetRole}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search roles or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Career Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map((role) => {
          const isCurrentTarget = role.roleTitle === userProfile.targetRole;

          return (
            <div
              key={role.roleId}
              className={`bg-white rounded-2xl border p-6 shadow-xs flex flex-col justify-between transition-all ${
                isCurrentTarget
                  ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/10'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-4">
                {/* Role Title & Match Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900">{role.roleTitle}</h3>
                      {isCurrentTarget && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-extrabold rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" /> ACTIVE TARGET
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">{role.category}</span>
                  </div>

                  {/* Match Percentage Circle Badge */}
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-blue-600">{role.matchPercentage}%</span>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Skill Match</span>
                  </div>
                </div>

                {/* Salary & Demand Bar */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Est. Salary Range</span>
                      <span className="font-bold text-slate-800">
                        {role.salaryRange.currency}{(role.salaryRange.min / 1000).toFixed(0)}k - {role.salaryRange.currency}{(role.salaryRange.max / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">Market Demand</span>
                      <span className="font-bold text-indigo-700">{role.demandLevel} Demand</span>
                    </div>
                  </div>
                </div>

                {/* Rationale */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  {role.rationale}
                </p>

                {/* Skills Breakdown */}
                <div className="space-y-2">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Matching Skills You Have ({role.keySkillsPresent.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {role.keySkillsPresent.map((s, idx) => (
                        <span key={idx} className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-medium rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-rose-500" /> Critical Skills Needed ({role.keySkillsMissing.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {role.keySkillsMissing.map((s, idx) => (
                        <span key={idx} className="px-2 py-1 bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-medium rounded-md">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Set as Goal Button */}
              <div className="pt-4 mt-4 border-t border-slate-100">
                {isCurrentTarget ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-default"
                  >
                    <Check className="w-4 h-4 text-emerald-600" /> Currently Selected Target Goal
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectRole(role.roleTitle)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Target className="w-4 h-4" /> Set as My Target Career Goal
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
