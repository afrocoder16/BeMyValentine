import type { TemplateId } from "@/data/templates";
import type { TemplateRenderer } from "@/lib/builder/types";
import CuteClassicRenderer from "@/templates/renderers/CuteClassicRenderer";
import MidnightMuseRenderer from "@/templates/renderers/MidnightMuseRenderer";

const renderers: Partial<Record<TemplateId, TemplateRenderer>> = {
  "cute-classic": CuteClassicRenderer,
  "midnight-muse": MidnightMuseRenderer,
};

export const getTemplateRenderer = (templateId: TemplateId): TemplateRenderer =>
  renderers[templateId] ?? CuteClassicRenderer;
