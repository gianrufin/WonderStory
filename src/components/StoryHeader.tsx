import React from 'react';
import { Sparkles, PlusCircle, Settings2, MessageCircle, Library, Volume2 } from 'lucide-react';
import { Story, VoiceName, ImageResolution } from '../types';

interface StoryHeaderProps {
  currentStory: Story;
  onOpenLibrary: () => void;
  onOpenCreateStory: () => void;
  onOpenSettings: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
  activeVoice: VoiceName;
  imageResolution: ImageResolution;
  isReadingAloud?: boolean;
}

export const StoryHeader: React.FC<StoryHeaderProps> = ({
  currentStory,
  onOpenLibrary,
  onOpenCreateStory,
  onOpenSettings,
  onToggleChat,
  isChatOpen,
  activeVoice,
  imageResolution,
  isReadingAloud = false,
}) => {
  return (
    <header className="w-full bg-[#FFFBEB] border-b-4 border-slate-900 sticky top-0 z-30 px-4 sm:px-6 py-3.5 shadow-[0px_4px_0px_0px_rgba(15,23,42,0.08)]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Story Title */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 bg-orange-400 rounded-2xl border-3 border-slate-900 flex items-center justify-center text-white shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transform -rotate-3 shrink-0">
            <span className="text-2xl">📖</span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                StoryBot Kids
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-yellow-300 text-slate-900 px-2 py-0.5 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                  Bento Storybook
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-600 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
              Reading: <span className="text-slate-900 font-extrabold">{currentStory.title}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap shrink-0">
          {/* Reading Aloud Indicator Pill */}
          <div className="hidden md:flex bg-white px-3.5 py-1.5 rounded-full border-2 border-slate-900 items-center gap-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-4 bg-indigo-500 rounded-full ${isReadingAloud ? 'animate-pulse' : ''}`}></div>
              <div className={`w-1.5 h-3 bg-indigo-400 rounded-full ${isReadingAloud ? 'animate-bounce' : ''}`}></div>
              <div className={`w-1.5 h-5 bg-indigo-600 rounded-full ${isReadingAloud ? 'animate-pulse' : ''}`}></div>
            </div>
            <span className="text-xs font-black text-slate-700">
              {isReadingAloud ? 'Reading Aloud...' : 'AI Narrator Ready'}
            </span>
          </div>

          {/* Library Button */}
          <button
            id="btn-open-library"
            onClick={onOpenLibrary}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-black text-slate-900 bg-white hover:bg-amber-100/80 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-2 border-slate-900 rounded-2xl transition-all shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
            title="Browse Books"
          >
            <Library className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">My Books</span>
          </button>

          {/* Create New Story Button */}
          <button
            id="btn-create-story"
            onClick={onOpenCreateStory}
            className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-black text-white bg-orange-500 hover:bg-orange-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none border-2 border-slate-900 rounded-2xl shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Story</span>
          </button>

          {/* Quick Settings & Resolution Indicator */}
          <button
            id="btn-open-settings"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-black text-slate-800 bg-white hover:bg-slate-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer"
            title="Voice & Image Settings"
          >
            <Settings2 className="w-4 h-4 text-slate-700" />
            <span className="hidden lg:inline font-mono text-[11px] bg-yellow-200 text-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-900">
              {imageResolution} · {activeVoice}
            </span>
          </button>

          {/* Story Companion & Character Chat Toggle */}
          <button
            id="btn-toggle-chat"
            onClick={onToggleChat}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-black rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
              isChatOpen
                ? 'bg-indigo-600 text-white'
                : 'bg-indigo-100 text-indigo-950 hover:bg-indigo-200'
            }`}
            title="Chat with Barnaby the Owl & Characters"
          >
            <MessageCircle className="w-4 h-4 text-indigo-700" />
            <span className="hidden sm:inline">Ask Owl</span>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
