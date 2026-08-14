export type AgeGroup = '3-5' | '6-8' | '9-12';

export type ArtStyle = 
  | 'watercolor'
  | 'pixar3d'
  | 'claymation'
  | 'storybook'
  | 'papercraft'
  | 'cosmic'
  | 'anime';

export type ImageResolution = '1K' | '2K' | '4K';

export type AspectRatio = '1:1' | '4:3' | '16:9';

export type VoiceName = 'Kore' | 'Puck' | 'Fenrir' | 'Zephyr' | 'Charon';

export interface StoryCharacter {
  name: string;
  role: string;
  description: string;
  avatarIcon?: string;
}

export interface StoryPage {
  pageNumber: number;
  text: string;
  illustrationPrompt: string;
  sceneDescription?: string;
  imageUrl?: string;
  imageResolution?: ImageResolution;
  artStyle?: ArtStyle;
  audioBase64?: string;
  audioVoice?: VoiceName;
  isGeneratingImage?: boolean;
  isGeneratingAudio?: boolean;
}

export interface Story {
  id: string;
  title: string;
  tagline: string;
  theme: string;
  targetAge: AgeGroup;
  artStyle: ArtStyle;
  coverImage?: string;
  characters: StoryCharacter[];
  pages: StoryPage[];
  createdAt: number;
  isCustom?: boolean;
}

export type ChatbotRole = 'storyteller' | 'character' | 'art_wizard' | 'co_author';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  speakerName?: string;
  speakerAvatar?: string;
  suggestedPrompts?: string[];
}

export interface GenerationSettings {
  imageResolution: ImageResolution;
  artStyle: ArtStyle;
  aspectRatio: AspectRatio;
  voice: VoiceName;
  readingSpeed: number; // 0.8 to 1.2
  autoPlayAudio: boolean;
  dyslexicFont: boolean;
  fontSize: 'medium' | 'large' | 'huge';
  soundEffects: boolean;
}
