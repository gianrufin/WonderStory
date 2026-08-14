import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Server-side Gemini Client utility
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  return new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Convert raw 16-bit PCM buffer to standard RIFF WAV base64
function pcmToWavBase64(pcmBase64: string, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): string {
  try {
    const pcmBuffer = Buffer.from(pcmBase64, "base64");
    // If it already has a RIFF header, return as is
    if (pcmBuffer.length > 4 && pcmBuffer.toString("utf8", 0, 4) === "RIFF") {
      return pcmBase64;
    }
    const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
    const blockAlign = numChannels * (bitsPerSample / 8);
    const dataSize = pcmBuffer.length;
    const header = Buffer.alloc(44);

    header.write("RIFF", 0);
    header.writeUInt32LE(36 + dataSize, 4);
    header.write("WAVE", 8);

    header.write("fmt ", 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // PCM
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(byteRate, 28);
    header.writeUInt16LE(blockAlign, 32);
    header.writeUInt16LE(bitsPerSample, 34);

    header.write("data", 36);
    header.writeUInt32LE(dataSize, 40);

    const wavBuffer = Buffer.concat([header, pcmBuffer]);
    return wavBuffer.toString("base64");
  } catch (err) {
    console.error("PCM to WAV conversion error:", err);
    return pcmBase64;
  }
}

// ==========================================
// 1. Text-To-Speech (TTS) Endpoint
// Model: gemini-3.1-flash-tts-preview
// ==========================================
app.post("/api/story/tts", async (req, res) => {
  try {
    const { text, voice = "Kore", emotion = "cheerful" } = req.body;
    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "Text is required for TTS" });
    }

    const ai = getGeminiClient();
    const prompt = `Read this children's story page with warm, ${emotion}, expressive, and engaging narration suitable for kids: "${text}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const audioCandidate = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioCandidate) {
      return res.status(500).json({ error: "No audio stream returned from TTS model" });
    }

    const wavBase64 = pcmToWavBase64(audioCandidate, 24000);
    res.json({
      audioBase64: wavBase64,
      mimeType: "audio/wav",
      voiceUsed: voice,
    });
  } catch (error: any) {
    console.error("TTS generation error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate speech audio",
    });
  }
});

// ==========================================
// Helper: Rich SVG Storybook Illustration Fallback
// Used when image quota is exceeded or in free tier
// ==========================================
function generateStorySvgIllustration(
  prompt: string,
  artStyle = "watercolor",
  pageNumber = 1
): string {
  const p = (prompt || "").toLowerCase();

  let bgGrad1 = "#FEF3C7";
  let bgGrad2 = "#FDE68A";
  let accentColor = "#10B981";
  let secondaryAccent = "#A855F7";
  let motifEmoji = "✨";

  if (p.includes("dragon") || p.includes("sparky") || p.includes("fire")) {
    bgGrad1 = "#FEF3C7";
    bgGrad2 = "#FDE68A";
    accentColor = "#10B981";
    secondaryAccent = "#A855F7";
    motifEmoji = "🐲";
  } else if (p.includes("space") || p.includes("bunny") || p.includes("moon") || p.includes("rocket") || p.includes("star")) {
    bgGrad1 = "#1E1B4B";
    bgGrad2 = "#312E81";
    accentColor = "#F59E0B";
    secondaryAccent = "#EC4899";
    motifEmoji = "🚀";
  } else if (p.includes("forest") || p.includes("clockwork") || p.includes("gear") || p.includes("tree") || p.includes("river")) {
    bgGrad1 = "#ECFDF5";
    bgGrad2 = "#D1FAE5";
    accentColor = "#059669";
    secondaryAccent = "#D97706";
    motifEmoji = "🌳";
  } else if (p.includes("snow") || p.includes("winter") || p.includes("ice")) {
    bgGrad1 = "#E0F2FE";
    bgGrad2 = "#BAE6FD";
    accentColor = "#0284C7";
    secondaryAccent = "#38BDF8";
    motifEmoji = "❄️";
  } else if (p.includes("rainbow") || p.includes("magic")) {
    bgGrad1 = "#FCE7F3";
    bgGrad2 = "#DDD6FE";
    accentColor = "#EC4899";
    secondaryAccent = "#8B5CF6";
    motifEmoji = "🌈";
  }

  if (artStyle === "cosmic") {
    bgGrad1 = "#0F172A";
    bgGrad2 = "#3B0764";
    accentColor = "#38BDF8";
    secondaryAccent = "#F43F5E";
  } else if (artStyle === "claymation") {
    bgGrad1 = "#FEF08A";
    bgGrad2 = "#FED7AA";
  } else if (artStyle === "storybook") {
    bgGrad1 = "#FFFBEB";
    bgGrad2 = "#FEF3C7";
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgGrad1}" />
        <stop offset="100%" stop-color="${bgGrad2}" />
      </linearGradient>
      <linearGradient id="hillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.85" />
        <stop offset="100%" stop-color="${secondaryAccent}" stop-opacity="0.95" />
      </linearGradient>
      <linearGradient id="glowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE047" stop-opacity="0.9" />
        <stop offset="100%" stop-color="#F97316" stop-opacity="0.3" />
      </linearGradient>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="4" dy="4" stdDeviation="0" flood-color="#0F172A" />
      </filter>
    </defs>

    <!-- Canvas Background -->
    <rect width="800" height="600" fill="url(#skyGrad)" />

    <!-- Distant Celestial / Magic Elements -->
    <circle cx="680" cy="120" r="70" fill="#FEF08A" opacity="0.8" filter="url(#shadow)" stroke="#0F172A" stroke-width="3" />
    <circle cx="140" cy="110" r="45" fill="#FFFFFF" opacity="0.9" stroke="#0F172A" stroke-width="3" />
    <circle cx="180" cy="100" r="55" fill="#FFFFFF" opacity="0.9" stroke="#0F172A" stroke-width="3" />
    <circle cx="225" cy="110" r="40" fill="#FFFFFF" opacity="0.9" stroke="#0F172A" stroke-width="3" />

    <!-- Floating Sparkles -->
    <circle cx="360" cy="80" r="6" fill="#FBBF24" />
    <circle cx="480" cy="140" r="8" fill="#F472B6" />
    <circle cx="580" cy="90" r="5" fill="#38BDF8" />
    <circle cx="290" cy="180" r="7" fill="#A7F3D0" />
    <circle cx="670" cy="220" r="6" fill="#FDE047" />

    <!-- Rolling Story Hills -->
    <path d="M-50,450 Q200,320 450,420 T900,380 L900,650 L-50,650 Z" fill="url(#hillGrad1)" stroke="#0F172A" stroke-width="4" />
    <path d="M-50,500 Q300,430 550,490 T900,470 L900,650 L-50,650 Z" fill="#F8FAFC" opacity="0.15" />

    <!-- Central Character Frame -->
    <g transform="translate(400, 360)">
      <circle cx="0" cy="0" r="95" fill="#FFFFFF" stroke="#0F172A" stroke-width="5" filter="url(#shadow)" />
      <circle cx="0" cy="0" r="82" fill="url(#glowGrad)" />
      <text x="0" y="24" font-size="76" text-anchor="middle" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif">${motifEmoji}</text>
    </g>

    <!-- Bottom Page Watermark Badge -->
    <g transform="translate(40, 520)">
      <rect width="720" height="50" rx="16" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" filter="url(#shadow)" />
      <text x="24" y="32" font-size="15" font-weight="900" fill="#0F172A" font-family="system-ui, -apple-system, sans-serif">
        ✨ STORYBOOK SCENE · ${artStyle.toUpperCase()}
      </text>
      <text x="700" y="32" font-size="13" font-weight="700" fill="#64748B" text-anchor="end" font-family="system-ui, -apple-system, sans-serif">
        WonderStory Illustration
      </text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ==========================================
// 2. High-Quality Image Illustration Endpoint
// Model: gemini-3.1-flash-image / gemini-3-pro-image
// Fallback: Themed Vector Storybook Artwork
// ==========================================
app.post("/api/story/illustrate", async (req, res) => {
  const {
    prompt,
    imageSize = "1K", // "1K" | "2K" | "4K"
    aspectRatio = "4:3", // "1:1" | "4:3" | "16:9"
    artStyle = "watercolor",
    styleDetails = "",
    pageNumber = 1,
  } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required for illustration" });
  }

  const validSize = ["1K", "2K", "4K"].includes(imageSize) ? imageSize : "1K";
  const validAspect = ["1:1", "4:3", "16:9", "3:4", "9:16"].includes(aspectRatio) ? aspectRatio : "4:3";

  // Construct high-detail kid-friendly visual prompt
  const enhancedPrompt = `High quality children's book illustration for a story page: ${prompt}. Art style: ${styleDetails || artStyle}. Safe for kids, bright, enchanting, whimsical, highly detailed masterpiece, expressive characters, vibrant storybook visual art, rich color palette.`;

  try {
    const ai = getGeminiClient();
    let response;

    // Try primary image model: gemini-3.1-flash-image
    try {
      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-image",
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: validAspect,
            imageSize: validSize,
          },
        },
      });
    } catch (primaryErr: any) {
      console.warn("Primary image model failed, trying secondary model gemini-3-pro-image...", primaryErr?.message);
      response = await ai.models.generateContent({
        model: "gemini-3-pro-image",
        contents: {
          parts: [{ text: enhancedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: validAspect,
            imageSize: validSize,
          },
        },
      });
    }

    let imageUrl = "";
    let mimeType = "image/png";

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        mimeType = part.inlineData.mimeType || "image/png";
        imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!imageUrl) {
      throw new Error("No image binary returned in AI response");
    }

    return res.json({
      imageUrl,
      imageSize: validSize,
      aspectRatio: validAspect,
      artStyle,
      isAiGenerated: true,
    });
  } catch (error: any) {
    console.warn("Gemini Image generation quota or rate limit reached. Serving themed storybook vector illustration fallback:", error?.message);

    // Provide seamless, beautiful story vector artwork fallback
    const fallbackSvg = generateStorySvgIllustration(prompt, artStyle, pageNumber);

    return res.json({
      imageUrl: fallbackSvg,
      imageSize: validSize,
      aspectRatio: validAspect,
      artStyle,
      isFallback: true,
      notice: "Rendered with WonderStory Art Canvas (Gemini Image Quota Limit Active)",
    });
  }
});

// ==========================================
// 3. Multi-Turn Chatbot Endpoint
// Model: gemini-3.7-flash
// System instruction for specific roles
// ==========================================
app.post("/api/story/chat", async (req, res) => {
  try {
    const {
      role = "storyteller", // 'storyteller' | 'character' | 'art_wizard' | 'co_author'
      characterName,
      storyTitle,
      currentPageText,
      conversationHistory = [], // array of { role: 'user' | 'model', content: string }
      message,
      taskComplexity = "general", // 'general' | 'complex' | 'fast'
    } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    // Model selection based on SKILL.md guidelines
    let modelName = "gemini-3.7-flash";
    if (taskComplexity === "complex" || role === "co_author") {
      modelName = "gemini-3.1-pro-preview";
    } else if (taskComplexity === "fast") {
      modelName = "gemini-3.1-flash-lite";
    }

    // Craft role-specific kid-safe system instructions
    let systemInstruction = "";
    if (role === "character") {
      systemInstruction = `You are ${characterName || "the friendly hero"} from the children's story "${storyTitle || "the story"}".
Current page context: "${currentPageText || "an ongoing adventure"}".
Respond directly in character! Speak warmly, enthusiastically, playfully, and gently to a young child.
Use child-friendly language, fun sound effects (like *whoosh*, *sparkle*, *giggle*), and keep answers concise (2-4 sentences max).
Ask a friendly question back to keep the child engaged. Always stay safe, positive, and encouraging.`;
    } else if (role === "art_wizard") {
      systemInstruction = `You are Sparky the Magical Art Wizard for children's books.
You help kids imagine what new drawings, colors, sparkles, cute creatures, and magical elements could be drawn on this page of the story "${storyTitle || ""}".
Current page scene: "${currentPageText || ""}".
Suggest 2-3 fun, vivid ideas for new illustrations they could generate! Keep your tone bubbly, creative, and inspiring.`;
    } else if (role === "co_author") {
      systemInstruction = `You are the Magical Story Co-Author Genie.
You collaborate with young kids to decide what happens next in "${storyTitle || "our tale"}".
Current page situation: "${currentPageText || ""}".
Give the child 2-3 exciting, funny, or brave choices for what could happen on the next page, or help them turn their own idea into a wonderful story sentence.
Keep responses playful, encouraging, and easy to read.`;
    } else {
      // Default: Barnaby the Story Owl
      systemInstruction = `You are Barnaby the Story Owl, a wise and kind companion who loves reading stories with children.
You are reading "${storyTitle || "a lovely book"}". Current page: "${currentPageText || ""}".
Help the child understand tricky words, answer any questions about the characters, and celebrate their curiosity.
Keep answers warm, clear, encouraging, and tailored to kids. Keep responses between 2-3 sentences.`;
    }

    const ai = getGeminiClient();

    // Map conversation history to Gemini contents format
    const contents: any[] = [];
    for (const entry of conversationHistory) {
      if (entry.content && (entry.role === "user" || entry.role === "model")) {
        contents.push({
          role: entry.role,
          parts: [{ text: entry.content }],
        });
      }
    }
    // Append current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    let replyText = "";
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });
      replyText = response.text || "That's a wonderful idea! Let's keep exploring the story together!";
    } catch (err: any) {
      console.warn("Primary chat model error, attempting fallback with gemini-3.7-flash:", err?.message);
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });
      replyText = fallbackResponse.text || "That's a wonderful idea! Let's keep exploring the story together!";
    }

    res.json({
      reply: replyText,
      modelUsed: modelName,
      role,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: error.message || "Failed to communicate with Story Companion",
    });
  }
});

// ==========================================
// 4. Create Full Custom Story Endpoint
// Model: gemini-3.7-flash with structured JSON schema
// ==========================================
app.post("/api/story/create", async (req, res) => {
  try {
    const {
      topic,
      characterIdea,
      targetAge = "6-8",
      pageCount = 4,
      moral = "kindness and teamwork",
      artStyle = "watercolor",
    } = req.body;

    const ai = getGeminiClient();
    const prompt = `Write a delightful, charming children's story for age group ${targetAge}.
Story Idea: ${topic || "A magical adventure with a friendly animal"}
Hero/Character: ${characterIdea || "A curious little friend"}
Moral/Theme: ${moral}
Total Pages: ${Math.min(Math.max(Number(pageCount) || 4, 3), 6)}

For each page, write 2-3 engaging, age-appropriate storybook sentences, and provide a clear, descriptive visual illustration prompt describing the characters, actions, environment, and mood.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Catchy, kid-friendly story title" },
            tagline: { type: Type.STRING, description: "One sentence summary" },
            theme: { type: Type.STRING, description: "Main theme or moral" },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  description: { type: Type.STRING },
                  avatarIcon: { type: Type.STRING, description: "A single emoji representing the character" },
                },
                required: ["name", "role", "description"],
              },
            },
            pages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  text: { type: Type.STRING, description: "The page text to be read aloud" },
                  illustrationPrompt: { type: Type.STRING, description: "Detailed visual prompt for generating the illustration" },
                  sceneDescription: { type: Type.STRING },
                },
                required: ["pageNumber", "text", "illustrationPrompt"],
              },
            },
          },
          required: ["title", "tagline", "theme", "characters", "pages"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    const newStory = {
      id: `story-${Date.now()}`,
      title: parsed.title || "The Magical Wonder Tale",
      tagline: parsed.tagline || "A wonderful journey into imagination.",
      theme: parsed.theme || moral,
      targetAge,
      artStyle,
      createdAt: Date.now(),
      isCustom: true,
      characters: parsed.characters || [
        { name: "Hero", role: "Main Character", description: "A brave and friendly explorer", avatarIcon: "⭐" },
      ],
      pages: (parsed.pages || []).map((p: any, idx: number) => ({
        pageNumber: idx + 1,
        text: p.text,
        illustrationPrompt: p.illustrationPrompt,
        sceneDescription: p.sceneDescription || `Scene ${idx + 1}`,
      })),
    };

    res.json(newStory);
  } catch (error: any) {
    console.error("Story creation error:", error);
    res.status(500).json({
      error: error.message || "Failed to create new custom story",
    });
  }
});

// ==========================================
// 5. Extend Story by One Page
// Model: gemini-3.7-flash
// ==========================================
app.post("/api/story/extend-page", async (req, res) => {
  try {
    const { storyTitle, previousPagesText, childChoice, pageNumber, targetAge } = req.body;
    const ai = getGeminiClient();

    const prompt = `We are writing the next page (Page ${pageNumber}) for the children's story "${storyTitle}".
Previous context: "${previousPagesText}"
The child decided this happens next: "${childChoice || "something exciting and friendly happens"}"
Age group: ${targetAge || "6-8"}.

Write:
1. The new page text (2-3 sentences, warm and exciting for kids)
2. A vivid illustration prompt describing the new scene
3. A short scene description`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            illustrationPrompt: { type: Type.STRING },
            sceneDescription: { type: Type.STRING },
          },
          required: ["text", "illustrationPrompt"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      pageNumber,
      text: parsed.text,
      illustrationPrompt: parsed.illustrationPrompt,
      sceneDescription: parsed.sceneDescription || `Page ${pageNumber} adventure`,
    });
  } catch (error: any) {
    console.error("Extend page error:", error);
    res.status(500).json({ error: error.message || "Failed to generate next page" });
  }
});

// ==========================================
// Vite Middleware & Static Server
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✨ WonderStory Server running on port ${PORT}`);
  });
}

startServer();
