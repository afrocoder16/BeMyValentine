import { getDemoCopyByTemplateId } from "@/data/demoCopy";
import { getTemplateById } from "@/data/templates";
import type { MusicTrack } from "@/lib/templates/music";
import { demoTracks } from "@/lib/templates/music";

export type DraftPhoto = {
  id: string;
  dataUrl: string;
};

export type TemplateDraft = {
  templateId: string;
  title: string;
  subtitle: string;
  loveNote: string;
  moments: string[];
  photos: DraftPhoto[];
  music: MusicTrack | null;
};

const createId = () => Math.random().toString(36).slice(2, 10);

const getDefaultMusic = (templateId: string) => {
  const template = getTemplateById(templateId);
  if (template?.demo.music?.title) {
    const match = demoTracks.find(
      (track) => track.label === template.demo.music?.title
    );
    if (match) {
      return match;
    }
  }

  return demoTracks[0] ?? null;
};

export const getDefaultDraft = (templateId: string): TemplateDraft => {
  const template = getTemplateById(templateId);
  const copy = getDemoCopyByTemplateId(templateId);
  const demoImages = template?.demo.images ?? [];

  return {
    templateId,
    title: copy.title,
    subtitle: copy.intro,
    loveNote: copy.loveNote,
    moments: copy.cuteMoments,
    photos: demoImages.slice(0, 3).map((src, index) => ({
      id: `demo-${index + 1}`,
      dataUrl: src,
    })),
    music: getDefaultMusic(templateId),
  };
};

const storageKey = (templateId: string) => `bmv:draft:${templateId}`;

const coerceDraft = (templateId: string, value: unknown): TemplateDraft => {
  const defaults = getDefaultDraft(templateId);
  if (!value || typeof value !== "object") {
    return defaults;
  }

  const draft = value as Partial<TemplateDraft>;
  return {
    templateId,
    title: typeof draft.title === "string" ? draft.title : defaults.title,
    subtitle:
      typeof draft.subtitle === "string" ? draft.subtitle : defaults.subtitle,
    loveNote:
      typeof draft.loveNote === "string" ? draft.loveNote : defaults.loveNote,
    moments: Array.isArray(draft.moments)
      ? draft.moments.filter((moment) => typeof moment === "string")
      : defaults.moments,
    photos: Array.isArray(draft.photos)
      ? draft.photos
          .filter(
            (photo): photo is DraftPhoto =>
              Boolean(photo) &&
              typeof photo.id === "string" &&
              typeof photo.dataUrl === "string"
          )
          .slice(0, 3)
      : defaults.photos,
    music:
      draft.music && typeof draft.music === "object" && "id" in draft.music
        ? (draft.music as MusicTrack)
        : defaults.music,
  };
};

export const loadDraft = (templateId: string): TemplateDraft => {
  if (typeof window === "undefined") {
    return getDefaultDraft(templateId);
  }

  const raw = window.localStorage.getItem(storageKey(templateId));
  if (!raw) {
    return getDefaultDraft(templateId);
  }

  try {
    const parsed = JSON.parse(raw);
    return coerceDraft(templateId, parsed);
  } catch {
    return getDefaultDraft(templateId);
  }
};

export const saveDraft = (templateId: string, draft: TemplateDraft) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(storageKey(templateId), JSON.stringify(draft));
  } catch {
    // Ignore storage failures (quota, disabled storage, etc.)
  }
};

export const resetDraft = (templateId: string) => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(storageKey(templateId));
  }

  return getDefaultDraft(templateId);
};

export const createPhoto = (dataUrl: string): DraftPhoto => ({
  id: createId(),
  dataUrl,
});
