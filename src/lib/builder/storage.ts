import type { TemplateId } from "@/data/templates";
import { getBuilderSettings, getDefaultBuilderDoc } from "@/lib/builder/config";
import type { BuilderDoc, BuilderMusic, BuilderPhoto } from "@/lib/builder/types";

const storageKey = (templateId: TemplateId) => `bmv:builder:${templateId}`;

const coercePhotos = (value: unknown): BuilderPhoto[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter(
      (photo): photo is BuilderPhoto =>
        Boolean(photo) &&
        typeof photo.id === "string" &&
        typeof photo.order === "number"
    )
    .map((photo, index) => ({
      ...photo,
      order: Number.isFinite(photo.order) ? photo.order : index,
    }))
    .sort((a, b) => a.order - b.order);
};

const coerceMusic = (value: unknown): BuilderMusic | null => {
  if (!value || typeof value !== "object") {
    return null;
  }
  const music = value as Partial<BuilderMusic>;
  if (typeof music.url !== "string" || typeof music.name !== "string") {
    return null;
  }
  return {
    url: music.url,
    name: music.name,
    mime: typeof music.mime === "string" ? music.mime : undefined,
    duration: typeof music.duration === "number" ? music.duration : undefined,
  };
};

export const coerceBuilderDoc = (
  templateId: TemplateId,
  value: unknown
): BuilderDoc => {
  const defaults = getDefaultBuilderDoc(templateId);
  const settings = getBuilderSettings(templateId);
  if (!value || typeof value !== "object") {
    return defaults;
  }
  const doc = value as Partial<BuilderDoc>;
  const loveNotes = Array.isArray(doc.loveNotes)
    ? doc.loveNotes.filter((note) => typeof note === "string")
    : [];
  const loveNote =
    typeof doc.loveNote === "string"
      ? doc.loveNote
      : loveNotes[0] ?? defaults.loveNote;
  const sectionOrder = Array.isArray(doc.sectionOrder)
    ? doc.sectionOrder.filter(
        (section): section is "gallery" | "love-note" | "moments" =>
          section === "gallery" ||
          section === "love-note" ||
          section === "moments"
      )
    : defaults.sectionOrder;

  const photos = coercePhotos(doc.photos);

  return {
    templateId,
    title: typeof doc.title === "string" ? doc.title : defaults.title,
    subtitle: typeof doc.subtitle === "string" ? doc.subtitle : defaults.subtitle,
    loveNote,
    loveNotes: loveNotes.length > 0 ? loveNotes : defaults.loveNotes,
    moments: Array.isArray(doc.moments)
      ? doc.moments.filter((moment) => typeof moment === "string")
      : defaults.moments,
    photos:
      photos.length > 0
        ? photos.slice(0, settings.maxPhotos)
        : defaults.photos.slice(0, settings.maxPhotos),
    music: coerceMusic(doc.music) ?? defaults.music,
    selectedFont:
      typeof doc.selectedFont === "string"
        ? doc.selectedFont
        : defaults.selectedFont,
    titleSize: doc.titleSize ?? defaults.titleSize,
    showSubtitle:
      typeof doc.showSubtitle === "boolean"
        ? doc.showSubtitle
        : defaults.showSubtitle,
    sectionOrder: sectionOrder && sectionOrder.length === 3 ? sectionOrder : defaults.sectionOrder,
    photoMood: doc.photoMood ?? defaults.photoMood,
    backgroundIntensity: doc.backgroundIntensity ?? defaults.backgroundIntensity,
  };
};

export const loadBuilderDoc = (templateId: TemplateId): BuilderDoc => {
  if (typeof window === "undefined") {
    return getDefaultBuilderDoc(templateId);
  }
  const raw = window.localStorage.getItem(storageKey(templateId));
  if (!raw) {
    return getDefaultBuilderDoc(templateId);
  }
  try {
    return coerceBuilderDoc(templateId, JSON.parse(raw));
  } catch {
    return getDefaultBuilderDoc(templateId);
  }
};

export const saveBuilderDoc = (templateId: TemplateId, doc: BuilderDoc) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(storageKey(templateId), JSON.stringify(doc));
  } catch {
    // Ignore storage failures (quota, disabled storage, etc.)
  }
};

export const resetBuilderDoc = (templateId: TemplateId) => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(storageKey(templateId));
  }
  return getDefaultBuilderDoc(templateId);
};
