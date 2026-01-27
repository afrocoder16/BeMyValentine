import type { TemplateId } from "@/data/templates";
import type { TemplateRenderer } from "@/lib/builder/types";
import CuteClassicRenderer from "@/templates/renderers/CuteClassicRenderer";
import GardenPartyRenderer from "@/templates/renderers/GardenPartyRenderer";
import MidnightMuseRenderer from "@/templates/renderers/MidnightMuseRenderer";
import RetroLoveRenderer from "@/templates/renderers/RetroLoveRenderer";
import SunlitPicnicRenderer from "@/templates/renderers/SunlitPicnicRenderer";
import StarlitConstellationsRenderer from "@/templates/renderers/StarlitConstellationsRenderer";

const renderers: Partial<Record<TemplateId, TemplateRenderer>> = {
  "cute-classic": CuteClassicRenderer,
  "garden-party": GardenPartyRenderer,
  "midnight-muse": MidnightMuseRenderer,
  "retro-love": RetroLoveRenderer,
  "sunlit-picnic": SunlitPicnicRenderer,
  "starlit-constellations": StarlitConstellationsRenderer,
};

export const getTemplateRenderer = (templateId: TemplateId): TemplateRenderer =>
  renderers[templateId] ?? CuteClassicRenderer;
