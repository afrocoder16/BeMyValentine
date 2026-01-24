"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
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
    <div className="flex flex-wrap items-center gap-4 rounded-[1.5rem] border border-amber-100 bg-white/90 px-5 py-3 text-slate-700 shadow-[0_18px_40px_-28px_rgba(148,163,184,0.7)]">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isPlaying}
        className="rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_40px_-28px_rgba(251,146,60,0.6)] transition hover:-translate-y-0.5"
        style={{
          background:
            "linear-gradient(135deg, var(--sunlit-accent-strong), var(--sunlit-accent))",
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div>
        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-amber-500">
          Soundtrack
        </p>
        <p className="mt-1 text-xs text-slate-600">
          <span aria-hidden="true">&#9835;</span> {title}
        </p>
      </div>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

const SUNLIT_PALETTE = {
  accent: "#f59e0b",
  accentStrong: "#f97316",
  blush: "#fb7185",
  leaf: "#34d399",
  sky: "#38bdf8",
  glow: "rgba(251,191,36,0.25)",
};

const NOTE_TILTS = ["-1.4deg", "1.2deg", "-0.8deg", "1.4deg"];
const PHOTO_TILTS = ["-2deg", "1.5deg", "-1.2deg", "2deg", "-1.6deg"];

export default function SunlitPicnicRenderer({
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
  const perkCards = doc.perkCards.filter(
    (card) => card.title.trim().length > 0 || card.body.trim().length > 0
  );
  const datePlanSteps = doc.datePlanSteps.filter(
    (step) => step.title.trim().length > 0 || step.body.trim().length > 0
  );
  const promiseItems = doc.promiseItems.filter(
    (item) => item.trim().length > 0
  );
  const sparkleWords = doc.swoonTags.filter((tag) => tag.trim().length > 0);
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
  const paletteStyle: CSSProperties = {
    "--sunlit-accent": SUNLIT_PALETTE.accent,
    "--sunlit-accent-strong": SUNLIT_PALETTE.accentStrong,
    "--sunlit-blush": SUNLIT_PALETTE.blush,
    "--sunlit-leaf": SUNLIT_PALETTE.leaf,
    "--sunlit-sky": SUNLIT_PALETTE.sky,
    "--sunlit-glow": SUNLIT_PALETTE.glow,
  };
  const [isYesAnimating, setIsYesAnimating] = useState(false);

  const triggerYesAnimation = () => {
    setIsYesAnimating(false);
    requestAnimationFrame(() => setIsYesAnimating(true));
  };

  return (
    <div
      className={`preview-body ${fontStyleClass} relative w-full overflow-hidden ${containerRadius} ${containerHeight} bg-gradient-to-br ${theme.gradient} ${containerShadow}`}
      style={{ fontFamily: "var(--preview-body)", ...paletteStyle }}
    >
      <div className="pointer-events-none absolute inset-0 opacity-35 sunlit-gingham" />
      <div className={`absolute inset-0 ${backgroundOverlayClass}`} />
      <span
        aria-hidden="true"
        className="sunlit-float absolute -top-24 right-[-4rem] h-48 w-48 rounded-full blur-[1px]"
        style={{
          background:
            "radial-gradient(circle, var(--sunlit-glow), transparent 70%)",
        }}
      />
      <span
        aria-hidden="true"
        className="sunlit-float absolute bottom-[-4rem] left-[-3rem] h-56 w-56 rounded-full blur-[2px]"
        style={{
          background:
            "radial-gradient(circle, rgba(56,189,248,0.18), transparent 70%)",
          animationDelay: "-4s",
        }}
      />
      <span
        aria-hidden="true"
        className="sunlit-float absolute left-1/2 top-32 h-40 w-40 -translate-x-1/2 rounded-full blur-[2px]"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.18), transparent 70%)",
          animationDelay: "-8s",
        }}
      />

      {isPublished ? null : (
        <div className="absolute right-6 top-6 z-10 rounded-full bg-white/70 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-amber-500">
          Recipient view
        </div>
      )}

      <div
        className={`relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 md:px-12 ${
          isPhone ? "h-full overflow-y-auto" : ""
        }`}
      >
        <header className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-8">
            {showTagline ? (
              <div className="inline-flex items-center gap-3 rounded-full border border-amber-100 bg-white/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-amber-500 shadow-[0_12px_30px_-24px_rgba(251,146,60,0.6)]">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--sunlit-accent)" }}
                />
                {doc.tagline}
              </div>
            ) : null}
            <div>
              <h1 className={`preview-heading ${titleSizeClass} text-slate-900`}>
                {doc.title}
              </h1>
              {doc.showSubtitle === false ? null : (
                <p className="mt-4 max-w-2xl text-sm text-slate-700 md:text-base">
                  {doc.subtitle}
                </p>
              )}
            </div>
            {doc.music ? (
              <PreviewAudioControl title={doc.music.name} src={doc.music.url} />
            ) : null}
            {sparkleWords.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {sparkleWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="sunlit-spark rounded-full border border-amber-100 bg-white/90 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-amber-500"
                    style={{ animationDelay: `${index * 0.4}s` }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              <span
                aria-hidden="true"
                className="absolute -inset-6 rounded-full border border-dashed border-amber-200"
              />
              <button
                type="button"
                onClick={triggerYesAnimation}
                onAnimationEnd={() => setIsYesAnimating(false)}
                className={`relative flex h-44 w-44 flex-col items-center justify-center rounded-full border border-amber-200 bg-white text-slate-900 shadow-[0_30px_70px_-50px_rgba(251,146,60,0.55)] transition hover:-translate-y-0.5 ${
                  isYesAnimating ? "sunlit-pop" : ""
                }`}
              >
                {doc.swoonLabel.trim().length > 0 ? (
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.5em] text-amber-400">
                    {doc.swoonLabel}
                  </span>
                ) : null}
                <span className="mt-2 text-3xl font-semibold uppercase tracking-[0.2em] text-amber-500">
                  {doc.swoonHeadline.trim().length > 0 ? doc.swoonHeadline : "Yes"}
                </span>
              </button>
            </div>
            {doc.swoonBody.trim().length > 0 ? (
              <p className="max-w-xs text-center text-sm text-slate-700">
                {doc.swoonBody}
              </p>
            ) : null}
          </div>
        </header>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="preview-heading text-2xl text-slate-900 md:text-3xl">
              {doc.promiseTitle}
            </h2>
            <span className="text-xs uppercase tracking-[0.3em] text-amber-500">
              Quotes and poems
            </span>
          </div>
          {promiseItems.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {promiseItems.map((item, index) => (
                <blockquote
                  key={`${item}-${index}`}
                  className="sunlit-rise relative rounded-[2rem] border border-amber-100 bg-white/90 px-6 py-5 text-sm text-slate-700 shadow-[0_24px_55px_-45px_rgba(251,146,60,0.45)]"
                  style={{ animationDelay: `${index * 0.12}s` }}
                >
                  <span className="text-3xl text-amber-300">"</span>
                  <p className="mt-2 text-sm text-slate-700">{item}</p>
                </blockquote>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-amber-100 bg-white/90 px-6 py-5 text-sm text-slate-700">
              Add a few short lines to sprinkle around the page.
            </div>
          )}
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="preview-heading text-2xl text-slate-900 md:text-3xl">
              Picnic basket
            </h2>
            <span className="text-xs uppercase tracking-[0.3em] text-amber-500">
              Little details
            </span>
          </div>
          {perkCards.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {perkCards.map((card, index) => (
                <div
                  key={`${card.title}-${index}`}
                  className="sunlit-rise relative bg-white/90 px-5 py-4 text-sm text-slate-700 shadow-[0_20px_40px_-32px_rgba(251,146,60,0.45)]"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    clipPath:
                      "polygon(6% 0, 94% 0, 100% 50%, 94% 100%, 6% 100%, 0 50%)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      border: "1px solid rgba(251,191,36,0.35)",
                      clipPath:
                        "polygon(6% 0, 94% 0, 100% 50%, 94% 100%, 6% 100%, 0 50%)",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--sunlit-accent)" }}
                  />
                  {card.title.trim().length > 0 ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
                      {card.title}
                    </p>
                  ) : null}
                  {card.body.trim().length > 0 ? (
                    <p className="mt-2 text-sm text-slate-700">{card.body}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-amber-100 bg-white/90 px-6 py-5 text-sm text-slate-700">
              Add a few basket details in the builder.
            </div>
          )}
        </section>

        {orderedSections.map((section) => {
          if (section === "gallery") {
            return (
              <section key="gallery" className="space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="preview-heading text-2xl text-slate-900 md:text-3xl">
                    Storybook photos
                  </h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-amber-500">
                    Picnic snaps
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map((photo, index) => (
                    <div
                      key={`${photo.id}-${index}`}
                      className="sunlit-rise"
                      style={{ animationDelay: `${index * 0.12}s` }}
                    >
                      <div
                        className="relative overflow-hidden bg-white/95 p-3 shadow-[0_24px_60px_-45px_rgba(251,146,60,0.5)]"
                        style={{
                          transform: `rotate(${PHOTO_TILTS[index % PHOTO_TILTS.length]})`,
                          borderRadius: "1.75rem",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute left-1/2 top-2 h-3 w-12 -translate-x-1/2 rounded-full bg-amber-200/80"
                        />
                        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-amber-50">
                          {photo.src ? (
                            <Image
                              src={photo.src}
                              alt={photo.alt ?? `Photo ${index + 1}`}
                              fill
                              sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 90vw"
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
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          if (section === "love-note") {
            return (
              <section key="love-note" className="space-y-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="preview-heading text-2xl text-slate-900 md:text-3xl">
                    Little poems
                  </h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-amber-500">
                    Handwritten
                  </span>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {loveNotes.length > 0 ? (
                    loveNotes.map((note, index) => {
                      const title =
                        doc.loveNoteTitles?.[index]?.trim() ||
                        (index === 0 ? "Love note" : "Golden note");
                      return (
                        <div
                          key={`love-note-${index}`}
                          className="sunlit-rise"
                          style={{ animationDelay: `${index * 0.12}s` }}
                        >
                          <article
                            className="relative overflow-hidden rounded-[2.5rem] border border-amber-100 bg-white/95 p-8 shadow-[0_28px_70px_-55px_rgba(251,146,60,0.45)] sunlit-page"
                            style={{
                              transform: `rotate(${NOTE_TILTS[index % NOTE_TILTS.length]})`,
                            }}
                          >
                            <span
                              aria-hidden="true"
                              className="sunlit-spark absolute right-6 top-6 h-2 w-2 rounded-full"
                              style={{ backgroundColor: "var(--sunlit-accent)" }}
                            />
                            <h3 className="preview-heading text-2xl text-slate-900 md:text-3xl">
                              {title}
                            </h3>
                            <p className="mt-4 text-sm text-slate-700 md:text-base">
                              {note}
                            </p>
                          </article>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-[2.5rem] border border-amber-100 bg-white/95 p-8 text-center text-sm text-slate-700">
                      Add a love note to share your favorite memories.
                    </div>
                  )}
                </div>
              </section>
            );
          }

          return (
            <section key="moments" className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="preview-heading text-2xl text-slate-900 md:text-3xl">
                  {doc.momentsTitle}
                </h2>
                <span className="text-xs uppercase tracking-[0.3em] text-amber-500">
                  Sunlit reasons
                </span>
              </div>
              <div className="relative rounded-[2.5rem] border border-amber-100 bg-white/95 p-6 shadow-[0_26px_60px_-48px_rgba(251,146,60,0.45)]">
                <div
                  aria-hidden="true"
                  className="sunlit-route-vertical absolute left-6 top-6 hidden h-[calc(100%-3rem)] w-px md:block"
                />
                {moments.length > 0 ? (
                  <div className="space-y-5">
                    {moments.map((moment, index) => (
                      <div
                        key={`${moment}-${index}`}
                        className="sunlit-rise flex items-start gap-4"
                        style={{ animationDelay: `${index * 0.12}s` }}
                      >
                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-amber-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden="true"
                          className="sunlit-spark mt-2 h-2 w-2 rounded-full"
                          style={{
                            backgroundColor: "var(--sunlit-accent)",
                            animationDelay: `${index * 0.3}s`,
                          }}
                        />
                        <p className="text-sm text-slate-700">{moment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-700">
                    Add your reasons in the builder.
                  </p>
                )}
              </div>
            </section>
          );
        })}

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="preview-heading text-2xl text-slate-900 md:text-3xl">
              {doc.datePlanTitle}
            </h2>
            <span className="text-xs uppercase tracking-[0.3em] text-amber-500">
              Picnic plan
            </span>
          </div>
          {datePlanSteps.length > 0 ? (
            <div className="relative">
              <div
                aria-hidden="true"
                className="sunlit-route absolute left-6 right-6 top-8 hidden h-px md:block"
              />
              <div className="grid gap-4 md:grid-cols-3">
                {datePlanSteps.map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="sunlit-rise rounded-[2rem] border border-amber-100 bg-white/95 p-5 shadow-[0_22px_50px_-40px_rgba(251,146,60,0.45)]"
                    style={{ animationDelay: `${index * 0.12}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--sunlit-accent), var(--sunlit-accent-strong))",
                        }}
                      >
                        {index + 1}
                      </span>
                      {step.title.trim().length > 0 ? (
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
                          {step.title}
                        </p>
                      ) : null}
                    </div>
                    {step.body.trim().length > 0 ? (
                      <p className="mt-3 text-sm text-slate-700">
                        {step.body}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-[2rem] border border-amber-100 bg-white/95 px-6 py-5 text-sm text-slate-700">
              Add a plan in the builder.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
