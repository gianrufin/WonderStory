import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { StoryPage, VoiceName } from '../types';
import { VOICE_OPTIONS } from '../data/defaultStories';
import { playChimeSound } from '../utils/audio';

interface NarrationReaderProps {
  page: StoryPage;
  pageIndex: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onGenerateAudio: (pageIndex: number, voice: VoiceName) => Promise<string | undefined>;
  activeVoice: VoiceName;
  onVoiceChange: (voice: VoiceName) => void;
  autoPlayAudio: boolean;
  onToggleAutoPlay: () => void;
  dyslexicFont: boolean;
  fontSize: 'medium' | 'large' | 'huge';
  onExtendStory: () => void;
  onPlayingChange?: (isPlaying: boolean) => void;
}

export const NarrationReader: React.FC<NarrationReaderProps> = ({
  page,
  pageIndex,
  totalPages,
  onPrevPage,
  onNextPage,
  onGenerateAudio,
  activeVoice,
  onVoiceChange,
  autoPlayAudio,
  onToggleAutoPlay,
  dyslexicFont,
  fontSize,
  onExtendStory,
  onPlayingChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const words = page.text.split(' ');

  // Stop previous audio when page changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    onPlayingChange?.(false);
    setActiveWordIndex(null);
    setPlaybackProgress(0);

    // If auto-play is enabled, trigger audio generation / play
    if (autoPlayAudio) {
      handlePlayNarration();
    }
  }, [pageIndex, page.text]);

  const handlePlayNarration = async () => {
    // If currently playing, pause it
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      onPlayingChange?.(false);
      return;
    }

    // If we have an existing audio element paused, resume it
    if (audioRef.current && audioRef.current.src && !audioRef.current.ended) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        onPlayingChange?.(true);
      }).catch(() => {});
      return;
    }

    setIsLoadingAudio(true);
    try {
      let audioBase64 = page.audioBase64;
      if (!audioBase64 || page.audioVoice !== activeVoice) {
        audioBase64 = await onGenerateAudio(pageIndex, activeVoice);
      }

      if (audioBase64) {
        const audioSrc = `data:audio/wav;base64,${audioBase64}`;
        const audio = new Audio(audioSrc);
        audioRef.current = audio;

        audio.ontimeupdate = () => {
          if (audio.duration) {
            const ratio = audio.currentTime / audio.duration;
            setPlaybackProgress(ratio * 100);
            const targetWord = Math.min(Math.floor(ratio * words.length), words.length - 1);
            setActiveWordIndex(targetWord);
          }
        };

        audio.onended = () => {
          setIsPlaying(false);
          onPlayingChange?.(false);
          setActiveWordIndex(null);
          setPlaybackProgress(100);
          playChimeSound('sparkle');
        };

        await audio.play();
        setIsPlaying(true);
        onPlayingChange?.(true);
      } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        // High quality client-side fallback narration
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(page.text);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;

        // Try to match voice tone
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices.length > 0) {
          const naturalVoice = availableVoices.find((v) => v.name.includes('Natural') || v.name.includes('Google') || v.lang.startsWith('en')) || availableVoices[0];
          if (naturalVoice) utterance.voice = naturalVoice;
        }

        utterance.onboundary = (e) => {
          if (e.name === 'word') {
            const charIdx = e.charIndex;
            const textSoFar = page.text.slice(0, charIdx);
            const wordIdx = Math.max(0, textSoFar.trim().split(/\s+/).length - 1);
            setActiveWordIndex(Math.min(wordIdx, words.length - 1));
            setPlaybackProgress((charIdx / Math.max(1, page.text.length)) * 100);
          }
        };

        utterance.onend = () => {
          setIsPlaying(false);
          onPlayingChange?.(false);
          setActiveWordIndex(null);
          setPlaybackProgress(100);
          playChimeSound('sparkle');
        };

        utterance.onerror = () => {
          setIsPlaying(false);
          onPlayingChange?.(false);
        };

        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        onPlayingChange?.(true);
      }
    } catch (err) {
      console.error('Audio playback failed', err);
    } finally {
      setIsLoadingAudio(false);
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      onPlayingChange?.(true);
    } else {
      handlePlayNarration();
    }
  };

  const fontSizeClass = {
    medium: 'text-lg sm:text-xl leading-relaxed',
    large: 'text-xl sm:text-2xl leading-loose font-bold',
    huge: 'text-2xl sm:text-3xl leading-loose font-black',
  }[fontSize];

  return (
    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border-3 sm:border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)] flex flex-col justify-between h-full">
      {/* Top Header & Page Navigation Info */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b-2 border-slate-900/10">
          <div className="flex items-center gap-2">
            <h3 className="text-indigo-600 font-black uppercase text-xs sm:text-sm tracking-wider">
              Page {page.pageNumber} of {totalPages}
            </h3>
          </div>

          {/* Voice Selector & Autoplay Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-yellow-100 px-3 py-1 rounded-xl border-2 border-slate-900 text-xs font-black text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <Volume2 className="w-3.5 h-3.5 text-indigo-700" />
              <select
                id="select-narration-voice"
                value={activeVoice}
                onChange={(e) => onVoiceChange(e.target.value as VoiceName)}
                className="bg-transparent font-black focus:outline-none cursor-pointer text-slate-900"
                title="Select Narrator Voice (gemini-3.1-flash-tts-preview)"
              >
                {VOICE_OPTIONS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.personality})
                  </option>
                ))}
              </select>
            </div>

            <button
              id="btn-toggle-autoplay"
              onClick={onToggleAutoPlay}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-xs font-black flex items-center gap-1 cursor-pointer ${
                autoPlayAudio
                  ? 'bg-emerald-300 text-slate-900'
                  : 'bg-white text-slate-500 hover:bg-slate-100'
              }`}
              title={autoPlayAudio ? 'Auto-play narration enabled' : 'Auto-play narration disabled'}
            >
              {autoPlayAudio ? <Volume2 className="w-4 h-4 text-emerald-800" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="hidden lg:inline text-[11px]">Auto-Read</span>
            </button>
          </div>
        </div>

        {/* Story Text Box with Bento Typography & Word Highlighting */}
        <div className="my-3 min-h-[160px] sm:min-h-[220px] flex items-center justify-center p-4 sm:p-6 bg-[#FFFBEB] rounded-2xl sm:rounded-3xl border-3 border-slate-900 shadow-inner">
          <p className={`${fontSizeClass} ${dyslexicFont ? 'font-mono tracking-wide' : 'font-sans'} text-slate-900 text-center select-text`}>
            {words.map((word, idx) => (
              <span
                key={idx}
                className={`transition-all duration-150 inline-block mx-1 rounded-lg px-1.5 py-0.5 ${
                  activeWordIndex === idx
                    ? 'bg-yellow-300 text-slate-900 font-black border-2 border-slate-900 scale-110 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                    : ''
                }`}
              >
                {word}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Audio Visualizer / Player Progress Bar */}
      <div className="mt-4 pt-4 border-t-2 border-slate-900/10 flex flex-col gap-4">
        {/* Bento Audio Player Bar */}
        <div className="flex items-center gap-3">
          {/* Big Play Button */}
          <button
            id="btn-play-tts"
            onClick={handlePlayNarration}
            disabled={isLoadingAudio}
            className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-white rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-50 transition-all"
            title="Read aloud with gemini-3.1-flash-tts-preview"
          >
            {isLoadingAudio ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause className="w-6 h-6 fill-white" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>

          {/* Progress Bar & Status */}
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-black text-slate-700">
              <span>{isPlaying ? 'Reading Aloud...' : 'Click to Listen'}</span>
              <span>{Math.round(playbackProgress)}%</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full border-2 border-slate-900 overflow-hidden shadow-inner">
              <div
                className="bg-indigo-600 h-full transition-all duration-150 rounded-full"
                style={{ width: `${playbackProgress}%` }}
              ></div>
            </div>
          </div>

          {isPlaying && (
            <button
              id="btn-restart-tts"
              onClick={handleRestart}
              className="p-3 bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 rounded-2xl active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer shrink-0"
              title="Replay from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Page Nav Arrows & Add Next Page */}
        <div className="flex items-center justify-between gap-2 pt-2">
          {/* Previous Page */}
          <button
            id="btn-prev-page"
            onClick={() => {
              playChimeSound('page-turn');
              onPrevPage();
            }}
            disabled={pageIndex === 0}
            className="flex items-center gap-1 px-4 py-2.5 text-xs sm:text-sm font-black text-slate-900 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white border-2 border-slate-900 rounded-2xl transition-all shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          {/* Extend Story with AI button */}
          <button
            id="btn-extend-story"
            onClick={onExtendStory}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-purple-200 hover:bg-purple-300 text-slate-900 font-black text-xs sm:text-sm rounded-2xl border-2 border-slate-900 transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
            title="Co-write the next page with Gemini"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-800" />
            <span>Co-Write Next</span>
          </button>

          {/* Next Page */}
          <button
            id="btn-next-page"
            onClick={() => {
              playChimeSound('page-turn');
              onNextPage();
            }}
            disabled={pageIndex === totalPages - 1}
            className="flex items-center gap-1 px-5 py-2.5 text-xs sm:text-sm font-black text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:hover:bg-orange-500 rounded-2xl border-2 border-slate-900 transition-all shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
