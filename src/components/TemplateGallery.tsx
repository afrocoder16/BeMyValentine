"use client";

import type { Template } from "@/data/templates";
import TemplateCard from "@/components/TemplateCard";

type TemplateGalleryProps = {
  templates: Template[];
};

export default function TemplateGallery({ templates }: TemplateGalleryProps) {
  return (
    <>
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </>
  );
}
