import React, { useState } from 'react';
import { X, Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { playChimeSound } from '../utils/audio';

interface ExtendStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  storyTitle: string;
  currentPageNumber: number;
  onExtend: (choice: string) => Promise<void>;
}

export const ExtendStoryModal: React.FC<ExtendStoryModalProps> = ({
  isOpen,
  onClose,
  storyTitle,
  currentPageNumber,
  onExtend,
}) => {
  const [customChoice, setCustomChoice] = useState('');
  const [isExtending, setIsExtending] = useState(false);

  if (!isOpen) return null;

  const quickIdeas = [
    '✨ They discover a hidden treasure chest filled with glowing stardust',
    '🌈 A friendly baby dragon lands and invites them to a cloud party',
    '🗺️ They find a secret singing pathway through the crystal forest',
    '🌟 They help a lost baby woodland animal find their cozy home',
  ];

  const handleSubmit = async (choiceText: string) => {
    setIsExtending(true);
    playChimeSound('sparkle');
    try {
      await onExtend(choiceText);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsExtending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] max-w-lg w-full border-3 sm:border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="bg-emerald-500 p-5 text-white flex items-center justify-between border-b-3 sm:border-b-4 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-2xl text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              🪄
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">Co-Write Page {currentPageNumber + 1}!</h2>
              <p className="text-xs text-emerald-100 font-bold">What happens next in {storyTitle}?</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 bg-[#FFFBEB]">
          <label className="block text-xs font-black text-slate-900 uppercase tracking-wider">
            Pick a Fun Path:
          </label>

          <div className="space-y-2.5">
            {quickIdeas.map((idea, idx) => (
              <button
                key={idx}
                onClick={() => handleSubmit(idea)}
                disabled={isExtending}
                className="w-full p-3.5 rounded-2xl border-2 border-slate-900 bg-white hover:bg-yellow-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-left text-xs font-black text-slate-900 transition-all flex items-center justify-between gap-2 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
              >
                <span>{idea}</span>
                <ArrowRight className="w-4 h-4 text-slate-900 stroke-[3] shrink-0" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t-2 border-slate-900/10">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
              Or write your own imagination:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customChoice}
                onChange={(e) => setCustomChoice(e.target.value)}
                placeholder="e.g. They build a giant blanket fort with marshmallows..."
                className="flex-1 bg-white text-xs sm:text-sm text-slate-900 px-3.5 py-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] focus:outline-none font-bold"
              />
              <button
                onClick={() => handleSubmit(customChoice || 'A wonderful new adventure begins')}
                disabled={isExtending}
                className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-white font-black text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
                <span>Add Page</span>
              </button>
            </div>
          </div>

          {isExtending && (
            <div className="p-3 bg-yellow-100 rounded-xl border-2 border-slate-900 flex items-center gap-2 text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
              <span>Writing the new page with Gemini...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
