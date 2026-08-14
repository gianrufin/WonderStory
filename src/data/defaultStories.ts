import { Story } from '../types';
import { generateStorySvgIllustration } from '../utils/illustrationArt';

export const ART_STYLES: { id: string; name: string; description: string; promptSuffix: string; icon: string }[] = [
  {
    id: 'watercolor',
    name: 'Dreamy Watercolor',
    description: 'Soft pastel washes, gentle brush textures & glowing lighting',
    promptSuffix: 'whimsical children\'s book watercolor illustration, soft glowing colors, storybook aesthetic, gentle textures, warm ambient lighting, charming, highly detailed, masterwork art',
    icon: '🎨',
  },
  {
    id: 'pixar3d',
    name: '3D Pixar Magic',
    description: 'Lush 3D animated character style with vibrant volumetric lighting',
    promptSuffix: 'modern 3D animated film still, Disney Pixar style, adorable expressive character design, ray-traced warm soft lighting, cinematic depth of field, vibrant colors, clean render',
    icon: '✨',
  },
  {
    id: 'claymation',
    name: 'Cozy Claymation',
    description: 'Stop-motion clay sculpture look with tactile fingerprint textures',
    promptSuffix: 'charming stop-motion claymation style, handcrafted plasticine figures, miniature diorama scenery, cozy warm studio lighting, textured tactile feel, Aardman inspired',
    icon: '🧸',
  },
  {
    id: 'storybook',
    name: 'Classic Golden Age',
    description: 'Vintage fairytale book with delicate line work and ink wash',
    promptSuffix: 'classic vintage children\'s book illustration, Beatrix Potter and Maurice Sendak inspired, fine delicate ink outlines, rich warm colors, timeless fairytale wonder',
    icon: '📖',
  },
  {
    id: 'papercraft',
    name: 'Pop-Up Papercraft',
    description: 'Layered dimensional cut paper with soft realistic shadows',
    promptSuffix: 'layered paper craft cut-out illustration, 3D pop-up book depth, textured cardstock, soft cast shadows, whimsical multi-plane diorama, crisp and colorful',
    icon: '✂️',
  },
  {
    id: 'cosmic',
    name: 'Cosmic Starlight',
    description: 'Sparkling celestial nebulae, glowing crystals & starry glow',
    promptSuffix: 'magical glowing starlight fantasy illustration, bioluminescent flora, shimmering nebula skies, sparkling glitter particles, magical wonder, rich vibrant purples, teals and golds',
    icon: '🌌',
  }
];

export const VOICE_OPTIONS: { id: string; name: string; description: string; gender: string; personality: string }[] = [
  { id: 'Kore', name: 'Kore', description: 'Warm, soothing & nurturing story voice', gender: 'Female', personality: 'Motherly & Gentle' },
  { id: 'Puck', name: 'Puck', description: 'Playful, enthusiastic & cheerful friend', gender: 'Male', personality: 'Excited & Adventurous' },
  { id: 'Zephyr', name: 'Zephyr', description: 'Calm, melodic & dreamy bedtime tone', gender: 'Female', personality: 'Peaceful & Soft' },
  { id: 'Fenrir', name: 'Fenrir', description: 'Deep, bold & heroic explorer voice', gender: 'Male', personality: 'Brave & Majestic' },
  { id: 'Charon', name: 'Charon', description: 'Wise, thoughtful & magical elder storyteller', gender: 'Neutral', personality: 'Mystical & Wise' },
];

export const DEFAULT_STORIES: Story[] = [
  {
    id: 'sparky-dragon',
    title: 'Sparky the Little Dragon Who Found His Glow',
    tagline: 'A heartwarming tale about courage, kindness, and shining in your own special way.',
    theme: 'Friendship & Self-Confidence',
    targetAge: '3-5',
    artStyle: 'watercolor',
    createdAt: 1718000000000,
    characters: [
      {
        name: 'Sparky',
        role: 'Protagonist',
        description: 'A friendly emerald-green baby dragon with tiny golden wings who loves roasted marshmallows.',
        avatarIcon: '🐲'
      },
      {
        name: 'Pip the Firefly',
        role: 'Best Friend',
        description: 'A tiny, energetic firefly with a bright turquoise beacon and big sparkly eyes.',
        avatarIcon: '💡'
      },
      {
        name: 'Elder Willow',
        role: 'Wise Mentor',
        description: 'An ancient enchanted oak tree covered in moss and glowing blue mushrooms.',
        avatarIcon: '🌳'
      }
    ],
    pages: [
      {
        pageNumber: 1,
        text: 'High atop the Emerald Mountains lived Sparky, the tiniest dragon in the Whispering Valley. While big dragons breathed roaring orange fires, Sparky could only blow tiny, dancing bubbles of warm purple glitter.',
        illustrationPrompt: 'A tiny adorable baby green dragon named Sparky with golden wings sitting on a sunlit mossy mountain cliff, blowing gentle floating purple glitter bubbles, soft fluffy clouds in the sky',
        sceneDescription: 'Sparky tries blowing fire on a mountain ledge but creates magical glowing bubbles instead.',
        imageUrl: generateStorySvgIllustration('A tiny adorable baby green dragon named Sparky with golden wings sitting on a sunlit mossy mountain cliff', 'watercolor', 'Sparky the Little Dragon', 1),
        imageResolution: '1K',
        artStyle: 'watercolor',
      },
      {
        pageNumber: 2,
        text: '"Do not worry, little dragon!" buzzed Pip the firefly, zipping in joyful loops around Sparky’s nose. "Fire can be hot and scary, but your purple bubbles make the whole forest smile!"',
        illustrationPrompt: 'Close-up of cute baby dragon Sparky looking with wide curious eyes at a tiny glowing turquoise firefly buzzing near his snout, friendly woodland flowers in foreground',
        sceneDescription: 'Pip cheers up Sparky amidst colorful wildflowers.',
        imageUrl: generateStorySvgIllustration('Close-up of cute baby dragon Sparky with tiny glowing turquoise firefly', 'watercolor', 'Sparky the Little Dragon', 2),
        imageResolution: '1K',
        artStyle: 'watercolor',
      },
      {
        pageNumber: 3,
        text: 'That evening, a thick silver fog rolled through Whispering Valley. The baby hedgehogs and bunny kits could not find their burrows in the dim shadows. The forest fell silent with worry.',
        illustrationPrompt: 'Enchanted woodland twilight with mystical silver mist drifting between giant ancient trees, tiny worried woodland baby animals looking for their cozy homes',
        sceneDescription: 'The forest is covered in thick fog at twilight.',
        imageUrl: generateStorySvgIllustration('Enchanted woodland twilight with mystical silver mist drifting between giant ancient trees', 'watercolor', 'Sparky the Little Dragon', 3),
        imageResolution: '1K',
        artStyle: 'watercolor',
      },
      {
        pageNumber: 4,
        text: 'Sparky took a deep, brave breath. He blew a shower of shimmering purple bubbles into the sky! As they floated upward, each bubble illuminated like a gentle floating lantern, lighting up every path with soft lilac warmth.',
        illustrationPrompt: 'Baby dragon Sparky standing proudly on a rock, breathing a magical cascade of glowing purple lanterns into the night sky, lighting up pathways for grateful smiling woodland creatures',
        sceneDescription: 'Sparky lights up the forest with his warm glowing bubbles.',
        imageUrl: generateStorySvgIllustration('Baby dragon Sparky breathing a magical cascade of glowing purple lanterns into the night sky', 'watercolor', 'Sparky the Little Dragon', 4),
        imageResolution: '1K',
        artStyle: 'watercolor',
      },
      {
        pageNumber: 5,
        text: 'All the woodland families cheered with delight. Sparky realized that being different was his greatest magic of all. With a cozy yawn, he curled up under the stars, knowing he was truly a star of the forest.',
        illustrationPrompt: 'Baby dragon Sparky sleeping peacefully curled up in a nest of soft autumn leaves under a star-filled celestial sky, all forest animals smiling and waving goodnight',
        sceneDescription: 'Sparky rests happily after helping the whole forest.',
        imageUrl: generateStorySvgIllustration('Baby dragon Sparky sleeping peacefully curled up in a nest of soft autumn leaves under a star-filled sky', 'watercolor', 'Sparky the Little Dragon', 5),
        imageResolution: '1K',
        artStyle: 'watercolor',
      }
    ]
  },
  {
    id: 'luna-space-bunny',
    title: 'Luna the Space Bunny’s Moon Picnic',
    tagline: 'Join Captain Luna on a cosmic hop to find the secret Starberry Orchard!',
    theme: 'Exploration & Curiosity',
    targetAge: '6-8',
    artStyle: 'pixar3d',
    createdAt: 1718000010000,
    characters: [
      {
        name: 'Captain Luna',
        role: 'Space Adventurer',
        description: 'A spunky white rabbit in a custom orange spacesuit with helmet ear-covers.',
        avatarIcon: '🐰'
      },
      {
        name: 'Beep-4',
        role: 'Robot Copilot',
        description: 'A floating spherical robot who beeps cheerfully and projects star maps.',
        avatarIcon: '🤖'
      }
    ],
    pages: [
      {
        pageNumber: 1,
        text: 'Captain Luna strapped into the cockpit of the Carrot-1 Rocket. "All systems nominal!" chirped Beep-4. With a count of three... two... one... WOOSH! They shot into the velvety indigo galaxy.',
        illustrationPrompt: 'Adorable white bunny in a futuristic retro spacesuit inside a glowing rocket cockpit looking out the round window at sparkling colorful galaxies and nebulae, 3D Pixar animated style',
        sceneDescription: 'Luna launches into outer space with rocket engines glowing.',
        imageUrl: generateStorySvgIllustration('Adorable white bunny in a futuristic rocket looking at colorful galaxies', 'pixar3d', 'Luna Space Bunny', 1),
        imageResolution: '1K',
        artStyle: 'pixar3d',
      },
      {
        pageNumber: 2,
        text: 'Floating past Saturn’s rings, Luna did three zero-gravity somersaults. Cosmic pop-rocks floated in bubbles alongside sweet glowing star-juice pouches.',
        illustrationPrompt: 'Space bunny Luna floating in zero gravity playfully near cosmic crystal asteroid rings, holding a floating glowing thermos, cute robot friend floating nearby',
        sceneDescription: 'Luna floating joyfully in zero gravity.',
        imageUrl: generateStorySvgIllustration('Space bunny Luna floating in zero gravity near cosmic asteroid rings', 'pixar3d', 'Luna Space Bunny', 2),
        imageResolution: '1K',
        artStyle: 'pixar3d',
      },
      {
        pageNumber: 3,
        text: 'They touched down softly on the Moon of Stardust. Right before their eyes stood the legendary Starberry Orchard—trees made of spun sugar bearing glowing celestial berries!',
        illustrationPrompt: 'Lunar landscape with glowing crystal trees bearing sparkling luminous star-shaped fruit, shiny rover vehicle parked on pearlescent lunar sand, Earth visible in sky',
        sceneDescription: 'Discovery of the magical Starberry Orchard on the moon.',
        imageUrl: generateStorySvgIllustration('Lunar landscape with glowing crystal trees bearing sparkling star fruit', 'pixar3d', 'Luna Space Bunny', 3),
        imageResolution: '1K',
        artStyle: 'pixar3d',
      },
      {
        pageNumber: 4,
        text: 'Luna and Beep-4 spread out a checkered space-blanket. They shared starberry tarts with a friendly friendly lunar fox who lived among the crater springs.',
        illustrationPrompt: 'Cute space bunny, spherical robot, and a friendly glowing alien moon-fox having a cozy picnic on the moon with glowing pastries on a checkered blanket, Earth in background',
        sceneDescription: 'A friendly cosmic picnic on the moon.',
        imageUrl: generateStorySvgIllustration('Cute space bunny and robot friend having a cozy moon picnic', 'pixar3d', 'Luna Space Bunny', 4),
        imageResolution: '1K',
        artStyle: 'pixar3d',
      }
    ]
  },
  {
    id: 'clockwork-forest',
    title: 'The Mystery of the Clockwork Forest',
    tagline: 'When the golden gear stops ticking, Maya must solve the riddle of the singing stream.',
    theme: 'Problem Solving & Nature',
    targetAge: '9-12',
    artStyle: 'storybook',
    createdAt: 1718000020000,
    characters: [
      {
        name: 'Maya',
        role: 'Curious Tinkerer',
        description: 'A 10-year-old girl with brass goggles on her forehead and a satchel of tools.',
        avatarIcon: '🔍'
      },
      {
        name: 'Barnaby the Brass Owl',
        role: 'Forest Guardian',
        description: 'A wind-up clockwork owl with sapphire lenses and golden feather gears.',
        avatarIcon: '🦉'
      }
    ],
    pages: [
      {
        pageNumber: 1,
        text: 'In the heart of Arboria, the trees had roots of polished brass and leaves that hummed in perfect harmonic chime. But today, the grand waterwheel in the center of the woods had come to a mysterious standstill.',
        illustrationPrompt: 'A magical steampunk enchanted forest with brass tree trunks, golden gear leaves, and a grand intricate wooden waterwheel on a crystal blue river, vintage storybook style',
        sceneDescription: 'The clockwork forest where the gears have stopped.',
        imageUrl: generateStorySvgIllustration('A magical steampunk forest with brass tree trunks and clockwork gears', 'storybook', 'The Clockwork Forest', 1),
        imageResolution: '1K',
        artStyle: 'storybook',
      },
      {
        pageNumber: 2,
        text: 'Maya adjusted her brass goggles. Down in the crystal stream, a family of river otters was trying to free a trapped silver gemstone that had wedged into the primary escapement wheel.',
        illustrationPrompt: 'Young girl adventurer with goggles kneeling by a crystal clear riverbank with playful otters, inspecting intricate brass clockwork mechanisms intertwined with willow roots',
        sceneDescription: 'Maya discovers the cause of the jam with the river otters.',
        imageUrl: generateStorySvgIllustration('Young girl adventurer with brass goggles kneeling by riverbank with playful otters', 'storybook', 'The Clockwork Forest', 2),
        imageResolution: '1K',
        artStyle: 'storybook',
      },
      {
        pageNumber: 3,
        text: 'With a gentle turn of her brass wrench and a sprinkle of sunflower oil, Maya eased the gemstone loose. Instantly, the gears clicked: TICK... TOK... WHIRRR! The whole forest burst into a glorious melody of music box bells.',
        illustrationPrompt: 'The clockwork forest coming alive with golden light rays, gears spinning gracefully, water rushing over waterwheel, otters splashing joyfully and girl smiling with triumph',
        sceneDescription: 'The forest springs back to harmonic life.',
        imageUrl: generateStorySvgIllustration('The clockwork forest coming alive with golden light rays and spinning gears', 'storybook', 'The Clockwork Forest', 3),
        imageResolution: '1K',
        artStyle: 'storybook',
      }
    ]
  }
];
