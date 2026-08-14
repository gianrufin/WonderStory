import React from 'react';
import { X, Download, Sparkles } from 'lucide-react';

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-fade-in">
      {/* Top Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between py-2 text-white">
        <div className="flex items-center gap-2.5 bg-white text-slate-900 px-4 py-2 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <span className="font-black text-sm sm:text-base">{title}</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Frame */}
      <div className="flex-1 flex items-center justify-center p-2 max-w-5xl w-full">
        <img
          src={imageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="max-h-[75vh] max-w-full rounded-[2rem] object-contain shadow-[10px_10px_0px_0px_rgba(15,23,42,1)] border-4 border-slate-900 bg-white"
        />
      </div>

      {/* Footer Info */}
      <div className="py-2 px-4 rounded-xl bg-white text-slate-900 font-black text-xs border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
        Rendered with Google Gemini 3 Pro Vision Image Generator
      </div>
    </div>
  );
};
