import React, { useState } from 'react';
import { Sparkles, RefreshCw, Maximize2, Wand2, Image as ImageIcon, SlidersHorizontal } from 'lucide-react';
import { StoryPage, ImageResolution, ArtStyle } from '../types';
import { ART_STYLES } from '../data/defaultStories';

interface IllustrationCardProps {
  page: StoryPage;
  pageIndex: number;
  totalPages: number;
  onGenerateIllustration: (pageIndex: number, customPrompt?: string, resolution?: ImageResolution, style?: ArtStyle) => Promise<void>;
  globalResolution: ImageResolution;
  globalArtStyle: ArtStyle;
  onOpenImageViewer: (imageUrl: string, title: string) => void;
}

export const IllustrationCard: React.FC<IllustrationCardProps> = ({
  page,
  pageIndex,
  totalPages,
  onGenerateIllustration,
  globalResolution,
  globalArtStyle,
  onOpenImageViewer,
}) => {
  const [selectedResolution, setSelectedResolution] = useState<ImageResolution>(globalResolution || '1K');
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>(globalArtStyle || 'watercolor');
  const [customPromptText, setCustomPromptText] = useState(page.illustrationPrompt || '');
  const [showPromptEditor, setShowPromptEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(page.isGeneratingImage || false);

  // Sync prompt text when page changes
  React.useEffect(() => {
    setCustomPromptText(page.illustrationPrompt || '');
    setIsLoading(page.isGeneratingImage || false);
  }, [page.illustrationPrompt, page.isGeneratingImage, pageIndex]);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      await onGenerateIllustration(pageIndex, customPromptText, selectedResolution, selectedStyle);
    } finally {
      setIsLoading(false);
    }
  };

  const quickRemixIdeas = [
    '✨ Add glittering rainbow sparkles in the sky',
    '🌙 Change scene to glowing starlit bedtime night',
    '🌸 Add colorful singing woodland flowers',
    '🎈 Add floating magical pastel balloons',
  ];

  return (
    <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-6 border-3 sm:border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col justify-between h-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-orange-400 border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            <ImageIcon className="w-5 h-5 text-slate-900" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-2">
              Page {page.pageNumber} Illustration
              {page.imageUrl && (
                <span className="text-[10px] sm:text-xs bg-emerald-300 text-slate-900 font-black px-2.5 py-0.5 rounded-full border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
                  Ready ({page.imageResolution || selectedResolution})
                </span>
              )}
            </h3>
          </div>
        </div>

        {/* Action button toggles */}
        <div className="flex items-center gap-2">
          <button
            id={`btn-remix-prompt-${pageIndex}`}
            onClick={() => setShowPromptEditor(!showPromptEditor)}
            className={`px-3 py-1.5 text-xs font-black rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1.5 cursor-pointer ${
              showPromptEditor
                ? 'bg-yellow-300 text-slate-900'
                : 'bg-white text-slate-800 hover:bg-amber-100'
            }`}
            title="Customise what to draw"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Customize Prompt</span>
          </button>

          {page.imageUrl && (
            <button
              id={`btn-fullscreen-img-${pageIndex}`}
              onClick={() => onOpenImageViewer(page.imageUrl!, `Page ${page.pageNumber} Artwork`)}
              className="p-2 text-slate-900 bg-white hover:bg-slate-100 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              title="View full screen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Image Display Box */}
      <div className="relative w-full aspect-4/3 sm:aspect-16/10 rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-amber-100 border-3 sm:border-4 border-slate-900 shadow-inner flex items-center justify-center group">
        {page.imageUrl ? (
          <>
            <img
              src={page.imageUrl}
              alt={`Page ${page.pageNumber} illustration`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
            />
            {/* Resolution watermark tag */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 font-mono text-[11px] font-black px-2.5 py-1 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              Gemini 3 Pro · {page.imageResolution || selectedResolution}
            </div>
          </>
        ) : (
          /* Bento Placeholder Canvas */
          <div className="w-full h-full p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden bg-indigo-100/60">
            {/* Playful background bento floating bubbles */}
            <div className="absolute w-56 h-56 bg-emerald-300 rounded-full -bottom-16 -left-10 opacity-50 border-3 border-slate-900"></div>
            <div className="absolute w-44 h-44 bg-yellow-300 rounded-full -top-12 -right-8 opacity-60 border-3 border-slate-900"></div>

            <div className="relative z-10 flex flex-col items-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-orange-400 border-3 border-slate-900 flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mb-3 transform -rotate-3">
                🎨
              </div>
              <h4 className="font-black text-slate-900 text-lg sm:text-xl mb-1">
                Magic Illustration Canvas
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-bold mb-4 leading-relaxed">
                Generate a high-detail picture with Gemini 3 Pro in 1K, 2K, or 4K resolution.
              </p>
              <button
                id={`btn-generate-first-img-${pageIndex}`}
                onClick={handleGenerate}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-white font-black text-sm rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Paint Page {page.pageNumber} Illustration</span>
              </button>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-yellow-300 border-3 border-slate-900 flex items-center justify-center text-3xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] animate-bounce mb-3">
              🪄
            </div>
            <div className="bg-white px-5 py-3 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] max-w-sm">
              <h4 className="font-black text-slate-900 text-base mb-1">
                ✨ Generating Magic Illustration...
              </h4>
              <p className="text-xs text-slate-600 font-bold">
                Rendering in crisp <span className="text-orange-600 font-extrabold">{selectedResolution}</span> resolution ({selectedStyle} style) with Gemini 3 Pro
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Resolution & Style Affordance Controls Bar */}
      <div className="mt-3.5 bg-amber-50 p-3 sm:p-3.5 rounded-2xl border-2 sm:border-3 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Resolution Selector (1K, 2K, 4K) */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-900 flex items-center gap-1">
              Resolution:
            </span>
            <div className="inline-flex rounded-xl p-0.5 bg-white border-2 border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]">
              {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                <button
                  key={res}
                  id={`btn-resolution-${res}-${pageIndex}`}
                  onClick={() => setSelectedResolution(res)}
                  className={`px-2.5 py-1 text-xs font-black rounded-lg transition-all cursor-pointer ${
                    selectedResolution === res
                      ? 'bg-orange-500 text-white shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                  title={`${res} High Definition Resolution`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>

          {/* Art Style Picker */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-900 hidden sm:inline">Style:</span>
            <select
              id={`select-artstyle-${pageIndex}`}
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as ArtStyle)}
              className="bg-white text-slate-900 font-black text-xs rounded-xl border-2 border-slate-900 px-3 py-1.5 focus:outline-none shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
            >
              {ART_STYLES.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.icon} {style.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Regenerate / Re-draw Button */}
          <button
            id={`btn-regenerate-img-${pageIndex}`}
            onClick={handleGenerate}
            disabled={isLoading}
            className="ml-auto flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-white font-black text-xs rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all disabled:opacity-50 cursor-pointer"
            title="Generate new illustration with Gemini 3 Pro"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{page.imageUrl ? 'Re-Draw' : 'Generate Artwork'}</span>
          </button>
        </div>

        {/* Prompt Editor & Magic Suggestions Accordion */}
        {showPromptEditor && (
          <div className="mt-3 pt-3 border-t-2 border-slate-900/20">
            <label className="block text-xs font-black text-slate-900 mb-1">
              Scene Illustration Prompt (Gemini 3 Pro):
            </label>
            <textarea
              id={`textarea-prompt-${pageIndex}`}
              value={customPromptText}
              onChange={(e) => setCustomPromptText(e.target.value)}
              rows={2}
              className="w-full bg-white text-xs text-slate-900 p-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] focus:outline-none font-bold resize-none"
              placeholder="Describe what Gemini 3 Pro should paint..."
            />

            {/* Quick Remix suggestions */}
            <div className="mt-2">
              <span className="text-[11px] font-black text-slate-800 mb-1 block">
                ✨ Magic Idea Sparks for Kids:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickRemixIdeas.map((idea, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCustomPromptText((prev) => `${prev.trim()}, ${idea.replace(/^[^a-zA-Z0-9]+/, '')}`);
                    }}
                    className="text-[11px] bg-white hover:bg-yellow-200 text-slate-900 border-2 border-slate-900 px-2 py-0.5 rounded-lg transition-colors font-black shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] text-left cursor-pointer"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
