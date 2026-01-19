export type Template = {
  id: string;
  name: string;
  vibeTagline: string;
  description: string;
  demo: {
    caption: string;
    images: string[];
    music?: {
      title: string;
      src: string;
    };
  };
  theme: {
    gradient: string;
  };
};

const templates: Template[] = [
  {
    id: "cute-classic",
    name: "Cute Classic",
    vibeTagline: "Warm, playful, timeless.",
    description: "Soft gradients, sweet captions, and a gentle story flow.",
    demo: {
      caption: "Soft light, sweet notes, and a story that blooms.",
      images: [
        "/demos/cute-classic/1.jpg",
        "/demos/cute-classic/2.jpg",
        "/demos/cute-classic/3.jpg",
      ],
      music: {
        title: "Soft Piano",
        src: "/demos/audio/soft-piano.mp3",
      },
    },
    theme: {
      gradient: "from-rose-300 via-pink-200 to-amber-100",
    },
  },
  {
    id: "midnight-muse",
    name: "Midnight Muse",
    vibeTagline: "Moody, cinematic, modern.",
    description: "Deep tones with glowing highlights for a dramatic reveal.",
    demo: {
      caption: "Midnight tones with a glowing love note.",
      images: [
        "/demos/midnight-muse/1.jpg",
        "/demos/midnight-muse/2.jpg",
        "/demos/midnight-muse/3.jpg",
      ],
    },
    theme: {
      gradient: "from-slate-900 via-slate-700 to-rose-500",
    },
  },
  {
    id: "sunlit-picnic",
    name: "Sunlit Picnic",
    vibeTagline: "Bright, breezy, joyful.",
    description: "Daylight vibes with airy spacing and crisp accents.",
    demo: {
      caption: "Golden hour smiles with easy, open air.",
      images: [
        "/demos/sunlit-picnic/1.jpg",
        "/demos/sunlit-picnic/2.jpg",
        "/demos/sunlit-picnic/3.jpg",
      ],
    },
    theme: {
      gradient: "from-amber-200 via-orange-200 to-rose-200",
    },
  },
  {
    id: "garden-party",
    name: "Garden Party",
    vibeTagline: "Fresh, floral, romantic.",
    description: "Petal-inspired hues with a soft, luxe finish.",
    demo: {
      caption: "Petal hues and a soft romantic glow.",
      images: [
        "/demos/garden-party/1.jpg",
        "/demos/garden-party/2.jpg",
        "/demos/garden-party/3.jpg",
      ],
    },
    theme: {
      gradient: "from-emerald-200 via-rose-200 to-amber-100",
    },
  },
  {
    id: "retro-love",
    name: "Retro Love",
    vibeTagline: "Bold, nostalgic, fun.",
    description: "Vintage poster energy with rich contrast and pop.",
    demo: {
      caption: "Bold pops with a vintage poster beat.",
      images: [
        "/demos/retro-love/1.jpg",
        "/demos/retro-love/2.jpg",
        "/demos/retro-love/3.jpg",
      ],
    },
    theme: {
      gradient: "from-amber-300 via-rose-300 to-fuchsia-300",
    },
  },
];

export const getTemplates = () => templates;

export const getTemplateById = (id?: string | null) =>
  templates.find((template) => template.id === id);
