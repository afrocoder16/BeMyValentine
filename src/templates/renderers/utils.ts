import type { BuilderDoc } from "@/lib/builder/types";

export const resolveFontClass = (selectedFont: string) => {
  const allowed = ["classic", "soft", "playful", "romantic"];
  const fontKey = allowed.includes(selectedFont) ? selectedFont : "classic";
  return `preview-font-${fontKey}`;
};

export const resolveTitleSizeClass = (titleSize?: BuilderDoc["titleSize"]) => {
  if (titleSize === "small") {
    return "text-3xl md:text-4xl";
  }
  if (titleSize === "big") {
    return "text-5xl md:text-6xl";
  }
  return "text-4xl md:text-5xl";
};

export const resolveBackgroundOverlayClass = (
  intensity?: BuilderDoc["backgroundIntensity"]
) => {
  if (intensity === "soft") {
    return "bg-white/20";
  }
  if (intensity === "bold") {
    return "bg-white/0";
  }
  return "bg-white/10";
};

export const resolvePhotoFilterStyle = (
  mood?: BuilderDoc["photoMood"]
) => {
  if (mood === "soft") {
    return { filter: "brightness(1.05) saturate(1.12) sepia(0.08)" };
  }
  if (mood === "pink") {
    return { filter: "brightness(1.08) saturate(1.2) hue-rotate(-8deg)" };
  }
  if (mood === "vintage") {
    return { filter: "sepia(0.35) contrast(0.95) saturate(0.9)" };
  }
  return { filter: "none" };
};
