"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Template } from "@/data/templates";
import type { TemplateDraft } from "@/lib/templates/drafts";

type TemplateLivePreviewProps = {
  template: Template;
  draft: TemplateDraft;
  mode: "desktop" | "phone";
};

type PreviewAudioControlProps = {
  title: string;
  src: string;
};

function PreviewAudioControl({ title, src }: PreviewAudioControlProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleToggle = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-[0_18px_40px_-24px_rgba(244,63,94,0.85)] ring-1 ring-white/70 backdrop-blur">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isPlaying}
        className="rounded-full bg-rose-600 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-rose-500"
      >
        {isPlaying ? "Pause" : "Tap to play"}
      </button>
      <span className="text-xs text-slate-700">
        <span aria-hidden="true">&#9835;</span> {title}
      </span>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

export default function TemplateLivePreview({
  template,
  draft,
  mode,
}: TemplateLivePreviewProps) {
  const photos = draft.photos.length
    ? draft.photos
    : Array.from({ length: 3 }, (_, index) => ({
        id: `placeholder-${index + 1}`,
        dataUrl: "",
      }));

  const moments = draft.moments.filter((moment) => moment.trim().length > 0);
  const isPhone = mode === "phone";
  const [animate, setAnimate] = useState(false);
  const photoSignature = draft.photos.map((photo) => photo.id).join("|");
  const momentSignature = draft.moments.join("|");

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 240);
    return () => clearTimeout(timeout);
  }, [
    draft.title,
    draft.subtitle,
    draft.loveNote,
    momentSignature,
    photoSignature,
    draft.music?.id,
  ]);

  const content = (
    <div
      className={`relative w-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br ${template.theme.gradient} shadow-soft transition-all duration-300 ${
        animate ? "opacity-90 translate-y-2" : "opacity-100 translate-y-0"
      } ${isPhone ? "h-full" : ""}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "url('/textures/noise.png')",
            backgroundRepeat: "repeat",
          }}
        />
      </div>
      <div className="absolute right-6 top-6 z-10 rounded-full bg-white/80 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-rose-500">
        Recipient view
      </div>
      <div
        className={`relative flex flex-col px-6 pb-16 pt-16 md:px-10 ${
          isPhone ? "h-full overflow-y-auto" : ""
        }`}
      >
        <header className="text-center text-white">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-rose-100/90">
            {template.vibeTagline}
          </p>
          <h1 className="mt-4 font-display text-3xl md:text-5xl">
            {draft.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-rose-50/90 md:text-base">
            {draft.subtitle}
          </p>
          {draft.music ? (
            <div className="mt-6 flex justify-center">
              <PreviewAudioControl
                title={draft.music.label}
                src={draft.music.src}
              />
            </div>
          ) : null}
        </header>

        <section className="mt-12 space-y-4">
          <h2 className="text-center font-display text-2xl text-white md:text-3xl">
            Our little gallery
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <div
                key={`${photo.id}-${index}`}
                className="relative overflow-hidden rounded-3xl bg-white/80 shadow-soft"
                style={{ aspectRatio: "4 / 5" }}
              >
                {photo.dataUrl ? (
                  <Image
                    src={photo.dataUrl}
                    alt={`Photo ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 100vw"
                    className="object-cover"
                    unoptimized={photo.dataUrl.startsWith("data:")}
                  />
                ) : (
                  <div
                    className={`h-full w-full bg-gradient-to-br ${template.theme.gradient}`}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-[2.5rem] bg-white/85 p-8 text-center shadow-soft">
          <h2 className="font-display text-2xl text-slate-900 md:text-3xl">
            Love note
          </h2>
          <p className="mt-4 text-sm text-slate-600 md:text-base">
            {draft.loveNote}
          </p>
        </section>

        <section className="mt-10 rounded-[2.5rem] bg-white/80 p-8 shadow-soft">
          <h2 className="text-center font-display text-2xl text-slate-900 md:text-3xl">
            Cute moments
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-600 md:text-base">
            {moments.map((moment) => (
              <li key={moment} className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-300" />
                <span>{moment}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );

  if (isPhone) {
    return (
      <div className="flex w-full items-center justify-center py-6">
        <div className="rounded-[3rem] border border-white/70 bg-white/60 p-2 shadow-soft">
          <div className="h-[720px] w-[360px] max-h-[75vh] max-w-[85vw] overflow-hidden rounded-[2.5rem]">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-full">{content}</div>;
}
