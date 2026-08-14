# WonderStory 📖✨
### Interactive Children's Audio & Illustrated Storybook with Gemini AI

[![Live Application](https://img.shields.io/badge/Live%20Demo-WonderStory%20App-orange?style=for-the-badge&logo=google-cloud)](https://ais-pre-hshgjys65u55vk6g77eapm-187570358840.asia-east1.run.app)

**Live Demo URL:** [https://ais-pre-hshgjys65u55vk6g77eapm-187570358840.asia-east1.run.app](https://ais-pre-hshgjys65u55vk6g77eapm-187570358840.asia-east1.run.app)

---

## 🌟 Overview

**WonderStory** is an interactive, magical storybook web application designed for young readers, parents, and educators. Powered by **Google Gemini AI**, WonderStory brings children's literature to life through real-time voice narration with karaoke-style highlighting, multi-style scene illustrations, interactive character conversations, and co-creative story expansion.

Built using modern **React 19**, **TypeScript**, **Tailwind CSS**, and a **Bento Grid** neo-brutalist visual design with vibrant colors, tactile shadows, and smooth animations.

---

## ✨ Features

- **🎙️ Expressive Audio Narration**:
  - Word-by-word and sentence-by-sentence karaoke highlighting.
  - Multi-voice selection (Warm Storyteller, Playful Spark, Friendly Guide) with variable playback speeds (0.75x, 1x, 1.25x).
  - Built-in speech synthesis and web audio fallback for seamless offline reading.

- **🎨 Multi-Style AI Illustrations**:
  - High-resolution scene generation powered by Google Gemini Image models (`gemini-3.1-flash-image` and `gemini-3-pro-image`).
  - 8 kid-friendly art styles: *Whimsical Watercolor, 3D Animation, Classic Storybook, Cute Claymation, Vibrant Comic, Soft Pastel, Paper Cutout, Cosmic Glow*.
  - Automatic fallback to themed vector storybook artwork during free-tier quota limits.

- **💬 Interactive Companion Chat**:
  - Talk directly with story characters (e.g., Sparky the Little Dragon, Luna the Space Bunny, Maya).
  - Role modes: Story Character, Friendly Reading Companion, or Co-Author.
  - Generates age-appropriate ideas, questions, and comprehension quizzes.

- **🪄 "What Happens Next?" Co-Writing**:
  - Children and parents can propose ideas to branch the story.
  - Gemini dynamically writes the next page and prepares illustration prompts on the fly.

- **📚 Storybook Library & Custom Creator**:
  - Preloaded starter stories covering diverse themes (bravery, space exploration, friendship, nature).
  - Custom story generator: Enter an idea, theme, and age group to generate a multi-page story in seconds.
  - Local persistence via browser storage.

- **🍱 Tactile Bento Grid UI**:
  - High-contrast, friendly layout with hard offset shadows (`border-3`, `shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]`).
  - Celebration confetti triggers upon completing stories.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Motion
- **Backend**: Node.js, Express, ESBuild
- **AI SDK**: `@google/genai` (Google Gen AI TypeScript SDK)
- **AI Models**:
  - Text & Chat: `gemini-3.7-flash`
  - Scene Illustrations: `gemini-3.1-flash-image` & `gemini-3-pro-image`

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+ or 20+
- A Google Gemini API Key ([Get one at Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd wonderstory
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

---

## 📦 Publishing & Deployment

### 1. Exporting from Google AI Studio to GitHub
You can export this codebase directly to a GitHub repository:
1. Open the project in **Google AI Studio Build**.
2. Open the top right **Settings / Export** menu.
3. Choose **Export to GitHub** or **Download ZIP**.
4. Authenticate your GitHub account and select or create a new repository.

### 2. GitHub Pages vs. Full-Stack Hosting Note
> **Important**: WonderStory uses a secure backend proxy (`server.ts` with Express) to protect your Gemini API key from exposure in browser client bundles.
> - **GitHub Pages** is a static-only web host and does not execute Node.js/Express server-side code.
> - For full AI features (live Gemini text & image generation), deploy the application to a Node.js container platform such as **Google Cloud Run**, **Render**, **Railway**, or **Fly.io**.
> - In Google AI Studio, the app is already deployed and accessible via the [Live App Link](https://ais-pre-hshgjys65u55vk6g77eapm-187570358840.asia-east1.run.app).

---

## 📄 License
MIT License. Created with Google AI Studio.
