"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { TemplateRendererProps } from "@/lib/builder/types";
import {
  resolveBackgroundOverlayClass,
  resolveFontClass,
  resolvePhotoFilterStyle,
  resolveTitleSizeClass,
} from "@/templates/renderers/utils";

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
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-slate-900/70 px-4 py-2 text-slate-100 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.8)] ring-1 ring-white/10 backdrop-blur">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isPlaying}
        className="rounded-full bg-rose-500 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-rose-400"
      >
        {isPlaying ? "Pause" : "Tap to play"}
      </button>
      <span className="text-xs text-slate-200">
        <span aria-hidden="true">&#9835;</span> {title}
      </span>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

export default function MidnightMuseRenderer({
  doc,
  theme,
  mode,
  context = "builder",
}: TemplateRendererProps) {
  const photos = doc.photos.length
    ? [...doc.photos].sort((a, b) => a.order - b.order)
    : Array.from({ length: 3 }, (_, index) => ({
        id: `placeholder-${index + 1}`,
        src: "",
        alt: undefined,
        order: index,
      }));
  const moments = doc.moments.filter((moment) => moment.trim().length > 0);
  const loveNotes =
    doc.loveNotes && doc.loveNotes.length > 0
      ? doc.loveNotes.filter((note) => note.trim().length > 0)
      : doc.loveNote
        ? [doc.loveNote]
        : [];
  const isPhone = mode === "phone";
  const isPublished = context === "published";
  const fontStyleClass = resolveFontClass(doc.selectedFont);
  const titleSizeClass = resolveTitleSizeClass(doc.titleSize);
  const backgroundOverlayClass = resolveBackgroundOverlayClass(
    doc.backgroundIntensity
  );
  const photoFilterStyle = resolvePhotoFilterStyle(doc.photoMood);
  const containerShadow = isPhone || !isPublished ? "shadow-2xl" : "shadow-none";
  const containerRadius = isPhone
    ? "rounded-[2.5rem]"
    : isPublished
      ? "rounded-none"
      : "rounded-[2rem]";
  const containerHeight = isPhone
    ? "h-full"
    : isPublished
      ? "min-h-screen"
      : "min-h-full";
  const orderedSections =
    doc.sectionOrder && doc.sectionOrder.length === 3
      ? doc.sectionOrder
      : ["gallery", "love-note", "moments"];

  return (
    <div
      className={`preview-body ${fontStyleClass} relative w-full overflow-hidden ${containerRadius} ${containerHeight} bg-gradient-to-br ${theme.gradient} ${containerShadow}`}
      style={{ fontFamily: "var(--preview-body)" }}
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
      <div className={`absolute inset-0 ${backgroundOverlayClass}`} />
      {isPublished ? null : (
        <div className="absolute right-6 top-6 z-10 rounded-full bg-white/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-200">
          Recipient view
        </div>
      )}

      <div
        className={`relative flex flex-col px-6 pb-16 pt-16 md:px-12 ${
          isPhone ? "h-full overflow-y-auto" : ""
        }`}
      >
        <header className="text-center text-slate-100">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-rose-200/80">
            {theme.tagline}
          </p>
          <h1 className={`preview-heading mt-4 ${titleSizeClass}`}>
            {doc.title}
          </h1>
          {doc.showSubtitle === false ? null : (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-200/90 md:text-base">
              {doc.subtitle}
            </p>
          )}
          {doc.music ? (
            <div className="mt-6 flex justify-center">
              <PreviewAudioControl title={doc.music.name} src={doc.music.url} />
            </div>
          ) : null}
        </header>

        {orderedSections.map((section) => {
          if (section === "gallery") {
            return (
              <section key="gallery" className="mt-12 space-y-4">
                <h2 className="preview-heading text-center text-2xl text-slate-100 md:text-3xl">
                  After dark gallery
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map((photo, index) => (
                    <div
                      key={`${photo.id}-${index}`}
                      className="relative overflow-hidden rounded-3xl bg-slate-900/70 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.9)] ring-1 ring-white/10"
                      style={{ aspectRatio: "4 / 5" }}
                    >
                      {photo.src ? (
                        <Image
                          src={photo.src}
                          alt={photo.alt ?? `Photo ${index + 1}`}
                          fill
                          sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 100vw"
                          className="object-cover"
                          style={photoFilterStyle}
                          unoptimized={photo.src.startsWith("data:")}
                        />
                      ) : (
                        <div
                          className={`h-full w-full bg-gradient-to-br ${theme.gradient}`}
                          style={photoFilterStyle}
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === "love-note") {
            return (
              <section key="love-note" className="mt-12 space-y-6">
                {loveNotes.length > 0 ? (
                  loveNotes.map((note, index) => (
                    <div
                      key={`love-note-${index}`}
                      className="rounded-[2.5rem] bg-slate-900/70 p-8 text-center shadow-[0_18px_50px_-32px_rgba(15,23,42,0.9)] ring-1 ring-white/10"
                    >
                      <h2 className="preview-heading text-2xl text-slate-50 md:text-3xl">
                        {index === 0 ? "Love note" : "Midnight echoes"}
                      </h2>
                      <p className="mt-4 text-sm text-slate-200 md:text-base">
                        {note}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2.5rem] bg-slate-900/70 p-8 text-center shadow-soft ring-1 ring-white/10">
                    <h2 className="preview-heading text-2xl text-slate-50 md:text-3xl">
                      Love note
                    </h2>
                    <p className="mt-4 text-sm text-slate-200 md:text-base">
                      Add a love note to share your favorite memories.
                    </p>
                  </div>
                )}
              </section>
            );
          }

          return (
            <section
              key="moments"
              className="mt-10 rounded-[2.5rem] bg-slate-900/70 p-8 shadow-soft ring-1 ring-white/10"
            >
              <h2 className="preview-heading text-center text-2xl text-slate-50 md:text-3xl">
                Cute moments
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-200 md:text-base">
                {moments.map((moment, index) => (
                  <li key={`${moment}-${index}`} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-300" />
                    <span>{moment}</span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
