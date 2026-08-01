import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  CareerMatch,
  SkillGapAnalysis,
  CareerRoadmap,
  ProjectRecommendation,
  ResumeAnalysisResult,
  ChatMessage,
  ActiveTab,
  SkillCategory
} from './types';
import {
  INITIAL_USER_PROFILE,
  STANDARD_CAREER_ROLES,
  INITIAL_SKILL_GAP,
  INITIAL_ROADMAP,
  INITIAL_PROJECT_RECOMMENDATIONS
} from './data/defaultData';

import { Header } from './components/Header';
import { ProfileSetupModal } from './components/ProfileSetupModal';
import { DashboardView } from './components/DashboardView';
import { CareerMatchView } from './components/CareerMatchView';
import { SkillGapView } from './components/SkillGapView';
import { RoadmapView } from './components/RoadmapView';
import { ProjectRecommendationsView } from './components/ProjectRecommendationsView';
import { ResumeAnalyzerView } from './components/ResumeAnalyzerView';
import { AiMentorChat } from './components/AiMentorChat';

export default function App() {
  // State Initialization with local storage recovery fallback
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ai_career_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>(STANDARD_CAREER_ROLES);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis>(INITIAL_SKILL_GAP);
  const [roadmap, setRoadmap] = useState<CareerRoadmap>(INITIAL_ROADMAP);
  const [projects, setProjects] = useState<ProjectRecommendation[]>(INITIAL_PROJECT_RECOMMENDATIONS);
  const [resumeAnalysis, setResumeAnalysis] = useState<ResumeAnalysisResult | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Loading States
  const [isRegeneratingRoadmap, setIsRegeneratingRoadmap] = useState(false);
  const [isGeneratingProjects, setIsGeneratingProjects] = useState(false);
  const [isAnalyzingResume, setIsAnalyzingResume] = useState(false);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'mentor',
      text: `Hello ${userProfile.name.split(' ')[0]}! I'm your AI Career Mentor. I've analyzed your skill profile and background. You're currently on track for **${userProfile.targetRole}** with an estimated readiness score of **${skillGap.readinessScore}%**.\n\nHow can I help accelerate your learning journey today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        `What are my biggest skill gaps for ${userProfile.targetRole}?`,
        `How do I prepare for a ${userProfile.targetRole} interview?`,
        `Which portfolio project should I build first?`
      ]
    }
  ]);

  // Persist Profile to LocalStorage
  useEffect(() => {
    localStorage.setItem('ai_career_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Re-evaluate Profile API call when profile or target role changes
  const evaluateProfileWithAI = async (profileToEval: UserProfile, targetRoleOverride?: string) => {
    const role = targetRoleOverride || profileToEval.targetRole;
    try {
      const res = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile: profileToEval, targetRole: role })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.matches) setCareerMatches(data.matches);
        if (data.skillGap) setSkillGap(data.skillGap);
      }
    } catch (err) {
      console.warn('API call failed, maintaining computed client heuristics:', err);
    }
  };

  // Handle Changing Target Role
  const handleSelectRole = (newRoleTitle: string) => {
    const updatedProfile = { ...userProfile, targetRole: newRoleTitle };
    setUserProfile(updatedProfile);

    // Compute simple match heuristics for UI responsiveness
    const roleMatch = careerMatches.find(r => r.roleTitle === newRoleTitle);
    if (roleMatch) {
      setSkillGap(prev => ({
        ...prev,
        targetRole: newRoleTitle,
        currentMatchPercent: roleMatch.matchPercentage,
        readinessScore: roleMatch.readinessScore
      }));
    }

    // Call server AI for deep re-evaluation
    evaluateProfileWithAI(updatedProfile, newRoleTitle);
  };

  // Handle Toggling Milestone Progress in Roadmap
  const handleToggleMilestoneStatus = (milestoneId: string) => {
    setRoadmap(prev => {
      const updatedMilestones = prev.milestones.map(m => {
        if (m.id === milestoneId) {
          const nextStatus = m.status === 'completed' ? 'not_started' : m.status === 'in_progress' ? 'completed' : 'in_progress';
          return { ...m, status: nextStatus as any };
        }
        return m;
      });

      const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
      const progressPercent = Math.round((completedCount / updatedMilestones.length) * 100);

      // Boost readiness score based on completed milestones
      const scoreBoost = completedCount * 5;
      const baseScore = skillGap.readinessScore;
      const newReadinessScore = Math.min(98, Math.max(baseScore, 65 + scoreBoost));

      setSkillGap(sg => ({ ...sg, readinessScore: newReadinessScore }));

      return {
        ...prev,
        milestones: updatedMilestones,
        overallProgressPercentage: progressPercent
      };
    });
  };

  // Handle Adding Skill from Gap view
  const handleAddSkillToProfile = (skillName: string, category: SkillCategory) => {
    const existing = userProfile.skills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (existing) return;

    const newSkill = {
      id: Date.now().toString(),
      name: skillName,
      category,
      level: 2,
      verifiedBy: 'manual' as const
    };

    const updatedProfile = {
      ...userProfile,
      skills: [...userProfile.skills, newSkill]
    };

    setUserProfile(updatedProfile);
    evaluateProfileWithAI(updatedProfile);
  };

  // Handle AI Roadmap Regeneration
  const handleRegenerateRoadmap = async () => {
    setIsRegeneratingRoadmap(true);
    try {
      const res = await fetch('/api/generate-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile, targetRole: userProfile.targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.milestones) {
          setRoadmap(data);
        }
      }
    } catch (err) {
      console.error('Failed to regenerate roadmap:', err);
    } finally {
      setIsRegeneratingRoadmap(false);
    }
  };

  // Handle AI Project Generation
  const handleGenerateCustomProjects = async () => {
    setIsGeneratingProjects(true);
    try {
      const res = await fetch('/api/project-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userProfile, targetRole: userProfile.targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.projects) {
          setProjects(data.projects);
        }
      }
    } catch (err) {
      console.error('Failed to generate projects:', err);
    } finally {
      setIsGeneratingProjects(false);
    }
  };

  // Handle AI Resume Analysis
  const handleAnalyzeResume = async (resumeText: string) => {
    setIsAnalyzingResume(true);
    try {
      const res = await fetch('/api/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, targetRole: userProfile.targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        setResumeAnalysis(data);
      }
    } catch (err) {
      console.error('Failed to analyze resume:', err);
    } finally {
      setIsAnalyzingResume(false);
    }
  };

  // Handle Mentor Chat Message
  const handleSendMessage = async (promptText: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setIsSendingChat(true);

    try {
      const res = await fetch('/api/mentor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile,
          messages: updatedMessages,
          prompt: promptText
        })
      });

      if (res.ok) {
        const data = await res.json();
        const mentorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'mentor',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedQuestions: data.suggestedQuestions
        };
        setChatMessages(prev => [...prev, mentorMsg]);
      }
    } catch (err) {
      console.error('Error sending chat:', err);
    } finally {
      setIsSendingChat(false);
    }
  };

  const availableRoleTitles = STANDARD_CAREER_ROLES.map(r => r.roleTitle);

  return (
    <div className="min-h-screen bg-slate-100/70 font-sans text-slate-900 flex flex-col">
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        readinessScore={skillGap.readinessScore}
        availableRoles={availableRoleTitles}
        onSelectRole={handleSelectRole}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            careerMatches={careerMatches}
            skillGap={skillGap}
            roadmap={roadmap}
            setActiveTab={setActiveTab}
            onSelectRole={handleSelectRole}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}

        {activeTab === 'career_match' && (
          <CareerMatchView
            careerMatches={careerMatches}
            userProfile={userProfile}
            onSelectRole={handleSelectRole}
          />
        )}

        {activeTab === 'skill_gap' && (
          <SkillGapView
            skillGap={skillGap}
            userProfile={userProfile}
            setActiveTab={setActiveTab}
            onAddSkillToProfile={handleAddSkillToProfile}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmap={roadmap}
            userProfile={userProfile}
            onToggleMilestoneStatus={handleToggleMilestoneStatus}
            onRegenerateRoadmap={handleRegenerateRoadmap}
            isRegenerating={isRegeneratingRoadmap}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectRecommendationsView
            projects={projects}
            userProfile={userProfile}
            onGenerateCustomProjects={handleGenerateCustomProjects}
            isGenerating={isGeneratingProjects}
          />
        )}

        {activeTab === 'resume' && (
          <ResumeAnalyzerView
            userProfile={userProfile}
            resumeAnalysis={resumeAnalysis}
            onAnalyzeResume={handleAnalyzeResume}
            isAnalyzing={isAnalyzingResume}
          />
        )}

        {activeTab === 'mentor_chat' && (
          <AiMentorChat
            userProfile={userProfile}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            isSending={isSendingChat}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <p>AI Career Mentor • Powered by Gemini AI • Personalized Career Coach & Skill Intelligence</p>
      </footer>

      {/* Profile Setup / Edit Modal */}
      <ProfileSetupModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(updated) => {
          setUserProfile(updated);
          evaluateProfileWithAI(updated);
        }}
        availableRoles={availableRoleTitles}
      />
    </div>
  );
}
