"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Template } from "@/data/templates";

type TemplatePhonePreviewProps = {
  template: Template;
  labelLeft?: string;
  labelRight?: string;
};

export default function TemplatePhonePreview({
  template,
  labelLeft = "Live preview",
  labelRight = "In 60 sec",
}: TemplatePhonePreviewProps) {
  const previewImage = template.demo.images[0];
  const [showImage, setShowImage] = useState(Boolean(previewImage));

  useEffect(() => {
    setShowImage(Boolean(previewImage));
  }, [previewImage]);

  return (
    <div className="glass-card rounded-[2.5rem] p-6">
      <div className="rounded-[2rem] bg-white/80 p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
          <span>{labelLeft}</span>
          <span>{labelRight}</span>
        </div>
        <div className="mt-6 flex flex-col items-center">
          <div className="rounded-[2.5rem] border border-white/80 bg-white/90 p-2 shadow-soft">
            <div className="relative h-[420px] w-[220px] overflow-hidden rounded-[2rem]">
              {previewImage && showImage ? (
                <Image
                  src={previewImage}
                  alt={`${template.name} preview`}
                  fill
                  sizes="220px"
                  className="object-cover"
                  onError={() => setShowImage(false)}
                />
              ) : (
                <div
                  className={`h-full w-full bg-gradient-to-br ${template.theme.gradient}`}
                />
              )}
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm font-semibold text-slate-800">
              {template.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {template.demo.caption}
            </p>
            {template.demo.music ? (
              <p className="mt-2 text-[0.65rem] uppercase tracking-[0.24em] text-slate-400">
                ♫ {template.demo.music.title}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
