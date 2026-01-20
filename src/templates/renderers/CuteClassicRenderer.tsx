"use client";

import { useEffect, useRef, useState } from "react";
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
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-[0_18px_40px_-24px_rgba(14,165,233,0.45)] ring-1 ring-white/70 backdrop-blur">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isPlaying}
        className="rounded-full bg-sky-500 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-sky-400"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <span className="text-xs text-slate-700">
        <span aria-hidden="true">&#9835;</span> {title}
      </span>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

export default function CuteClassicRenderer({
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
  const containerShadow = isPhone || !isPublished ? "shadow-soft" : "shadow-none";
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
  const captionMoments = moments.slice(0, photos.length);

  return (
    <div
      className={`preview-body ${fontStyleClass} relative w-full overflow-hidden ${containerRadius} ${containerHeight} bg-gradient-to-br ${theme.gradient} ${containerShadow}`}
      style={{ fontFamily: "var(--preview-body)" }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "url('/textures/noise.png')",
            backgroundRepeat: "repeat",
          }}
        />
      </div>
      <div className={`absolute inset-0 ${backgroundOverlayClass}`} />
      <span
        aria-hidden="true"
        className="floaty absolute left-8 top-10 h-16 w-16 rounded-full bg-white/70 blur-[1px]"
        style={{ animationDuration: "10s" }}
      />
      <span
        aria-hidden="true"
        className="floaty absolute right-10 top-24 h-12 w-12 rounded-full bg-rose-200/70"
        style={{ animationDuration: "7s", animationDelay: "-2s" }}
      />
      <span
        aria-hidden="true"
        className="floaty absolute left-6 bottom-24 h-10 w-10 rounded-full bg-amber-200/70"
        style={{ animationDuration: "9s", animationDelay: "-4s" }}
      />
      <span
        aria-hidden="true"
        className="floaty absolute right-6 bottom-10 h-14 w-14 rounded-full bg-sky-200/70"
        style={{ animationDuration: "11s", animationDelay: "-1s" }}
      />

      {isPublished ? null : (
        <div className="absolute right-6 top-6 z-10 rounded-full bg-white/80 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-rose-500">
          Recipient view
        </div>
      )}

      <div
        className={`relative mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 pb-24 pt-16 md:px-12 ${
          isPhone ? "h-full overflow-y-auto" : ""
        }`}
      >
        <header className="text-center text-slate-900">
          <div className="mx-auto inline-flex items-center gap-3 rounded-full bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-rose-500 shadow-soft">
            {theme.tagline}
          </div>
          <h1 className={`preview-heading mt-6 ${titleSizeClass}`}>
            {doc.title}
          </h1>
          {doc.showSubtitle === false ? null : (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-700 md:text-base">
              {doc.subtitle}
            </p>
          )}
          {doc.music ? (
            <div className="mt-6 flex justify-center">
              <PreviewAudioControl title={doc.music.name} src={doc.music.url} />
            </div>
          ) : null}
        </header>

        <section className="flex flex-col items-center gap-5 text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="rounded-[2.5rem] bg-emerald-400 px-8 py-6 text-4xl font-bold uppercase tracking-[0.2em] text-white shadow-[0_25px_50px_-30px_rgba(16,185,129,0.8)]">
              Yes
            </div>
            <div className="rounded-full bg-rose-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-soft">
              What about a cute date?
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.28em] text-rose-600">
            {[
              "Certified cutie",
              "Snack bribed",
              "Meme approved",
              "Hug voucher",
            ].map((label) => (
              <span
                key={label}
                className="rounded-full bg-white/80 px-4 py-2 shadow-soft"
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        {orderedSections.map((section) => {
          if (section === "gallery") {
            return (
              <section key="gallery" className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="preview-heading text-2xl text-slate-900 md:text-3xl">
                    The chaos gallery
                  </h2>
                  <span className="rounded-full bg-white/80 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-rose-500">
                    GIFs welcome
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map((photo, index) => (
                    <div key={`${photo.id}-${index}`} className="space-y-3">
                      <div
                        className="relative overflow-hidden rounded-[2.5rem] bg-white/85 shadow-[0_24px_60px_-40px_rgba(248,113,113,0.8)]"
                        style={{ aspectRatio: "4 / 5" }}
                      >
                        {photo.src ? (
                          <img
                            src={photo.src}
                            alt={photo.alt ?? `Photo ${index + 1}`}
                            className="h-full w-full object-cover"
                            style={photoFilterStyle}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className={`h-full w-full bg-gradient-to-br ${theme.gradient}`}
                            style={photoFilterStyle}
                          />
                        )}
                      </div>
                      {captionMoments[index] ? (
                        <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-soft">
                          {captionMoments[index]}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === "love-note") {
            return (
              <section key="love-note" className="space-y-6">
                {loveNotes.length > 0 ? (
                  loveNotes.map((note, index) => (
                    <div
                      key={`love-note-${index}`}
                      className="rounded-[2.5rem] border-2 border-dashed border-rose-200 bg-white/90 p-8 text-center shadow-[0_25px_60px_-40px_rgba(244,114,182,0.6)]"
                    >
                      <h2 className="preview-heading text-2xl text-slate-900 md:text-3xl">
                        {index === 0 ? "Love note" : "Extra love"}
                      </h2>
                      <p className="mt-4 text-sm text-slate-700 md:text-base">
                        {note}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2.5rem] border-2 border-dashed border-rose-200 bg-white/90 p-8 text-center shadow-soft">
                    <h2 className="preview-heading text-2xl text-slate-900 md:text-3xl">
                      Love note
                    </h2>
                    <p className="mt-4 text-sm text-slate-700 md:text-base">
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
              className="rounded-[2.5rem] bg-white/85 p-8 shadow-soft"
            >
              <h2 className="preview-heading text-center text-2xl text-slate-900 md:text-3xl">
                Reasons I am obsessed with you
              </h2>
              <ul className="mt-5 grid gap-3 text-sm text-slate-700 md:text-base">
                {moments.map((moment, index) => (
                  <li
                    key={`${moment}-${index}`}
                    className="rounded-2xl bg-rose-50/80 px-4 py-3 shadow-soft"
                  >
                    {moment}
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
