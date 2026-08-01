import React from 'react';
import { ActiveTab, UserProfile } from '../types';
import {
  Compass,
  Target,
  BarChart2,
  Map,
  Code,
  FileText,
  MessageSquareCode,
  UserCheck,
  Sparkles,
  Award
} from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  readinessScore: number;
  availableRoles: string[];
  onSelectRole: (role: string) => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  readinessScore,
  availableRoles,
  onSelectRole,
  onOpenProfile,
}) => {
  const tabs = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: Compass },
    { id: 'career_match' as ActiveTab, label: 'Career Match', icon: Target },
    { id: 'skill_gap' as ActiveTab, label: 'Skill Gap', icon: BarChart2 },
    { id: 'roadmap' as ActiveTab, label: 'AI Roadmap', icon: Map },
    { id: 'projects' as ActiveTab, label: 'Projects', icon: Code },
    { id: 'resume' as ActiveTab, label: 'Resume AI', icon: FileText },
    { id: 'mentor_chat' as ActiveTab, label: 'AI Coach', icon: MessageSquareCode },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                AI Career <span className="text-blue-600">Mentor</span>
              </span>
              <span className="hidden md:inline-block ml-2 px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
                PRO COACH v2.5
              </span>
            </div>
          </div>

          {/* Quick Target Role Selector & Profile Button */}
          <div className="flex items-center gap-3">
            {/* Target Role Dropdown */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-blue-600" /> Target:
              </span>
              <select
                value={userProfile.targetRole}
                onChange={(e) => onSelectRole(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Readiness Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>{readinessScore}% Ready</span>
            </div>

            {/* Edit Profile Button */}
            <button
              onClick={onOpenProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{userProfile.name.split(' ')[0]}'s Profile</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="-mb-px flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
