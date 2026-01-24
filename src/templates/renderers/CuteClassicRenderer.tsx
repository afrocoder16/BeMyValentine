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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    audio.pause();
    audio.currentTime = 0;
    if (!src) {
      setIsPlaying(false);
      return;
    }
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [src]);

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
        className="rounded-full bg-sky-500 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_12px_30px_-18px_rgba(14,165,233,0.7)] ring-1 ring-white/80 transition hover:-translate-y-0.5 hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
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
  const showTagline =
    doc.tagline.trim().length > 0 &&
    (!isPublished || doc.tagline.trim() !== theme.tagline.trim());
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
  const [isYesAnimating, setIsYesAnimating] = useState(false);
  const perkCards = doc.perkCards.filter(
    (perk) => perk.title.trim().length > 0 || perk.body.trim().length > 0
  );
  const sparkleWords = doc.swoonTags.filter((tag) => tag.trim().length > 0);
  const datePlanSteps = doc.datePlanSteps.filter(
    (step) => step.title.trim().length > 0 || step.body.trim().length > 0
  );
  const promiseItems = doc.promiseItems.filter(
    (item) => item.trim().length > 0
  );

  const triggerYesAnimation = () => {
    setIsYesAnimating(false);
    requestAnimationFrame(() => setIsYesAnimating(true));
  };

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
      <span
        aria-hidden="true"
        className="twinkle absolute left-1/2 top-12 h-2 w-2 -translate-x-1/2 rounded-full bg-white/90"
      />
      <span
        aria-hidden="true"
        className="twinkle absolute left-16 top-44 h-3 w-3 rotate-45 rounded-[4px] bg-rose-200/90"
        style={{ animationDelay: "-1.5s" }}
      />
      <span
        aria-hidden="true"
        className="twinkle absolute right-20 top-52 h-2.5 w-2.5 rotate-45 rounded-[4px] bg-amber-200/90"
        style={{ animationDelay: "-0.8s" }}
      />
      <span
        aria-hidden="true"
        className="twinkle absolute left-24 bottom-32 h-2 w-2 rounded-full bg-rose-100/90"
        style={{ animationDelay: "-2.2s" }}
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
          {showTagline ? (
            <div className="mx-auto inline-flex items-center gap-3 rounded-full bg-white/80 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-rose-500 shadow-soft">
              {doc.tagline}
            </div>
          ) : null}
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
            <button
              type="button"
              onClick={triggerYesAnimation}
              onAnimationEnd={() => setIsYesAnimating(false)}
              className={`rounded-[2.5rem] bg-emerald-400 px-8 py-6 text-4xl font-bold uppercase tracking-[0.2em] text-white shadow-[0_25px_50px_-30px_rgba(16,185,129,0.8)] transition hover:bg-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200 ${
                isYesAnimating ? "yes-pop" : ""
              }`}
            >
              Yes
            </button>
            <div className="rounded-full bg-rose-500 px-5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-soft">
              What about a cute date?
            </div>
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="no-dodge">
              <button
                type="button"
                className="no-glow rounded-full border border-rose-200 bg-white/90 px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-rose-600 shadow-soft transition hover:bg-rose-50/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
              >
                No
              </button>
            </div>
            <span className="text-[0.65rem] uppercase tracking-[0.3em] text-rose-500">
              Not a real option
            </span>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/90 p-6 text-left shadow-soft transition duration-300 hover:-translate-y-1">
            <span
              aria-hidden="true"
              className="twinkle absolute right-10 top-10 h-2.5 w-2.5 rounded-full bg-rose-200/80"
            />
            <span
              aria-hidden="true"
              className="twinkle absolute -right-4 bottom-6 h-12 w-12 rounded-full bg-amber-100/80 blur-[1px]"
              style={{ animationDelay: "-1.2s" }}
            />
            {doc.swoonLabel.trim().length > 0 ? (
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
                {doc.swoonLabel}
              </p>
            ) : null}
            {doc.swoonHeadline.trim().length > 0 ? (
              <h3 className="preview-heading mt-3 text-2xl text-slate-900 md:text-3xl">
                {doc.swoonHeadline}
              </h3>
            ) : null}
            {doc.swoonBody.trim().length > 0 ? (
              <p className="mt-2 text-sm text-slate-600">
                {doc.swoonBody}
              </p>
            ) : null}
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-rose-100">
              <div className="swoon-meter h-full w-[88%] rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400" />
            </div>
            {sparkleWords.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-rose-500">
                {sparkleWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="rounded-full bg-rose-50/80 px-3 py-1 shadow-soft"
                  >
                    {word}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {perkCards.map((perk, index) => (
              <div
                key={`${perk.title}-${index}`}
                className={`relative overflow-hidden rounded-[2rem] border border-rose-100 bg-white/85 p-4 shadow-soft transition duration-300 hover:-translate-y-1 ${
                  index % 2 === 0 ? "sticker-wiggle" : ""
                }`}
              >
                <span
                  aria-hidden="true"
                  className="twinkle absolute right-4 top-4 h-2 w-2 rounded-full bg-rose-300/80"
                />
                <span
                  aria-hidden="true"
                  className="glow-sweep absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-rose-200/50 to-transparent"
                />
                {perk.title.trim().length > 0 ? (
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                    {perk.title}
                  </p>
                ) : null}
                {perk.body.trim().length > 0 ? (
                  <p className="mt-2 text-sm text-slate-600">{perk.body}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-soft transition duration-300 hover:-translate-y-1">
            <span
              aria-hidden="true"
              className="glow-sweep absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-rose-200/60 to-transparent"
            />
            <span
              aria-hidden="true"
              className="twinkle absolute right-6 top-6 h-2.5 w-2.5 rounded-full bg-rose-200/80"
            />
            {doc.datePlanTitle.trim().length > 0 ? (
              <h3 className="preview-heading text-2xl text-slate-900 md:text-3xl">
                {doc.datePlanTitle}
              </h3>
            ) : null}
            {datePlanSteps.length > 0 ? (
              <div className="mt-5 space-y-4">
                {datePlanSteps.map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className={`relative rounded-[1.75rem] border border-rose-100 bg-white/85 p-4 shadow-soft transition duration-300 hover:-translate-y-1 ${
                      index % 2 === 0 ? "ticket-float" : ""
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-rose-100"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-rose-100"
                    />
                    <div className="flex items-start gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white shadow-soft">
                        {index + 1}
                      </span>
                      <div>
                        {step.title.trim().length > 0 ? (
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                            {step.title}
                          </p>
                        ) : null}
                        {step.body.trim().length > 0 ? (
                          <p className="mt-2 text-sm text-slate-600">
                            {step.body}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-soft transition duration-300 hover:-translate-y-1">
            <span
              aria-hidden="true"
              className="glow-sweep absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-amber-200/60 to-transparent"
            />
            <span
              aria-hidden="true"
              className="twinkle absolute right-6 top-6 h-2.5 w-2.5 rounded-full bg-amber-200/80"
            />
            {doc.promiseTitle.trim().length > 0 ? (
              <h3 className="preview-heading text-2xl text-slate-900 md:text-3xl">
                {doc.promiseTitle}
              </h3>
            ) : null}
            {promiseItems.length > 0 ? (
              <ul className="mt-5 space-y-3 text-sm text-slate-600">
                {promiseItems.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="rounded-[1.75rem] bg-rose-50/80 px-4 py-3 shadow-soft transition duration-300 hover:-translate-y-0.5"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
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
                        className="relative overflow-hidden rounded-[2.5rem] bg-white/85 shadow-[0_24px_60px_-40px_rgba(248,113,113,0.8)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-40px_rgba(248,113,113,0.85)]"
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
                        <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-soft transition duration-300 hover:-translate-y-0.5">
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
              <section key="love-note" className="space-y-8">
                {loveNotes.length > 0 ? (
                  loveNotes.map((note, index) => {
                    const title =
                      doc.loveNoteTitles?.[index]?.trim() ||
                      (index === 0 ? "Love note" : "Extra love");
                    return (
                      <div
                        key={`love-note-${index}`}
                        className="rounded-[2.5rem] border-2 border-dashed border-rose-200 bg-white/90 p-8 text-center shadow-[0_25px_60px_-40px_rgba(244,114,182,0.6)] transition duration-300 hover:-translate-y-1"
                      >
                        <h2 className="preview-heading text-2xl text-slate-900 md:text-3xl">
                          {title}
                        </h2>
                        <p className="mt-4 text-sm text-slate-700 md:text-base">
                          {note}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <div className="rounded-[2.5rem] border-2 border-dashed border-rose-200 bg-white/90 p-8 text-center shadow-soft transition duration-300 hover:-translate-y-1">
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
                {doc.momentsTitle}
              </h2>
              <ul className="mt-5 grid gap-3 text-sm text-slate-700 md:text-base">
                {moments.map((moment, index) => (
                  <li
                    key={`${moment}-${index}`}
                    className="rounded-2xl bg-rose-50/80 px-4 py-3 shadow-soft transition duration-300 hover:-translate-y-0.5"
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
