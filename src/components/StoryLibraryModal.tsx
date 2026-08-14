import React from 'react';
import { X, BookOpen, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { Story } from '../types';
import { playChimeSound } from '../utils/audio';

interface StoryLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stories: Story[];
  currentStoryId: string;
  onSelectStory: (story: Story) => void;
  onDeleteCustomStory: (storyId: string) => void;
  onOpenCreateStory: () => void;
}

export const StoryLibraryModal: React.FC<StoryLibraryModalProps> = ({
  isOpen,
  onClose,
  stories,
  currentStoryId,
  onSelectStory,
  onDeleteCustomStory,
  onOpenCreateStory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] max-w-2xl w-full border-3 sm:border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col my-8 max-h-[85vh]">
        {/* Header */}
        <div className="bg-orange-500 p-5 text-white flex items-center justify-between border-b-3 sm:border-b-4 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-2xl text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              📚
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">Storybook Library</h2>
              <p className="text-xs text-orange-100 font-bold">Pick any adventure to read aloud with AI illustrations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 bg-[#FFFBEB]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Available Storybooks ({stories.length})
            </span>
            <button
              onClick={() => {
                onClose();
                onOpenCreateStory();
              }}
              className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Create New Book</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stories.map((story) => {
              const isSelected = story.id === currentStoryId;

              return (
                <div
                  key={story.id}
                  className={`rounded-2xl p-4 border-2 sm:border-3 border-slate-900 transition-all flex flex-col justify-between shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] ${
                    isSelected
                      ? 'bg-yellow-300 translate-x-0.5 translate-y-0.5'
                      : 'bg-white hover:bg-amber-50'
                  }`}
                >
                  <div>
                    {/* Story tags */}
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 bg-white text-slate-900 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                        Ages {story.targetAge}
                      </span>
                      <span className="text-[10px] font-black text-slate-700">
                        {story.pages.length} Pages
                      </span>
                    </div>

                    <h3 className="font-black text-slate-900 text-sm sm:text-base mb-1 line-clamp-2">
                      {story.title}
                    </h3>
                    <p className="text-xs text-slate-700 font-bold line-clamp-2 mb-3 leading-relaxed">
                      {story.tagline}
                    </p>

                    {/* Characters */}
                    <div className="flex items-center gap-1 text-xs text-slate-600 mb-3 font-bold">
                      <span className="font-black text-slate-900">Heroes:</span>
                      <span className="truncate">
                        {story.characters.map((c) => `${c.avatarIcon || '⭐'} ${c.name}`).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t-2 border-slate-900/10 flex items-center justify-between gap-2">
                    {story.isCustom && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCustomStory(story.id);
                        }}
                        className="p-1.5 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete custom story"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => {
                        playChimeSound('sparkle');
                        onSelectStory(story);
                        onClose();
                      }}
                      className={`ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      <span>{isSelected ? 'Reading Now' : 'Read Book'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t-3 sm:border-t-4 border-slate-900 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-black text-slate-900 bg-white hover:bg-slate-100 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Close Library
          </button>
        </div>
      </div>
    </div>
  );
};
