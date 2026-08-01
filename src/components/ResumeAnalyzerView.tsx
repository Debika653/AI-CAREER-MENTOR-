import React, { useState } from 'react';
import { ResumeAnalysisResult, UserProfile } from '../types';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Search,
  Award
} from 'lucide-react';

interface ResumeAnalyzerViewProps {
  userProfile: UserProfile;
  resumeAnalysis: ResumeAnalysisResult | null;
  onAnalyzeResume: (resumeText: string) => void;
  isAnalyzing: boolean;
}

export const ResumeAnalyzerView: React.FC<ResumeAnalyzerViewProps> = ({
  userProfile,
  resumeAnalysis,
  onAnalyzeResume,
  isAnalyzing,
}) => {
  const [inputText, setInputText] = useState(userProfile.resumeText || '');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleRunAnalysis = () => {
    if (!inputText.trim()) return;
    onAnalyzeResume(inputText);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">AI Resume & ATS Optimizer</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Evaluates your resume against ATS screeners for <span className="font-bold text-slate-800">{userProfile.targetRole}</span>.
          </p>
        </div>
      </div>

      {/* Input Resume Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
          Paste Resume Text / Plain Markdown
        </label>
        <textarea
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your resume content here..."
          className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Targeting Position: <strong className="text-slate-800">{userProfile.targetRole}</strong>
          </span>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || !inputText.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Evaluating Resume...' : 'Analyze Resume with AI'}</span>
          </button>
        </div>
      </div>

      {/* Results Display */}
      {resumeAnalysis && (
        <div className="space-y-6">
          {/* Score Gauges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Overall Resume Clarity Score
                </span>
                <span className="text-4xl font-extrabold text-white mt-1 block">
                  {resumeAnalysis.overallScore}/100
                </span>
                <span className="text-xs text-blue-400 mt-1 block">Formatting & Structure Rating</span>
              </div>
              <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                <Award className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  ATS Match Score for {userProfile.targetRole}
                </span>
                <span className="text-4xl font-extrabold text-emerald-400 mt-1 block">
                  {resumeAnalysis.matchScoreForTargetRole}/100
                </span>
                <span className="text-xs text-emerald-400 mt-1 block">Keyword Density Alignment</span>
              </div>
              <div className="p-4 bg-slate-800 rounded-2xl border border-slate-700">
                <Search className="w-8 h-8 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Missing Keywords & Extracted Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-500" /> Missing High-Value ATS Keywords
              </span>
              <div className="flex flex-wrap gap-1.5">
                {resumeAnalysis.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-medium rounded-lg">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Successfully Extracted Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {resumeAnalysis.extractedSkills.map((sk, i) => (
                  <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium rounded-lg">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bullet Point Enhancements (STAR Method) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold text-slate-900">STAR Method Bullet Point Upgrades</h3>
            </div>

            <div className="space-y-4">
              {resumeAnalysis.bulletPointEnhancements.map((enh, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Original / Weak Bullet
                    </span>
                    <p className="text-xs text-slate-500 line-through font-mono">{enh.original}</p>
                  </div>

                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                        AI High-Impact Upgrade
                      </span>
                      <button
                        onClick={() => handleCopy(enh.improved)}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                        title="Copy upgrade"
                      >
                        {copiedText === enh.improved ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="font-mono leading-relaxed">{enh.improved}</p>
                  </div>

                  <p className="text-[11px] text-slate-600 italic">
                    <strong className="text-slate-800 font-semibold">Why this works:</strong> {enh.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
