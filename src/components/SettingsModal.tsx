import React from 'react';
import { X, Sliders, Volume2, Image as ImageIcon, Type as TypeIcon, Sparkles, Check } from 'lucide-react';
import { GenerationSettings, ImageResolution, VoiceName, ArtStyle } from '../types';
import { VOICE_OPTIONS, ART_STYLES } from '../data/defaultStories';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GenerationSettings;
  onUpdateSettings: (newSettings: Partial<GenerationSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] max-w-lg w-full border-3 sm:border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden flex flex-col my-8">
        {/* Header */}
        <div className="bg-indigo-600 p-5 text-white flex items-center justify-between border-b-3 sm:border-b-4 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">Audio & Visual Settings</h2>
              <p className="text-xs text-indigo-200 font-bold">Configure Gemini models & reading preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[70vh] bg-[#FFFBEB]">
          {/* 1. Image Resolution Affordance (1K, 2K, 4K) */}
          <div className="bg-white p-4 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-orange-500" />
              <span>Image Resolution (Gemini 3 Pro):</span>
            </label>
            <p className="text-xs text-slate-600 font-bold mb-3">
              Configure detail resolution for page illustrations (gemini-3-pro-image-preview).
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                <button
                  key={res}
                  id={`settings-res-${res}`}
                  onClick={() => onUpdateSettings({ imageResolution: res })}
                  className={`py-2 px-3 rounded-xl border-2 border-slate-900 text-center font-black text-xs transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                    settings.imageResolution === res
                      ? 'bg-yellow-300 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] translate-x-0.5 translate-y-0.5'
                      : 'bg-white text-slate-700 hover:bg-amber-50 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                  }`}
                >
                  <span className="text-sm">{res}</span>
                  <span className="text-[10px] opacity-80 font-bold">
                    {res === '1K' ? 'Standard' : res === '2K' ? 'High Res' : 'Ultra HD'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Default Narration Voice */}
          <div>
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-indigo-600" />
              <span>Narrator Voice (gemini-3.1-flash-tts-preview):</span>
            </label>
            <div className="space-y-2">
              {VOICE_OPTIONS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => onUpdateSettings({ voice: v.id as VoiceName })}
                  className={`w-full p-3 rounded-2xl border-2 border-slate-900 text-left flex items-center justify-between transition-all cursor-pointer ${
                    settings.voice === v.id
                      ? 'bg-yellow-300 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] translate-x-0.5 translate-y-0.5 font-black text-slate-900'
                      : 'bg-white text-slate-800 hover:bg-slate-50 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] font-bold'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black text-slate-900">{v.name}</span>
                    <span className="text-xs text-slate-600 ml-2">({v.personality})</span>
                    <p className="text-[11px] text-slate-600 font-medium">{v.description}</p>
                  </div>
                  {settings.voice === v.id && <Check className="w-4 h-4 text-slate-900 stroke-[3] shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Text Size & Dyslexia Friendly Toggle */}
          <div className="pt-3 border-t-2 border-slate-900/10 space-y-3">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TypeIcon className="w-4 h-4 text-slate-800" />
              <span>Typography & Accessibility:</span>
            </label>

            <div className="flex gap-2">
              {(['medium', 'large', 'huge'] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdateSettings({ fontSize: size })}
                  className={`flex-1 py-2 text-xs font-black capitalize rounded-xl border-2 border-slate-900 transition-all cursor-pointer ${
                    settings.fontSize === size
                      ? 'bg-orange-500 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                      : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                  }`}
                >
                  {size} Text
                </button>
              ))}
            </div>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer">
              <div>
                <p className="text-xs font-black text-slate-900">Dyslexia-Friendly Legibility Font</p>
                <p className="text-[11px] text-slate-600 font-bold">Uses open wide letter-spacing font</p>
              </div>
              <input
                type="checkbox"
                checked={settings.dyslexicFont}
                onChange={(e) => onUpdateSettings({ dyslexicFont: e.target.checked })}
                className="w-5 h-5 text-indigo-600 rounded-md border-2 border-slate-900 focus:ring-0 cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t-3 sm:border-t-4 border-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            Save & Done
          </button>
        </div>
      </div>
    </div>
  );
};
