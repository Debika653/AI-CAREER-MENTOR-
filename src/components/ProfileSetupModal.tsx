import React, { useState } from 'react';
import { UserProfile, SkillCategory, SkillItem } from '../types';
import { X, Plus, Trash2, Github, FileText, Check, Sparkles, Sliders } from 'lucide-react';

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
  availableRoles: string[];
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  availableRoles
}) => {
  if (!isOpen) return null;

  const [profile, setProfile] = useState<UserProfile>({ ...userProfile });
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('frontend');
  const [newSkillLevel, setNewSkillLevel] = useState(3);
  const [githubSyncing, setGithubSyncing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'basic' | 'skills' | 'projects' | 'resume'>('basic');

  const categories: { id: SkillCategory; label: string }[] = [
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'database', label: 'Database' },
    { id: 'cloud', label: 'Cloud' },
    { id: 'ai', label: 'AI & Data' },
    { id: 'devops', label: 'DevOps & Infrastructure' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'soft', label: 'Soft Skills' },
    { id: 'tools', label: 'Tools & Workflow' },
  ];

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: SkillItem = {
      id: Date.now().toString(),
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
      verifiedBy: 'manual'
    };
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
    setNewSkillName('');
  };

  const handleRemoveSkill = (id: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const handleSkillLevelChange = (id: string, level: number) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, level } : s)
    }));
  };

  const handleSimulateGithubSync = () => {
    if (!profile.githubUsername) return;
    setGithubSyncing(true);
    setTimeout(() => {
      // Simulate adding skills detected from GitHub repos
      const githubExtracted: SkillItem[] = [
        { id: 'gh1', name: 'GitHub Actions CI/CD', category: 'devops', level: 3, verifiedBy: 'github' },
        { id: 'gh2', name: 'Docker Compose', category: 'devops', level: 2, verifiedBy: 'github' },
        { id: 'gh3', name: 'GraphQL Querying', category: 'backend', level: 2, verifiedBy: 'github' },
      ];

      setProfile(prev => {
        const existingNames = new Set(prev.skills.map(s => s.name.toLowerCase()));
        const toAdd = githubExtracted.filter(s => !existingNames.has(s.name.toLowerCase()));
        return {
          ...prev,
          skills: [...prev.skills, ...toAdd]
        };
      });
      setGithubSyncing(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      lastUpdated: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Career & Skill Profile Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            onClick={() => setActiveSubTab('basic')}
            className={`py-3 px-4 font-medium text-xs sm:text-sm border-b-2 transition-colors ${
              activeSubTab === 'basic'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Basic Info & Goals
          </button>
          <button
            onClick={() => setActiveSubTab('skills')}
            className={`py-3 px-4 font-medium text-xs sm:text-sm border-b-2 transition-colors ${
              activeSubTab === 'skills'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Technical Skills ({profile.skills.length})
          </button>
          <button
            onClick={() => setActiveSubTab('resume')}
            className={`py-3 px-4 font-medium text-xs sm:text-sm border-b-2 transition-colors ${
              activeSubTab === 'resume'
                ? 'border-blue-600 text-blue-600 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Resume & GitHub Sync
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeSubTab === 'basic' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Career Role</label>
                  <select
                    value={profile.targetRole}
                    onChange={e => setProfile({ ...profile, targetRole: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Academic / Current Title</label>
                  <input
                    type="text"
                    value={profile.title}
                    onChange={e => setProfile({ ...profile, title: e.target.value })}
                    placeholder="e.g. CS Undergrad / Junior Web Dev"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Practical Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={profile.experienceYears}
                    onChange={e => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Education Background</label>
                <input
                  type="text"
                  value={profile.education}
                  onChange={e => setProfile({ ...profile, education: e.target.value })}
                  placeholder="e.g. B.S. Computer Science (2025)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Career Bio / Summary</label>
                <textarea
                  rows={3}
                  value={profile.bio || ''}
                  onChange={e => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell your AI mentor about your career goals and what you want to achieve..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {activeSubTab === 'skills' && (
            <div className="space-y-6">
              {/* Add Skill Row */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">Add Skill Competency</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Skill name (e.g. Docker, GraphQL)"
                    value={newSkillName}
                    onChange={e => setNewSkillName(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <select
                    value={newSkillCategory}
                    onChange={e => setNewSkillCategory(e.target.value as SkillCategory)}
                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Skill
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {profile.skills.map(skill => (
                  <div key={skill.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 truncate">{skill.name}</span>
                        <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md capitalize">
                          {skill.category}
                        </span>
                        {skill.verifiedBy && (
                          <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-blue-50 text-blue-600 border border-blue-200 rounded-xs">
                            {skill.verifiedBy}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Level Slider */}
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={skill.level}
                          onChange={e => handleSkillLevelChange(skill.id, Number(e.target.value))}
                          className="w-20 accent-blue-600 cursor-pointer"
                        />
                        <span className="text-xs font-bold text-slate-700 w-12">
                          Lvl {skill.level}/5
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'resume' && (
            <div className="space-y-6">
              {/* GitHub Import */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Github className="w-5 h-5 text-white" />
                    <span className="font-bold text-sm">GitHub Skill Profile Importer</span>
                  </div>
                  {githubSyncing && <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />}
                </div>
                <p className="text-xs text-slate-300">
                  Connect your GitHub username to auto-detect technology stacks from your public repositories.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profile.githubUsername || ''}
                    onChange={e => setProfile({ ...profile, githubUsername: e.target.value })}
                    placeholder="e.g. octocat"
                    className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleSimulateGithubSync}
                    disabled={githubSyncing || !profile.githubUsername}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors disabled:opacity-50"
                  >
                    {githubSyncing ? 'Scanning...' : 'Scan Repos'}
                  </button>
                </div>
              </div>

              {/* Resume Text Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Paste Resume Content / Plain Text
                  </label>
                </div>
                <textarea
                  rows={8}
                  value={profile.resumeText || ''}
                  onChange={e => setProfile({ ...profile, resumeText: e.target.value })}
                  placeholder="Paste raw text from your resume here. The AI will extract key technologies and evaluate your ATS job match..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-colors"
            >
              <Check className="w-4 h-4" /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
