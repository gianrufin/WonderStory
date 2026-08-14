/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Story, StoryPage, GenerationSettings, ImageResolution, VoiceName, ArtStyle } from './types';
import { DEFAULT_STORIES, ART_STYLES } from './data/defaultStories';
import { StoryHeader } from './components/StoryHeader';
import { IllustrationCard } from './components/IllustrationCard';
import { NarrationReader } from './components/NarrationReader';
import { CharacterChat } from './components/CharacterChat';
import { CreateStoryModal } from './components/CreateStoryModal';
import { StoryLibraryModal } from './components/StoryLibraryModal';
import { SettingsModal } from './components/SettingsModal';
import { ImageViewerModal } from './components/ImageViewerModal';
import { ExtendStoryModal } from './components/ExtendStoryModal';
import { playChimeSound } from './utils/audio';

const STORAGE_KEY = 'wonderstory_user_stories_v1';
const SETTINGS_KEY = 'wonderstory_settings_v1';

export default function App() {
  // Load saved stories or defaults
  const [stories, setStories] = useState<Story[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved stories', e);
    }
    return DEFAULT_STORIES;
  });

  const [currentStoryId, setCurrentStoryId] = useState<string>(DEFAULT_STORIES[0].id);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // App Settings
  const [settings, setSettings] = useState<GenerationSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      imageResolution: '1K',
      artStyle: 'watercolor',
      aspectRatio: '4:3',
      voice: 'Kore',
      readingSpeed: 1.0,
      autoPlayAudio: false,
      dyslexicFont: false,
      fontSize: 'large',
      soundEffects: true,
    };
  });

  // Modals state
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isExtendOpen, setIsExtendOpen] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [viewerImage, setViewerImage] = useState<{ url: string; title: string } | null>(null);

  // Save stories to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
    } catch (e) {}
  }, [stories]);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  // Get active story
  const currentStory = stories.find((s) => s.id === currentStoryId) || stories[0] || DEFAULT_STORIES[0];
  const currentPage = currentStory.pages[currentPageIndex] || currentStory.pages[0];

  // Helper to update current story pages
  const updatePageInStory = useCallback(
    (pageIdx: number, updates: Partial<StoryPage>) => {
      setStories((prevStories) =>
        prevStories.map((story) => {
          if (story.id !== currentStory.id) return story;
          const newPages = [...story.pages];
          if (newPages[pageIdx]) {
            newPages[pageIdx] = { ...newPages[pageIdx], ...updates };
          }
          return { ...story, pages: newPages };
        })
      );
    },
    [currentStory.id]
  );

  // Generate TTS Audio for a page using gemini-3.1-flash-tts-preview
  const handleGenerateAudio = async (pageIdx: number, voice: VoiceName): Promise<string | undefined> => {
    const page = currentStory.pages[pageIdx];
    if (!page) return;

    updatePageInStory(pageIdx, { isGeneratingAudio: true });
    try {
      const res = await fetch('/api/story/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: page.text,
          voice,
          emotion: currentStory.targetAge === '3-5' ? 'gentle and cheerful' : 'expressive and adventurous',
        }),
      });

      if (!res.ok) {
        throw new Error('TTS generation failed');
      }

      const data = await res.json();
      if (data.audioBase64) {
        updatePageInStory(pageIdx, {
          audioBase64: data.audioBase64,
          audioVoice: voice,
          isGeneratingAudio: false,
        });
        return data.audioBase64;
      }
    } catch (err) {
      console.error('TTS error', err);
    } finally {
      updatePageInStory(pageIdx, { isGeneratingAudio: false });
    }
    return undefined;
  };

  // Generate Illustration for a page using gemini-3-pro-image-preview
  const handleGenerateIllustration = async (
    pageIdx: number,
    customPrompt?: string,
    resolution?: ImageResolution,
    style?: ArtStyle
  ) => {
    const page = currentStory.pages[pageIdx];
    if (!page) return;

    const chosenResolution = resolution || settings.imageResolution;
    const chosenStyle = style || currentStory.artStyle || settings.artStyle;
    const styleObj = ART_STYLES.find((s) => s.id === chosenStyle);

    updatePageInStory(pageIdx, { isGeneratingImage: true });

    try {
      const res = await fetch('/api/story/illustrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: customPrompt || page.illustrationPrompt,
          imageSize: chosenResolution,
          aspectRatio: '4:3',
          artStyle: chosenStyle,
          styleDetails: styleObj?.promptSuffix || '',
        }),
      });

      if (!res.ok) {
        throw new Error('Illustration generation failed');
      }

      const data = await res.json();
      if (data.imageUrl) {
        updatePageInStory(pageIdx, {
          imageUrl: data.imageUrl,
          imageResolution: chosenResolution,
          artStyle: chosenStyle,
          illustrationPrompt: customPrompt || page.illustrationPrompt,
          isGeneratingImage: false,
        });
        playChimeSound('sparkle');
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Illustration error', err);
    } finally {
      updatePageInStory(pageIdx, { isGeneratingImage: false });
    }
  };

  // Extend Story with a new page
  const handleExtendStory = async (childChoice: string) => {
    const nextNum = currentStory.pages.length + 1;
    const previousSummary = currentStory.pages.map((p) => `Page ${p.pageNumber}: ${p.text}`).join('\n');

    try {
      const res = await fetch('/api/story/extend-page', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyTitle: currentStory.title,
          previousPagesText: previousSummary,
          childChoice,
          pageNumber: nextNum,
          targetAge: currentStory.targetAge,
        }),
      });

      if (!res.ok) throw new Error('Extend page failed');
      const newPageData = await res.json();

      const newPage: StoryPage = {
        pageNumber: nextNum,
        text: newPageData.text,
        illustrationPrompt: newPageData.illustrationPrompt,
        sceneDescription: newPageData.sceneDescription,
      };

      setStories((prev) =>
        prev.map((s) => (s.id === currentStory.id ? { ...s, pages: [...s.pages, newPage] } : s))
      );

      // Flip to newly created page
      setCurrentPageIndex(nextNum - 1);
      playChimeSound('success');
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'ArrowRight' && currentPageIndex < currentStory.pages.length - 1) {
        playChimeSound('page-turn');
        setCurrentPageIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentPageIndex > 0) {
        playChimeSound('page-turn');
        setCurrentPageIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPageIndex, currentStory.pages.length]);

  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col font-sans text-slate-900 selection:bg-yellow-300 selection:text-slate-900">
      {/* 1. Global Navigation Header */}
      <StoryHeader
        currentStory={currentStory}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenCreateStory={() => setIsCreateOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
        activeVoice={settings.voice}
        imageResolution={settings.imageResolution}
        isReadingAloud={isReadingAloud}
      />

      {/* 2. Main Reader Experience - Bento Grid Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col justify-center space-y-6">
        {/* Main Bento Grid Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left Column: Visual Illustration Bento Card (Gemini 3 Pro) */}
          <div className="lg:col-span-7 flex flex-col">
            <IllustrationCard
              page={currentPage}
              pageIndex={currentPageIndex}
              totalPages={currentStory.pages.length}
              onGenerateIllustration={handleGenerateIllustration}
              globalResolution={settings.imageResolution}
              globalArtStyle={settings.artStyle}
              onOpenImageViewer={(url, title) => setViewerImage({ url, title })}
            />
          </div>

          {/* Right Column: Audio Narration & Story Text Bento Card (gemini-3.1-flash-tts-preview) */}
          <div className="lg:col-span-5 flex flex-col">
            <NarrationReader
              page={currentPage}
              pageIndex={currentPageIndex}
              totalPages={currentStory.pages.length}
              onPrevPage={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              onNextPage={() => setCurrentPageIndex((prev) => Math.min(currentStory.pages.length - 1, prev + 1))}
              onGenerateAudio={handleGenerateAudio}
              activeVoice={settings.voice}
              onVoiceChange={(v) => setSettings((prev) => ({ ...prev, voice: v }))}
              autoPlayAudio={settings.autoPlayAudio}
              onToggleAutoPlay={() => setSettings((prev) => ({ ...prev, autoPlayAudio: !prev.autoPlayAudio }))}
              dyslexicFont={settings.dyslexicFont}
              fontSize={settings.fontSize}
              onExtendStory={() => setIsExtendOpen(true)}
              onPlayingChange={setIsReadingAloud}
            />
          </div>
        </div>

        {/* Secondary Bento Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Bento Tile 1: Magic Remix Card */}
          <div className="md:col-span-4 bg-emerald-400 rounded-[2rem] p-6 border-3 sm:border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-slate-900">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🎨</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                  Gemini 3 Pro
                </span>
              </div>
              <h4 className="font-black text-xl text-slate-900 leading-tight">Remix this Page</h4>
              <p className="text-xs font-bold text-slate-800 opacity-90 mt-1">
                Add magical weather, sparkle effects, or custom styles to page {currentPage.pageNumber}.
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-2">
              <button
                onClick={() => handleGenerateIllustration(currentPageIndex, `${currentPage.illustrationPrompt}, magical glowing stardust and pastel rainbows`)}
                className="bg-white px-4 py-2 rounded-full font-black text-xs text-slate-900 border-2 border-slate-900 hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                🌈 Rainbow Sparkles!
              </button>
              <button
                onClick={() => handleGenerateIllustration(currentPageIndex, `${currentPage.illustrationPrompt}, winter snow wonderland with soft glowing lights`)}
                className="bg-white px-4 py-2 rounded-full font-black text-xs text-slate-900 border-2 border-slate-900 hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                ❄️ Snowy Weather!
              </button>
            </div>
          </div>

          {/* Bento Tile 2: Character Companion Roster Card */}
          <div className="md:col-span-4 bg-yellow-300 rounded-[2rem] p-6 border-3 sm:border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-slate-900">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">🦉</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                  Live Companion
                </span>
              </div>
              <h4 className="font-black text-xl text-slate-900 leading-tight">Ask Barnaby & Heroes</h4>
              <p className="text-xs font-bold text-slate-800 opacity-90 mt-1">
                Chat about tricky words, morals, or ask characters what they feel!
              </p>
            </div>
            <div className="pt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-white px-4 py-2 rounded-full font-black text-xs text-slate-900 border-2 border-slate-900 hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                🦉 Barnaby the Owl
              </button>
              {currentStory.characters.slice(0, 2).map((char, idx) => (
                <button
                  key={idx}
                  onClick={() => setIsChatOpen(true)}
                  className="bg-white px-4 py-2 rounded-full font-black text-xs text-slate-900 border-2 border-slate-900 hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                >
                  {char.avatarIcon || '⭐'} {char.name}
                </button>
              ))}
            </div>
          </div>

          {/* Bento Tile 3: Storybook Progress & Page Jumpers */}
          <div className="md:col-span-4 bg-white rounded-[2rem] p-6 border-3 sm:border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between text-slate-900">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">📚</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-950 px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                  {currentStory.pages.length} Pages
                </span>
              </div>
              <h4 className="font-black text-xl text-slate-900 leading-tight">Story Progression</h4>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Theme: <span className="text-slate-900 font-extrabold">{currentStory.theme}</span> · Ages {currentStory.targetAge}
              </p>
            </div>

            {/* Thumbnail dots & quick jump */}
            <div className="pt-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {currentStory.pages.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playChimeSound('page-turn');
                      setCurrentPageIndex(idx);
                    }}
                    className={`w-8 h-8 rounded-xl font-black text-xs border-2 border-slate-900 flex items-center justify-center transition-all cursor-pointer ${
                      currentPageIndex === idx
                        ? 'bg-orange-500 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] scale-105'
                        : 'bg-slate-100 text-slate-800 hover:bg-slate-200 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]'
                    }`}
                    title={`Jump to Page ${p.pageNumber}`}
                  >
                    {p.pageNumber}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setIsExtendOpen(true)}
                className="bg-purple-200 hover:bg-purple-300 text-slate-900 px-3.5 py-2 rounded-2xl font-black text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer shrink-0 flex items-center gap-1"
                title="Add new page with AI"
              >
                <span>+ Page</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Multi-Turn Character & Owl Companion Chatbot */}
      <CharacterChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        story={currentStory}
        currentPage={currentPage}
        activeVoice={settings.voice}
        onPlayTts={async (text) => {
          try {
            const res = await fetch('/api/story/tts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text, voice: settings.voice, emotion: 'cheerful' }),
            });
            const data = await res.json();
            if (data.audioBase64) {
              const audio = new Audio(`data:audio/wav;base64,${data.audioBase64}`);
              audio.play();
            }
          } catch (e) {
            console.error(e);
          }
        }}
      />

      {/* 4. Modals */}
      <CreateStoryModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onStoryCreated={(newStory) => {
          setStories((prev) => [newStory, ...prev]);
          setCurrentStoryId(newStory.id);
          setCurrentPageIndex(0);
        }}
      />

      <StoryLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        stories={stories}
        currentStoryId={currentStoryId}
        onSelectStory={(story) => {
          setCurrentStoryId(story.id);
          setCurrentPageIndex(0);
        }}
        onDeleteCustomStory={(storyId) => {
          setStories((prev) => prev.filter((s) => s.id !== storyId));
          if (currentStoryId === storyId) {
            setCurrentStoryId(DEFAULT_STORIES[0].id);
            setCurrentPageIndex(0);
          }
        }}
        onOpenCreateStory={() => setIsCreateOpen(true)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
      />

      <ImageViewerModal
        isOpen={Boolean(viewerImage)}
        onClose={() => setViewerImage(null)}
        imageUrl={viewerImage?.url || ''}
        title={viewerImage?.title || 'Story Artwork'}
      />

      <ExtendStoryModal
        isOpen={isExtendOpen}
        onClose={() => setIsExtendOpen(false)}
        storyTitle={currentStory.title}
        currentPageNumber={currentPage.pageNumber}
        onExtend={handleExtendStory}
      />
    </div>
  );
}
