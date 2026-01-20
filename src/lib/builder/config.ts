import { getDemoCopyByTemplateId } from "@/data/demoCopy";
import { getTemplateById, type TemplateId } from "@/data/templates";
import type {
  BuilderDoc,
  BuilderPhoto,
  BuilderTheme,
  BuilderSettings,
} from "@/lib/builder/types";

const DEFAULT_MAX_PHOTOS = 15;
const DEFAULT_UPSELL_PRICE = 2;
const DEFAULT_MOMENTS_TITLE = "Reasons I am obsessed with you";
const DEFAULT_LOVE_NOTE_TITLE = "Love note";
const DEFAULT_EXTRA_LOVE_TITLE = "Extra love";

const themePresets: Record<TemplateId, Omit<BuilderTheme, "gradient" | "tagline">> = {
  "cute-classic": {
    card: "bg-white/85",
    text: "text-slate-900",
    mutedText: "text-slate-600",
    accent: "text-rose-500",
    maxPhotos: DEFAULT_MAX_PHOTOS,
    photoUpsellPrice: DEFAULT_UPSELL_PRICE,
    defaultFont: "playful",
  },
  "midnight-muse": {
    card: "bg-slate-900/70",
    text: "text-slate-50",
    mutedText: "text-slate-300",
    accent: "text-rose-300",
    maxPhotos: DEFAULT_MAX_PHOTOS,
    photoUpsellPrice: DEFAULT_UPSELL_PRICE,
    defaultFont: "romantic",
  },
  "sunlit-picnic": {
    card: "bg-white/85",
    text: "text-slate-900",
    mutedText: "text-slate-600",
    accent: "text-amber-500",
    maxPhotos: DEFAULT_MAX_PHOTOS,
    photoUpsellPrice: DEFAULT_UPSELL_PRICE,
    defaultFont: "soft",
  },
  "garden-party": {
    card: "bg-white/85",
    text: "text-slate-900",
    mutedText: "text-slate-600",
    accent: "text-emerald-500",
    maxPhotos: DEFAULT_MAX_PHOTOS,
    photoUpsellPrice: DEFAULT_UPSELL_PRICE,
    defaultFont: "classic",
  },
  "retro-love": {
    card: "bg-white/85",
    text: "text-slate-900",
    mutedText: "text-slate-600",
    accent: "text-rose-500",
    maxPhotos: DEFAULT_MAX_PHOTOS,
    photoUpsellPrice: DEFAULT_UPSELL_PRICE,
    defaultFont: "playful",
  },
};

const momentsTitlePresets: Partial<Record<TemplateId, string>> = {
  "midnight-muse": "Cute moments",
};

const extraLoveTitlePresets: Partial<Record<TemplateId, string>> = {
  "midnight-muse": "Midnight echoes",
};

export const getDefaultMomentsTitle = (templateId: TemplateId) =>
  momentsTitlePresets[templateId] ?? DEFAULT_MOMENTS_TITLE;

export const getDefaultLoveNoteTitle = (
  templateId: TemplateId,
  index: number
) => {
  if (index === 0) {
    return DEFAULT_LOVE_NOTE_TITLE;
  }
  return extraLoveTitlePresets[templateId] ?? DEFAULT_EXTRA_LOVE_TITLE;
};

const createPhoto = (src: string, order: number): BuilderPhoto => ({
  id: `photo-${order}-${Math.random().toString(36).slice(2, 8)}`,
  src,
  order,
});

export const getBuilderTheme = (templateId: TemplateId): BuilderTheme => {
  const template = getTemplateById(templateId);
  const preset = themePresets[templateId];
  return {
    gradient: template?.theme.gradient ?? "from-rose-300 via-pink-200 to-amber-100",
    tagline: template?.vibeTagline ?? "Made with love.",
    ...preset,
  };
};

export const getBuilderSettings = (templateId: TemplateId): BuilderSettings => {
  const theme = getBuilderTheme(templateId);
  return {
    maxPhotos: theme.maxPhotos,
    photoUpsellPrice: theme.photoUpsellPrice,
  };
};

export const getDefaultBuilderDoc = (templateId: TemplateId): BuilderDoc => {
  const template = getTemplateById(templateId);
  const copy = getDemoCopyByTemplateId(templateId);
  const theme = getBuilderTheme(templateId);
  const demoImages = template?.demo.images ?? [];

  const photos = demoImages.slice(0, 3).map((src, index) =>
    createPhoto(src, index)
  );

  return {
    templateId,
    tagline: theme.tagline,
    title: copy.title,
    subtitle: copy.intro,
    loveNote: copy.loveNote,
    loveNotes: [copy.loveNote],
    loveNoteTitles: [getDefaultLoveNoteTitle(templateId, 0)],
    momentsTitle: getDefaultMomentsTitle(templateId),
    moments: copy.cuteMoments,
    photos,
    music: template?.demo.music
      ? {
          url: template.demo.music.src,
          name: template.demo.music.title,
        }
      : null,
    selectedFont: theme.defaultFont,
    titleSize: "normal",
    showSubtitle: true,
    sectionOrder: ["gallery", "love-note", "moments"],
    photoMood: "natural",
    backgroundIntensity: "medium",
  };
};

export const createUploadedPhoto = (src: string, order: number): BuilderPhoto =>
  createPhoto(src, order);
