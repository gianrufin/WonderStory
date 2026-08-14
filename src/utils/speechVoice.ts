// Natural Voice Selector & Speech Synthesis Engine
// Ensures human-like, warm, non-robotic narration across browsers and incognito sessions

export interface SpeechVoiceOption {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
  isNatural: boolean;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

export function getAvailableSpeechVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    cachedVoices = voices;
  }
  return cachedVoices.length > 0 ? cachedVoices : voices;
}

// Select the best, warmest, most natural human-sounding voice available on the device
export function getBestNaturalVoice(preferredGender: 'Female' | 'Male' | 'Neutral' = 'Female'): SpeechSynthesisVoice | null {
  const voices = getAvailableSpeechVoices();
  if (!voices || voices.length === 0) return null;

  // Priority search terms for premium natural voices
  const naturalKeywords = [
    'natural',
    'online',
    'neural',
    'google us english',
    'google uk english female',
    'samantha',
    'karen',
    'daniel',
    'victoria',
    'serena',
    'oliver',
    'george',
    'zira',
    'david'
  ];

  // 1. First priority: English voices matching natural/neural keywords
  const englishVoices = voices.filter((v) => v.lang.startsWith('en'));
  
  if (preferredGender === 'Female') {
    const femaleKeywords = ['female', 'samantha', 'karen', 'victoria', 'serena', 'zira', 'kore', 'jenny', 'aria'];
    const bestFemale = englishVoices.find((v) => 
      femaleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (bestFemale) return bestFemale;
  } else if (preferredGender === 'Male') {
    const maleKeywords = ['male', 'daniel', 'oliver', 'george', 'david', 'guy', 'ryan'];
    const bestMale = englishVoices.find((v) => 
      maleKeywords.some((k) => v.name.toLowerCase().includes(k))
    );
    if (bestMale) return bestMale;
  }

  // 2. High quality Google/Microsoft/Apple natural voice
  const bestNatural = englishVoices.find((v) =>
    naturalKeywords.some((k) => v.name.toLowerCase().includes(k))
  );
  if (bestNatural) return bestNatural;

  // 3. Any English voice
  if (englishVoices.length > 0) {
    // Prefer non-default local synthesizers if available
    const nonLocal = englishVoices.find((v) => !v.localService) || englishVoices[0];
    return nonLocal;
  }

  return voices[0] || null;
}
