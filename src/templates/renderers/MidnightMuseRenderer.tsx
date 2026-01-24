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
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-slate-100 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.9)] ring-1 ring-white/5 backdrop-blur">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isPlaying}
        className="rounded-full px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_40px_-26px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5"
        style={{
          background:
            "linear-gradient(135deg, var(--muse-accent-strong), var(--muse-accent))",
        }}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <span className="text-xs text-slate-200">
        <span aria-hidden="true">&#9835;</span> {title}
      </span>
      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}

type MidnightPalette = "velvet" | "ember" | "moonlight";

const MIDNIGHT_PALETTES: Record<
  MidnightPalette,
  {
    accent: string;
    accentStrong: string;
    accentSoft: string;
    accentMuted: string;
    shimmer: string;
  }
> = {
  velvet: {
    accent: "#f472b6",
    accentStrong: "#fb7185",
    accentSoft: "rgba(244,114,182,0.35)",
    accentMuted: "rgba(244,114,182,0.18)",
    shimmer: "rgba(244,114,182,0.12)",
  },
  ember: {
    accent: "#fb923c",
    accentStrong: "#f97316",
    accentSoft: "rgba(251,146,60,0.35)",
    accentMuted: "rgba(251,146,60,0.18)",
    shimmer: "rgba(251,146,60,0.12)",
  },
  moonlight: {
    accent: "#38bdf8",
    accentStrong: "#0ea5e9",
    accentSoft: "rgba(56,189,248,0.35)",
    accentMuted: "rgba(56,189,248,0.18)",
    shimmer: "rgba(56,189,248,0.12)",
  },
};

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
  const paletteKey = doc.midnightPalette as MidnightPalette | undefined;
  const palette =
    (paletteKey && MIDNIGHT_PALETTES[paletteKey]) ?? MIDNIGHT_PALETTES.velvet;
  const paletteStyle: CSSProperties = {
    "--muse-accent": palette.accent,
    "--muse-accent-strong": palette.accentStrong,
    "--muse-accent-soft": palette.accentSoft,
    "--muse-accent-muted": palette.accentMuted,
    "--muse-shimmer": palette.shimmer,
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
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "url('/textures/noise.png')",
            backgroundRepeat: "repeat",
          }}
        />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(circle at top right, var(--muse-accent-muted), transparent 55%), radial-gradient(circle at 12% 90%, rgba(15,23,42,0.7), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "linear-gradient(120deg, transparent 15%, rgba(148,163,184,0.08) 45%, transparent 70%)",
          }}
        />
      </div>
      <div className={`absolute inset-0 ${backgroundOverlayClass}`} />
      <span
        aria-hidden="true"
        className="muse-drift absolute -top-24 right-[-6rem] h-56 w-56 rounded-full blur-[2px]"
        style={{
          background:
            "radial-gradient(circle, var(--muse-accent-soft), transparent 70%)",
        }}
      />
      <span
        aria-hidden="true"
        className="muse-drift absolute -bottom-24 left-[-4rem] h-48 w-48 rounded-full blur-[3px]"
        style={{
          background: "radial-gradient(circle, rgba(15,23,42,0.8), transparent 70%)",
          animationDelay: "-3s",
        }}
      />
      <span
        aria-hidden="true"
        className="muse-drift absolute left-1/2 top-24 h-40 w-40 -translate-x-1/2 rounded-full blur-[1px]"
        style={{
          background:
            "radial-gradient(circle, var(--muse-accent-muted), transparent 70%)",
          animationDelay: "-6s",
        }}
      />

      {isPublished ? null : (
        <div className="absolute right-6 top-6 z-10 rounded-full bg-white/10 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-200">
          Recipient view
        </div>
      )}

      <div
        className={`relative mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 pb-20 pt-16 md:px-12 ${
          isPhone ? "h-full overflow-y-auto" : ""
        }`}
      >
        <header className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {showTagline ? (
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-200">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: "var(--muse-accent)" }}
                />
                {doc.tagline}
              </div>
            ) : null}
            <div>
              <h1 className={`preview-heading ${titleSizeClass} text-slate-100`}>
                {doc.title}
              </h1>
              {doc.showSubtitle === false ? null : (
                <p className="mt-4 max-w-2xl text-sm text-slate-200/90 md:text-base">
                  {doc.subtitle}
                </p>
              )}
            </div>
            {doc.music ? (
              <PreviewAudioControl title={doc.music.name} src={doc.music.url} />
            ) : null}
          </div>

          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_30px_80px_-60px_rgba(15,23,42,0.95)] md:p-8">
            <span
              aria-hidden="true"
              className="muse-sheen absolute -left-1/2 top-0 h-full w-1/2"
              style={{
                background:
                  "linear-gradient(110deg, transparent, var(--muse-shimmer), transparent)",
              }}
            />
            <span
              aria-hidden="true"
              className="muse-glint absolute right-8 top-8 h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--muse-accent)" }}
            />
            {doc.swoonLabel.trim().length > 0 ? (
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-300">
                {doc.swoonLabel}
              </p>
            ) : null}
            <button
              type="button"
              onClick={triggerYesAnimation}
              onAnimationEnd={() => setIsYesAnimating(false)}
              className={`mt-5 w-full rounded-[2rem] px-6 py-5 text-3xl font-semibold uppercase tracking-[0.2em] text-white shadow-[0_25px_60px_-40px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5 ${
                isYesAnimating ? "muse-pulse" : ""
              }`}
              style={{
                background:
                  "linear-gradient(135deg, var(--muse-accent-strong), var(--muse-accent))",
              }}
            >
              {doc.swoonHeadline.trim().length > 0 ? doc.swoonHeadline : "Yes"}
            </button>
            {doc.swoonBody.trim().length > 0 ? (
              <p className="mt-4 text-sm text-slate-200/90">
                {doc.swoonBody}
              </p>
            ) : null}
            {sparkleWords.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-100">
                {sparkleWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="rounded-full px-3 py-1"
                    style={{
                      backgroundColor: "var(--muse-accent-muted)",
                      color: "var(--muse-accent-strong)",
                    }}
                  >
                    {word}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </header>

        {orderedSections.map((section) => {
          if (section === "gallery") {
            return (
              <section key="gallery" className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="preview-heading text-2xl text-slate-100 md:text-3xl">
                    Night reel
                  </h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-300">
                    {isPhone ? "Swipe to drift" : "Scroll to drift"}
                  </span>
                </div>
                <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-2">
                  {photos.map((photo, index) => (
                    <div
                      key={`${photo.id}-${index}`}
                      className="muse-rise w-[70%] flex-shrink-0 snap-center sm:w-[45%] lg:w-[30%]"
                      style={{ animationDelay: `${index * 0.12}s` }}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-900/60 shadow-[0_30px_70px_-50px_rgba(15,23,42,0.9)]">
                        {photo.src ? (
                          <Image
                            src={photo.src}
                            alt={photo.alt ?? `Photo ${index + 1}`}
                            fill
                            sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 80vw"
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
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                        <div className="absolute left-4 top-4 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-200/70">
                          Scene {index + 1}
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
              <section key="love-note" className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-300">
                  Letters after midnight
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  {loveNotes.length > 0 ? (
                    loveNotes.map((note, index) => {
                      const title =
                        doc.loveNoteTitles?.[index]?.trim() ||
                        (index === 0 ? "Love note" : "Midnight echoes");
                      return (
                        <div
                          key={`love-note-${index}`}
                          className="muse-rise relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/60 p-8 shadow-[0_28px_70px_-55px_rgba(15,23,42,0.9)]"
                          style={{ animationDelay: `${index * 0.12}s` }}
                        >
                          <span
                            aria-hidden="true"
                            className="muse-sheen absolute -left-1/2 top-0 h-full w-1/2"
                            style={{
                              background:
                                "linear-gradient(110deg, transparent, var(--muse-shimmer), transparent)",
                            }}
                          />
                          <span
                            aria-hidden="true"
                            className="absolute -top-4 right-10 h-8 w-8 rounded-full"
                            style={{
                              background:
                                "radial-gradient(circle, var(--muse-accent), transparent 70%)",
                            }}
                          />
                          <h2 className="preview-heading text-2xl text-slate-100 md:text-3xl">
                            {title}
                          </h2>
                          <p className="mt-4 text-sm text-slate-200/90 md:text-base">
                            {note}
                          </p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/60 p-8 text-center text-sm text-slate-200/80">
                      Add a love note to share your favorite memories.
                    </div>
                  )}
                </div>
              </section>
            );
          }

          return (
            <section key="moments" className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="preview-heading text-2xl text-slate-100 md:text-3xl">
                  {doc.momentsTitle}
                </h2>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-300">
                  Why this is yes
                </span>
              </div>
              {moments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {moments.map((moment, index) => (
                    <div
                      key={`${moment}-${index}`}
                      className="muse-rise relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 px-5 py-4 text-sm text-slate-200/90 shadow-[0_26px_60px_-48px_rgba(15,23,42,0.9)]"
                      style={{ animationDelay: `${index * 0.12}s` }}
                    >
                      <span
                        aria-hidden="true"
                        className="muse-sheen absolute -left-1/2 top-0 h-full w-1/2"
                        style={{
                          background:
                            "linear-gradient(110deg, transparent, var(--muse-shimmer), transparent)",
                        }}
                      />
                      <span
                        aria-hidden="true"
                        className="muse-glint absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full"
                        style={{ backgroundColor: "var(--muse-accent)" }}
                      />
                      <p className="pl-4">{moment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-200/80">
                  Add your reasons in the builder.
                </p>
              )}
            </section>
          );
        })}

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="preview-heading text-2xl text-slate-100 md:text-3xl">
              Extra sparks
            </h2>
            <span className="text-xs uppercase tracking-[0.3em] text-slate-300">
              Little scenes
            </span>
          </div>
          {perkCards.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {perkCards.map((card, index) => (
                <div
                  key={`${card.title}-${index}`}
                  className="muse-rise relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-200/90 shadow-[0_24px_55px_-45px_rgba(15,23,42,0.9)]"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span
                    aria-hidden="true"
                    className="muse-glint absolute right-4 top-4 h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--muse-accent)" }}
                  />
                  {card.title.trim().length > 0 ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                      {card.title}
                    </p>
                  ) : null}
                  {card.body.trim().length > 0 ? (
                    <p className="mt-2 text-sm text-slate-200/90">
                      {card.body}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 text-sm text-slate-200/80">
              Add scene cards in the builder to build the montage.
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_28px_70px_-55px_rgba(15,23,42,0.9)]">
            <span
              aria-hidden="true"
              className="muse-sheen absolute -left-1/2 top-0 h-full w-1/2"
              style={{
                background:
                  "linear-gradient(110deg, transparent, var(--muse-shimmer), transparent)",
              }}
            />
            <span
              aria-hidden="true"
              className="absolute left-6 top-10 h-10 w-10 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--muse-accent-muted), transparent 70%)",
              }}
            />
            <h3 className="preview-heading text-2xl text-slate-100 md:text-3xl">
              {doc.datePlanTitle}
            </h3>
            {datePlanSteps.length > 0 ? (
              <div className="relative mt-6 space-y-4">
                <div
                  aria-hidden="true"
                  className="absolute left-4 top-2 h-[calc(100%-0.5rem)] w-px"
                  style={{
                    background:
                      "linear-gradient(180deg, var(--muse-accent), transparent)",
                  }}
                />
                {datePlanSteps.map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="muse-rise relative rounded-[1.75rem] border border-white/10 bg-slate-900/60 p-4 pl-10 text-sm text-slate-200/90"
                    style={{ animationDelay: `${index * 0.12}s` }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-2 top-5 flex h-6 w-6 items-center justify-center rounded-full text-[0.65rem] font-semibold text-slate-900"
                      style={{ backgroundColor: "var(--muse-accent)" }}
                    >
                      {index + 1}
                    </span>
                    {step.title.trim().length > 0 ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                        {step.title}
                      </p>
                    ) : null}
                    {step.body.trim().length > 0 ? (
                      <p className="mt-2 text-sm text-slate-200/90">
                        {step.body}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-200/80">
                Add your next scene in the builder.
              </p>
            )}
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/60 p-6 shadow-[0_28px_70px_-55px_rgba(15,23,42,0.9)]">
            <span
              aria-hidden="true"
              className="muse-sheen absolute -left-1/2 top-0 h-full w-1/2"
              style={{
                background:
                  "linear-gradient(110deg, transparent, var(--muse-shimmer), transparent)",
              }}
            />
            <span
              aria-hidden="true"
              className="muse-glint absolute right-6 top-6 h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--muse-accent)" }}
            />
            <h3 className="preview-heading text-2xl text-slate-100 md:text-3xl">
              {doc.promiseTitle}
            </h3>
            {promiseItems.length > 0 ? (
              <ul className="mt-5 space-y-3 text-sm text-slate-200/90">
                {promiseItems.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="muse-rise rounded-[1.5rem] border border-white/10 bg-slate-900/60 px-4 py-3"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-200/80">
                Add promise lines in the builder.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
