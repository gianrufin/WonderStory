import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Sparkles, X, Volume2, Bot, User, RefreshCw, Wand2, BookOpen, Lightbulb } from 'lucide-react';
import { Story, StoryPage, ChatMessage, ChatbotRole, VoiceName } from '../types';
import { playChimeSound } from '../utils/audio';

interface CharacterChatProps {
  isOpen: boolean;
  onClose: () => void;
  story: Story;
  currentPage: StoryPage;
  activeVoice: VoiceName;
  onPlayTts: (text: string) => void;
}

export const CharacterChat: React.FC<CharacterChatProps> = ({
  isOpen,
  onClose,
  story,
  currentPage,
  activeVoice,
  onPlayTts,
}) => {
  const [activeRole, setActiveRole] = useState<ChatbotRole>('storyteller');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current story main character
  const mainCharacter = story.characters?.[0] || { name: 'Story Hero', role: 'Protagonist', avatarIcon: '⭐' };

  // Initialize or reset welcome message when role changes
  useEffect(() => {
    let welcome = '';
    let speaker = 'Barnaby the Story Owl';
    let avatar = '🦉';

    if (activeRole === 'character') {
      speaker = mainCharacter.name;
      avatar = mainCharacter.avatarIcon || '🐲';
      welcome = `Hi there, little explorer! It's me, ${mainCharacter.name}! I'm right here on Page ${currentPage.pageNumber}. What do you want to ask me? *wiggles with excitement*`;
    } else if (activeRole === 'art_wizard') {
      speaker = 'Sparky the Art Wizard';
      avatar = '🎨';
      welcome = `Hooray! I'm Sparky! Want to imagine what new magic illustrations we can draw on Page ${currentPage.pageNumber}? Tell me your favorite colors or creatures!`;
    } else if (activeRole === 'co_author') {
      speaker = 'Story Co-Author Genie';
      avatar = '📖';
      welcome = `Greetings, young storyteller! What thrilling twist should we write next for ${story.title}? You're the boss of this adventure!`;
    } else {
      speaker = 'Barnaby the Story Owl';
      avatar = '🦉';
      welcome = `Hoo-hoo! I'm Barnaby the Story Owl. I'm reading "${story.title}" with you! Did you have any questions about the words, characters, or what happens next?`;
    }

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: welcome,
        timestamp: Date.now(),
        speakerName: speaker,
        speakerAvatar: avatar,
      },
    ]);
  }, [activeRole, story.id, currentPage.pageNumber]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    playChimeSound('click');

    try {
      // Determine complexity based on role
      const taskComplexity = activeRole === 'co_author' ? 'complex' : activeRole === 'art_wizard' ? 'fast' : 'general';

      const res = await fetch('/api/story/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: activeRole,
          characterName: mainCharacter.name,
          storyTitle: story.title,
          currentPageText: currentPage.text,
          message,
          taskComplexity,
          conversationHistory: messages
            .filter((m) => m.role === 'user' || m.role === 'model')
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      if (data.reply) {
        let speaker = 'Barnaby';
        let avatar = '🦉';
        if (activeRole === 'character') {
          speaker = mainCharacter.name;
          avatar = mainCharacter.avatarIcon || '🐲';
        } else if (activeRole === 'art_wizard') {
          speaker = 'Sparky';
          avatar = '🎨';
        } else if (activeRole === 'co_author') {
          speaker = 'Story Genie';
          avatar = '📖';
        }

        const modelMsg: ChatMessage = {
          id: `model-${Date.now()}`,
          role: 'model',
          content: data.reply,
          timestamp: Date.now(),
          speakerName: speaker,
          speakerAvatar: avatar,
        };

        setMessages((prev) => [...prev, modelMsg]);
        playChimeSound('sparkle');
      }
    } catch (err) {
      console.error('Chat failed', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          content: "Oops! My magic wand hiccuped for a second. Let's try asking again!",
          timestamp: Date.now(),
          speakerName: 'Barnaby',
          speakerAvatar: '🦉',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPromptSuggestions: Record<ChatbotRole, string[]> = {
    storyteller: [
      '🦉 What does this page mean?',
      '⭐ What lesson did we learn?',
      '🔍 Explain the tricky words',
      '✨ Tell me a fun fact about this',
    ],
    character: [
      `👋 Hi ${mainCharacter.name}, what is your favorite snack?`,
      '🌟 Are you scared or brave right now?',
      '🎈 Can we be best friends forever?',
      '✨ What is your favorite magic power?',
    ],
    art_wizard: [
      '🎨 How can we make this drawing even more magical?',
      '🌈 Can we add rainbow sparkles to this scene?',
      '🦄 What cute animal should we add?',
      '✨ Suggest a new 4K illustration idea',
    ],
    co_author: [
      '📖 What exciting thing should happen next?',
      '🦸 Can we give the hero a special surprise?',
      '🚀 What if they travel somewhere new?',
      '🪄 Let us write page 2 together!',
    ],
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 md:w-[420px] bg-white border-l-4 border-slate-900 shadow-[-8px_0px_0px_0px_rgba(15,23,42,1)] flex flex-col animate-slide-in">
      {/* Drawer Header */}
      <div className="bg-indigo-600 p-4 text-white flex items-center justify-between border-b-4 border-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-yellow-300 border-2 border-slate-900 flex items-center justify-center text-xl text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
            🦉
          </div>
          <div>
            <h3 className="font-black text-sm sm:text-base leading-tight flex items-center gap-1.5">
              Story Companion & Chat
            </h3>
            <p className="text-[11px] font-bold text-indigo-200">Gemini AI Assistant</p>
          </div>
        </div>

        <button
          id="btn-close-chat"
          onClick={onClose}
          className="p-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          title="Close Chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Role Switcher Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-2.5 bg-indigo-50 border-b-3 border-slate-900 text-center">
        {[
          { id: 'storyteller', label: 'Story Owl', icon: '🦉' },
          { id: 'character', label: mainCharacter.name.split(' ')[0], icon: mainCharacter.avatarIcon || '🐲' },
          { id: 'art_wizard', label: 'Art Wizard', icon: '🎨' },
          { id: 'co_author', label: 'Co-Author', icon: '📖' },
        ].map((tab) => (
          <button
            key={tab.id}
            id={`tab-role-${tab.id}`}
            onClick={() => setActiveRole(tab.id as ChatbotRole)}
            className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-0.5 border-2 border-slate-900 cursor-pointer ${
              activeRole === tab.id
                ? 'bg-yellow-300 text-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] translate-x-0.5 translate-y-0.5'
                : 'bg-white text-slate-700 hover:bg-slate-100 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
            }`}
          >
            <span className="text-base leading-none">{tab.icon}</span>
            <span className="truncate w-full text-[10px]">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FFFBEB]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.role === 'model' && (
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-sm">{msg.speakerAvatar}</span>
                <span className="text-[11px] font-black text-slate-900">{msg.speakerName}</span>
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold border-2 border-slate-900 leading-relaxed shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] ${
                msg.role === 'user'
                  ? 'bg-orange-400 text-slate-900 rounded-tr-xs'
                  : 'bg-white text-slate-900 rounded-tl-xs'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {msg.role === 'model' && (
                <div className="mt-2 pt-1.5 border-t border-slate-900/10 flex items-center justify-end">
                  <button
                    onClick={() => onPlayTts(msg.content)}
                    className="flex items-center gap-1 text-[11px] text-indigo-700 hover:text-indigo-900 font-black cursor-pointer"
                    title="Read this message aloud"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] w-fit">
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-black text-slate-900">
              Thinking with Gemini...
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestion Chips for Kids */}
      <div className="p-3 bg-white border-t-3 border-slate-900">
        <div className="flex items-center gap-1 mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">
            Quick Prompts:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
          {quickPromptSuggestions[activeRole]?.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] bg-yellow-100 hover:bg-yellow-200 text-slate-900 border-2 border-slate-900 px-2.5 py-1 rounded-xl font-black shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all text-left cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input Box */}
      <div className="p-3 bg-white border-t-3 border-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="input-chat-message"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${activeRole === 'character' ? mainCharacter.name : 'Barnaby'} anything...`}
            className="flex-1 bg-slate-100 text-xs sm:text-sm text-slate-900 rounded-xl px-3.5 py-2.5 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] focus:outline-none font-bold"
          />
          <button
            id="btn-send-chat"
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 bg-orange-500 hover:bg-orange-600 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-40 text-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all cursor-pointer"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
