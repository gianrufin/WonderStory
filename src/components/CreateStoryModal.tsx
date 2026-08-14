import React, { useState } from 'react';
import { X, Sparkles, Wand2, BookOpen, Dice5, Check } from 'lucide-react';
import { AgeGroup, ArtStyle, Story } from '../types';
import { ART_STYLES } from '../data/defaultStories';
import { playChimeSound } from '../utils/audio';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: (story: Story) => void;
}

const HERO_PRESETS = [
  { label: 'Baby Green Dragon', icon: '🐲', desc: 'Breathes glowing purple bubbles' },
  { label: 'Astronaut Bunny', icon: '🐰', desc: 'Explores cosmic starberry orchards' },
  { label: 'Curious Dolphin', icon: '🐬', desc: 'Finds singing underwater crystals' },
  { label: 'Robot Baker', icon: '🤖', desc: 'Bakes rainbow cloud cakes' },
  { label: 'Forest Fairy', icon: '🧚', desc: 'Paints twilight flower petals' },
  { label: 'Little Fox Explorer', icon: '🦊', desc: 'Tracks the singing golden map' },
];

const THEME_PRESETS = [
  'Kindness and helping friends',
  'Bravery and believing in yourself',
  'Sharing and teamwork',
  'Curiosity and exploring the unknown',
  'Peaceful bedtime sweet dreams',
];

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({
  isOpen,
  onClose,
  onStoryCreated,
}) => {
  const [topic, setTopic] = useState('');
  const [characterIdea, setCharacterIdea] = useState(HERO_PRESETS[0].label);
  const [targetAge, setTargetAge] = useState<AgeGroup>('6-8');
  const [moral, setMoral] = useState(THEME_PRESETS[0]);
  const [artStyle, setArtStyle] = useState<ArtStyle>('watercolor');
  const [pageCount, setPageCount] = useState(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRandomize = () => {
    playChimeSound('sparkle');
    const randomHero = HERO_PRESETS[Math.floor(Math.random() * HERO_PRESETS.length)];
    const randomTheme = THEME_PRESETS[Math.floor(Math.random() * THEME_PRESETS.length)];
    const randomStyle = ART_STYLES[Math.floor(Math.random() * ART_STYLES.length)].id as ArtStyle;

    setCharacterIdea(randomHero.label);
    setMoral(randomTheme);
    setArtStyle(randomStyle);
    setTopic(`${randomHero.label} on a magical quest about ${randomTheme.toLowerCase()}`);
  };

  const handleCreate = async () => {
    setIsGenerating(true);
    setError(null);
    playChimeSound('sparkle');

    try {
      const res = await fetch('/api/story/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic || `${characterIdea} discovers something magical`,
          characterIdea,
          targetAge,
          pageCount,
          moral,
          artStyle,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate story');
      }

      const newStory: Story = await res.json();
      playChimeSound('success');
      onStoryCreated(newStory);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong creating the story. Please try again!');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] max-w-xl w-full border-3 sm:border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="bg-orange-500 p-5 text-white flex items-center justify-between border-b-3 sm:border-b-4 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-2xl text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              ✨
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">Create a New Storybook</h2>
              <p className="text-xs text-orange-100 font-bold">Crafted with Gemini AI for young minds</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh] bg-[#FFFBEB]">
          {/* Quick Randomizer Banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-yellow-100 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-black text-slate-900">Want a surprise story?</span>
            </div>
            <button
              onClick={handleRandomize}
              type="button"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-yellow-300 hover:bg-yellow-400 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-slate-900 font-black text-xs rounded-xl border-2 border-slate-900 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
            >
              <Dice5 className="w-3.5 h-3.5" />
              <span>Surprise Me!</span>
            </button>
          </div>

          {/* 1. Pick Hero Character */}
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
              1. Choose the Main Hero:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {HERO_PRESETS.map((hero) => (
                <button
                  key={hero.label}
                  type="button"
                  onClick={() => setCharacterIdea(hero.label)}
                  className={`p-3 rounded-2xl border-2 border-slate-900 text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                    characterIdea === hero.label
                      ? 'bg-yellow-300 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] translate-x-0.5 translate-y-0.5'
                      : 'bg-white hover:bg-amber-50 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                  }`}
                >
                  <span className="text-2xl shrink-0">{hero.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate">{hero.label}</p>
                    <p className="text-[10px] text-slate-600 font-bold leading-tight line-clamp-1">{hero.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Target Age & Page Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                2. Target Age Group:
              </label>
              <div className="flex rounded-xl p-1 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                {(['3-5', '6-8', '9-12'] as AgeGroup[]).map((age) => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setTargetAge(age)}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      targetAge === age
                        ? 'bg-orange-500 text-white shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    Ages {age}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                3. Story Length:
              </label>
              <div className="flex rounded-xl p-1 bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                {[3, 4, 5].map((pages) => (
                  <button
                    key={pages}
                    type="button"
                    onClick={() => setPageCount(pages)}
                    className={`flex-1 py-1.5 text-xs font-black rounded-lg transition-all cursor-pointer ${
                      pageCount === pages
                        ? 'bg-orange-500 text-white shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]'
                        : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    {pages} Pages
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Art Style */}
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
              4. Illustration Art Style:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ART_STYLES.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setArtStyle(style.id as ArtStyle)}
                  className={`p-2.5 rounded-xl border-2 border-slate-900 text-left flex items-center gap-2 transition-all cursor-pointer ${
                    artStyle === style.id
                      ? 'bg-yellow-300 font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] translate-x-0.5 translate-y-0.5'
                      : 'bg-white text-slate-800 hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] font-bold'
                  }`}
                >
                  <span className="text-xl">{style.icon}</span>
                  <span className="text-xs truncate">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Custom Topic or Idea (Optional) */}
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1">
              5. Story Idea or Special Wishes (Optional):
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Finding a glowing key in a magical treehouse..."
              className="w-full bg-white text-xs sm:text-sm text-slate-900 p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] focus:outline-none font-bold"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-100 border-2 border-slate-900 text-xs text-rose-900 font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t-3 sm:border-t-4 border-slate-900 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-black text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            id="btn-confirm-create-story"
            onClick={handleCreate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-white font-black text-sm rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Writing story with Gemini...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Create Storybook!</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
