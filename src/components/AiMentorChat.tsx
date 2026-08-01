import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '../types';
import { MessageSquareCode, Send, Sparkles, User, Bot, RefreshCw, ChevronRight } from 'lucide-react';

interface AiMentorChatProps {
  userProfile: UserProfile;
  messages: ChatMessage[];
  onSendMessage: (promptText: string) => void;
  isSending: boolean;
}

export const AiMentorChat: React.FC<AiMentorChatProps> = ({
  userProfile,
  messages,
  onSendMessage,
  isSending,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleQuickQuestion = (q: string) => {
    if (isSending) return;
    onSendMessage(q);
  };

  const defaultSuggestions = [
    `How do I prepare for a ${userProfile.targetRole} technical interview?`,
    `What are the best portfolio projects to get hired as a ${userProfile.targetRole}?`,
    `How can I explain my projects using the STAR method in behavioral rounds?`,
    `What salary range should I expect for entry-level ${userProfile.targetRole} roles?`
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[75vh] overflow-hidden">
      {/* Top Bar */}
      <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-xl">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              CareerAI Digital Mentor <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            </h3>
            <p className="text-[11px] text-slate-300">
              Personalized Career Coach for <span className="text-blue-300 font-semibold">{userProfile.targetRole}</span>
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold rounded-full">
          AI Online
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`p-2 rounded-xl text-white shrink-0 ${
                  isUser ? 'bg-slate-800' : 'bg-blue-600'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-2xs space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {/* Suggested Follow-up Questions from Mentor */}
                {!isUser && msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Suggested Follow-up Questions
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {msg.suggestedQuestions.map((sq, sqIdx) => (
                        <button
                          key={sqIdx}
                          onClick={() => handleQuickQuestion(sq)}
                          className="text-left px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold rounded-lg transition-colors flex items-center justify-between group"
                        >
                          <span>{sq}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isSending && (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>CareerAI mentor is formulating personalized response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Pill Bar */}
      <div className="px-6 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
          Quick Prompts:
        </span>
        {defaultSuggestions.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleQuickQuestion(sug)}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg whitespace-nowrap transition-colors"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask AI Career Mentor anything about ${userProfile.targetRole}...`}
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors disabled:opacity-50 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
