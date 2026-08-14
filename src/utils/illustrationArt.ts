// Dynamic Rich SVG Children's Storybook Artwork Generator
// Generates vibrant, themed vector story illustrations when AI image generation
// is pending, in free tier mode, or as fallback.

export function generateStorySvgIllustration(
  prompt: string,
  artStyle = 'watercolor',
  title = '',
  pageNumber = 1
): string {
  const p = (prompt + ' ' + title).toLowerCase();

  // Determine theme & palette
  let bgGrad1 = '#FDF2F8';
  let bgGrad2 = '#E0E7FF';
  let accentColor = '#818CF8';
  let secondaryAccent = '#F472B6';
  let motifEmoji = '✨';

  if (p.includes('dragon') || p.includes('sparky') || p.includes('fire')) {
    bgGrad1 = '#FEF3C7';
    bgGrad2 = '#FDE68A';
    accentColor = '#10B981';
    secondaryAccent = '#A855F7';
    motifEmoji = '🐲';
  } else if (p.includes('space') || p.includes('bunny') || p.includes('moon') || p.includes('rocket') || p.includes('star')) {
    bgGrad1 = '#1E1B4B';
    bgGrad2 = '#312E81';
    accentColor = '#F59E0B';
    secondaryAccent = '#EC4899';
    motifEmoji = '🚀';
  } else if (p.includes('forest') || p.includes('clockwork') || p.includes('gear') || p.includes('tree') || p.includes('river')) {
    bgGrad1 = '#ECFDF5';
    bgGrad2 = '#D1FAE5';
    accentColor = '#059669';
    secondaryAccent = '#D97706';
    motifEmoji = '🌳';
  } else if (p.includes('snow') || p.includes('winter') || p.includes('ice')) {
    bgGrad1 = '#E0F2FE';
    bgGrad2 = '#BAE6FD';
    accentColor = '#0284C7';
    secondaryAccent = '#38BDF8';
    motifEmoji = '❄️';
  } else if (p.includes('rainbow') || p.includes('magic')) {
    bgGrad1 = '#FCE7F3';
    bgGrad2 = '#DDD6FE';
    accentColor = '#EC4899';
    secondaryAccent = '#8B5CF6';
    motifEmoji = '🌈';
  }

  // Art style adjustments
  let styleFilter = '';
  if (artStyle === 'claymation') {
    bgGrad1 = '#FEF08A';
    bgGrad2 = '#FED7AA';
  } else if (artStyle === 'cosmic') {
    bgGrad1 = '#0F172A';
    bgGrad2 = '#3B0764';
    accentColor = '#38BDF8';
    secondaryAccent = '#F43F5E';
  } else if (artStyle === 'storybook') {
    bgGrad1 = '#FFFBEB';
    bgGrad2 = '#FEF3C7';
  }

  const cleanPrompt = prompt.slice(0, 120).replace(/["<>]/g, '');

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

    <!-- Distant Celestial / Magic Clouds -->
    <circle cx="680" cy="120" r="70" fill="#FEF08A" opacity="0.8" filter="url(#shadow)" stroke="#0F172A" stroke-width="3" />
    <circle cx="140" cy="110" r="45" fill="#FFFFFF" opacity="0.9" stroke="#0F172A" stroke-width="3" />
    <circle cx="180" cy="100" r="55" fill="#FFFFFF" opacity="0.9" stroke="#0F172A" stroke-width="3" />
    <circle cx="225" cy="110" r="40" fill="#FFFFFF" opacity="0.9" stroke="#0F172A" stroke-width="3" />

    <!-- Playful Floating Stardust / Sparkles -->
    <circle cx="360" cy="80" r="6" fill="#FBBF24" />
    <circle cx="480" cy="140" r="8" fill="#F472B6" />
    <circle cx="580" cy="90" r="5" fill="#38BDF8" />
    <circle cx="290" cy="180" r="7" fill="#A7F3D0" />
    <circle cx="670" cy="220" r="6" fill="#FDE047" />

    <!-- Decorative Rolling Story Hills -->
    <path d="M-50,450 Q200,320 450,420 T900,380 L900,650 L-50,650 Z" fill="url(#hillGrad1)" stroke="#0F172A" stroke-width="4" />
    <path d="M-50,500 Q300,430 550,490 T900,470 L900,650 L-50,650 Z" fill="#F8FAFC" opacity="0.15" />

    <!-- Foreground Story Element / Pedestal -->
    <g transform="translate(400, 370)">
      <!-- Main Scene Emblem / Character Frame -->
      <circle cx="0" cy="0" r="95" fill="#FFFFFF" stroke="#0F172A" stroke-width="5" filter="url(#shadow)" />
      <circle cx="0" cy="0" r="82" fill="url(#glowGrad)" />
      <text x="0" y="24" font-size="76" text-anchor="middle" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif">${motifEmoji}</text>
    </g>

    <!-- Page Watermark Badge -->
    <g transform="translate(40, 520)">
      <rect width="720" height="50" rx="16" fill="#FFFFFF" stroke="#0F172A" stroke-width="3" filter="url(#shadow)" />
      <text x="24" y="32" font-size="16" font-weight="900" fill="#0F172A" font-family="system-ui, -apple-system, sans-serif">
        📖 PAGE ${pageNumber} ARTWORK · ${artStyle.toUpperCase()}
      </text>
      <text x="700" y="32" font-size="14" font-weight="700" fill="#64748B" text-anchor="end" font-family="system-ui, -apple-system, sans-serif">
        ✨ WonderStory Illustrated Scene
      </text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
