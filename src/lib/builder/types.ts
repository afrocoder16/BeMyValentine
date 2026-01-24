import type { ReactElement } from "react";
import type { TemplateId } from "@/data/templates";

export type BuilderPhoto = {
  id: string;
  src?: string;
  alt?: string;
  order: number;
};

export type BuilderMusic = {
  url: string;
  name: string;
  mime?: string;
  duration?: number;
};

export type BuilderPerkCard = {
  title: string;
  body: string;
};

export type BuilderDoc = {
  templateId: TemplateId;
  tagline: string;
  title: string;
  subtitle: string;
  loveNote: string;
  loveNotes?: string[];
  loveNoteTitles: string[];
  momentsTitle: string;
  moments: string[];
  swoonLabel: string;
  swoonHeadline: string;
  swoonBody: string;
  swoonTags: string[];
  perkCards: BuilderPerkCard[];
  datePlanTitle: string;
  datePlanSteps: BuilderPerkCard[];
  promiseTitle: string;
  promiseItems: string[];
  photos: BuilderPhoto[];
  music: BuilderMusic | null;
  selectedFont: string;
  titleSize?: "small" | "normal" | "big";
  showSubtitle?: boolean;
  sectionOrder?: Array<"gallery" | "love-note" | "moments">;
  photoMood?: "soft" | "pink" | "vintage" | "natural";
  backgroundIntensity?: "soft" | "medium" | "bold";
  midnightPalette?: "velvet" | "ember" | "moonlight";
};

export type BuilderTheme = {
  gradient: string;
  tagline: string;
  card: string;
  text: string;
  mutedText: string;
  accent: string;
  maxPhotos: number;
  photoUpsellPrice: number;
  defaultFont: string;
};

export type BuilderSettings = {
  maxPhotos: number;
  photoUpsellPrice: number;
};

export type PreviewMode = "desktop" | "phone";
export type RenderContext = "builder" | "published";

export type TemplateRendererProps = {
  doc: BuilderDoc;
  theme: BuilderTheme;
  mode: PreviewMode;
  context?: RenderContext;
};

export type TemplateRenderer = (props: TemplateRendererProps) => ReactElement;
