"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { TemplateRendererProps } from "@/lib/builder/types";
import {
  resolveBackgroundOverlayClass,
  resolveFontClass,
  resolvePhotoFilterStyle,
  resolveTitleSizeClass,
} from "@/templates/renderers/utils";

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

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) {
    return "00:00";
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export default function MidnightMuseRenderer({
  doc,
  theme,
  mode,
  context = "builder",
}: TemplateRendererProps) {
  const prefersReducedMotion = useReducedMotion();
  const reelRef = useRef<HTMLDivElement | null>(null);
  const frameRefs = useRef<Array<HTMLDivElement | null>>([]);
  const reelSectionRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isAnswerFlipped, setIsAnswerFlipped] = useState(false);
  const [reelIndex, setReelIndex] = useState(0);
  const [reelProgress, setReelProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const photos = doc.photos.length
    ? [...doc.photos].sort((a, b) => a.order - b.order)
    : Array.from({ length: 4 }, (_, index) => ({
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
  const loveNoteTitles = loveNotes.map(
    (_, index) =>
      doc.loveNoteTitles?.[index]?.trim() ||
      (index === 0 ? "Love note" : "Midnight echo")
  );
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
  const paletteStyle = {
    "--muse-accent": palette.accent,
    "--muse-accent-strong": palette.accentStrong,
    "--muse-accent-soft": palette.accentSoft,
    "--muse-accent-muted": palette.accentMuted,
    "--muse-shimmer": palette.shimmer,
    "--muse-ink": "#e2e8f0",
    "--muse-bg": "#0b0a14",
  } as CSSProperties;

  const showTagline = doc.tagline.trim().length > 0;
  const showSubtitle = doc.showSubtitle !== false && doc.subtitle.trim().length > 0;
  const reelLabel = "Night reel";
  const reelCaption =
    perkCards[reelIndex]?.title ||
    perkCards[reelIndex]?.body ||
    photos[reelIndex]?.alt ||
    `Scene ${reelIndex + 1}`;
  const reelMaxIndex = Math.max(photos.length - 1, 0);
  const audioSrc = doc.music?.url ?? "";
  const audioTitle = doc.music?.name ?? "Midnight Muse";

  const revealProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.6, ease: "easeOut" },
      };

  const scrollToReel = () => {
    if (!reelSectionRef.current) {
      return;
    }
    reelSectionRef.current.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const scrollToFrame = (index: number) => {
    const node = frameRefs.current[index];
    if (!node) {
      return;
    }
    node.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  const handleReelScrub = (value: number) => {
    if (photos.length <= 1) {
      return;
    }
    const nextIndex = Math.min(
      reelMaxIndex,
      Math.max(0, Math.round((value / 100) * reelMaxIndex))
    );
    setReelIndex(nextIndex);
    scrollToFrame(nextIndex);
  };

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) {
      return;
    }
    let raf = 0;
    const handleScroll = () => {
      if (raf) {
        cancelAnimationFrame(raf);
      }
      raf = requestAnimationFrame(() => {
        const maxScroll = reel.scrollWidth - reel.clientWidth;
        const nextProgress = maxScroll > 0 ? reel.scrollLeft / maxScroll : 0;
        setReelProgress(nextProgress);
        if (reelMaxIndex > 0) {
          setReelIndex(Math.round(nextProgress * reelMaxIndex));
        }
      });
    };
    reel.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      reel.removeEventListener("scroll", handleScroll);
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [reelMaxIndex]);

  useEffect(() => {
    setProgress(0);
    setDuration(0);
    if (!audioSrc) {
      setIsPlaying(false);
      return;
    }
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
    }
    setIsPlaying(true);
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const handleTime = () => setProgress(audio.currentTime || 0);
    const handleMeta = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("loadedmetadata", handleMeta);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("loadedmetadata", handleMeta);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  return (
    <div
      className={`preview-body ${fontStyleClass} relative w-full overflow-hidden ${containerRadius} ${containerHeight} bg-[color:var(--muse-bg)] ${containerShadow}`}
      style={{ fontFamily: "var(--preview-body)", ...paletteStyle }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 muse-haze" />
        <div className="absolute inset-0 muse-bokeh" />
        <div className="absolute inset-0 muse-grain" />
        <div className="absolute inset-0 muse-vignette" />
      </div>
      <div className={`absolute inset-0 ${backgroundOverlayClass}`} />

      {prefersReducedMotion ? null : (
        <>
          <motion.span
            aria-hidden="true"
            className="muse-drift absolute -top-24 left-[10%] h-56 w-56 rounded-full blur-[2px]"
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle, var(--muse-accent-soft), transparent 70%)",
            }}
          />
          <motion.span
            aria-hidden="true"
            className="muse-drift absolute top-1/2 right-[12%] h-64 w-64 rounded-full blur-[3px]"
            animate={{ y: [0, -28, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle, rgba(14,23,42,0.8), transparent 70%)",
            }}
          />
        </>
      )}

      {isPublished ? null : (
        <div className="absolute right-6 top-6 z-10 rounded-full border border-white/10 bg-slate-950/60 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-200">
          Recipient view
        </div>
      )}

      <div
        className={`relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 pb-24 pt-16 md:px-12 ${
          isPhone ? "h-full overflow-y-auto" : ""
        }`}
      >
        <header className="relative space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-slate-300">
            <span className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-slate-200">
              Opening credits
            </span>
            {showTagline ? (
              <span className="rounded-full border border-white/10 bg-slate-950/60 px-4 py-2 text-slate-200">
                {doc.tagline}
              </span>
            ) : null}
          </div>
          <h1
            className={`preview-heading muse-title ${titleSizeClass} text-[color:var(--muse-ink)]`}
          >
            {doc.title}
          </h1>
          {showSubtitle ? (
            <p className="max-w-2xl text-sm text-slate-200/90 md:text-base">
              {doc.subtitle}
            </p>
          ) : null}
          {sparkleWords.length > 0 ? (
            <div className="flex flex-wrap gap-3 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-slate-100">
              {sparkleWords.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className="rounded-full border border-white/10 px-3 py-1"
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
          {doc.music ? (
            <div className="flex flex-wrap items-center gap-4 rounded-full border border-white/10 bg-slate-950/60 px-5 py-3 text-slate-100 shadow-[0_20px_60px_-45px_rgba(15,23,42,0.9)]">
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                aria-pressed={isPlaying}
                aria-label={isPlaying ? "Pause audio" : "Play audio"}
                className="rounded-full px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-white shadow-[0_16px_40px_-28px_rgba(15,23,42,0.9)] transition hover:-translate-y-0.5"
                style={{
                  background:
                    "linear-gradient(135deg, var(--muse-accent-strong), var(--muse-accent))",
                }}
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <div className="flex-1 text-xs text-slate-200">
                <span aria-hidden="true">&#9835;</span> {audioTitle}
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${duration ? (progress / duration) * 100 : 0}%`,
                      background:
                        "linear-gradient(90deg, var(--muse-accent), transparent)",
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[0.6rem] uppercase tracking-[0.25em] text-slate-400">
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              <audio ref={audioRef} src={audioSrc} preload="metadata" />
            </div>
          ) : null}
        </header>

        <motion.section
          className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
          {...revealProps}
        >
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-300">
              The answer
            </p>
            <h2 className="preview-heading muse-title text-3xl text-slate-100 md:text-4xl">
              {doc.swoonLabel || "THE ANSWER"}
            </h2>
            {doc.swoonBody.trim().length > 0 ? (
              <p className="text-sm text-slate-200/90 md:text-base">
                {doc.swoonBody}
              </p>
            ) : null}
          </div>

          <div className="muse-card-wrap">
            <button
              type="button"
              aria-pressed={isAnswerFlipped}
              aria-label="Flip the answer card"
              className={`muse-card ${isAnswerFlipped ? "is-flipped" : ""}`}
              onClick={() => setIsAnswerFlipped((prev) => !prev)}
            >
              <div className="muse-card-face muse-card-front">
                <span className="muse-card-label">THE ANSWER</span>
                <span className="muse-card-title">
                  {doc.swoonHeadline.trim().length > 0 ? doc.swoonHeadline : "Yes"}
                </span>
                <span className="muse-card-hint">Tap to reveal</span>
              </div>
              <div className="muse-card-face muse-card-back">
                <p className="text-sm text-slate-100">
                  {doc.swoonBody.trim().length > 0
                    ? doc.swoonBody
                    : "Every scene is better with you."}
                </p>
                <button
                  type="button"
                  className="muse-card-cta"
                  onClick={(event) => {
                    event.stopPropagation();
                    scrollToReel();
                  }}
                >
                  Press to reveal the next scene
                </button>
              </div>
            </button>
          </div>
        </motion.section>

        {orderedSections.map((section) => {
          if (section === "gallery") {
            return (
              <motion.section
                key="gallery"
                ref={reelSectionRef}
                className="space-y-6"
                {...revealProps}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="preview-heading muse-title text-2xl text-slate-100 md:text-3xl">
                    {reelLabel}
                  </h2>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Scrub the film
                  </span>
                </div>

                <div className="relative rounded-[2rem] border border-white/10 bg-slate-950/60 px-4 py-6">
                  <span aria-hidden="true" className="muse-sprocket top-3" />
                  <span aria-hidden="true" className="muse-sprocket bottom-3" />
                  <div
                    ref={reelRef}
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        scrollToFrame(Math.max(reelIndex - 1, 0));
                      }
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        scrollToFrame(Math.min(reelIndex + 1, reelMaxIndex));
                      }
                    }}
                    className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-6 pt-4 outline-none"
                    aria-label="Night reel filmstrip"
                  >
                    {photos.map((photo, index) => (
                      <div
                        key={`${photo.id}-${index}`}
                        ref={(node) => {
                          frameRefs.current[index] = node;
                        }}
                        className={`muse-film-frame snap-center ${
                          index === reelIndex ? "is-active" : ""
                        }`}
                      >
                        <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
                          {photo.src ? (
                            <Image
                              src={photo.src}
                              alt={photo.alt ?? `Scene ${index + 1}`}
                              fill
                              sizes="(min-width: 1024px) 360px, (min-width: 640px) 60vw, 80vw"
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
                          <span className="absolute left-4 top-4 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-200/70">
                            Scene {index + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.3em] text-slate-300">
                    <span>{reelCaption}</span>
                    <span>{String(reelIndex + 1).padStart(2, "0")}</span>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={Math.round(reelProgress * 100)}
                      onChange={(event) =>
                        handleReelScrub(Number(event.target.value))
                      }
                      aria-label="Scrub the night reel"
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[color:var(--muse-accent)]"
                    />
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
                      {String(reelIndex + 1).padStart(2, "0")}/
                      {String(photos.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </motion.section>
            );
          }

          if (section === "love-note") {
            return (
              <motion.section key="love-note" className="space-y-6" {...revealProps}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-300">
                    Letters after midnight
                  </span>
                </div>
                <div className="space-y-4">
                  {loveNotes.length > 0 ? (
                    loveNotes.map((note, index) => (
                      <div
                        key={`love-note-${index}`}
                        className="muse-note"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <h3 className="preview-heading text-2xl text-slate-100 md:text-3xl">
                            {loveNoteTitles[index]}
                          </h3>
                          <span className="muse-timecode">
                            00:{String(10 + index * 3).padStart(2, "0")}
                          </span>
                        </div>
                        <p className="mt-4 text-sm text-slate-200/90 md:text-base">
                          {note}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-200/80">
                      Add a love note to share your favorite memories.
                    </p>
                  )}
                </div>
              </motion.section>
            );
          }

          return (
            <motion.section key="moments" className="space-y-6" {...revealProps}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="preview-heading muse-title text-2xl text-slate-100 md:text-3xl">
                  {doc.momentsTitle}
                </h2>
                <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Why this is yes
                </span>
              </div>
              {moments.length > 0 ? (
                <div className="space-y-4">
                  {moments.map((moment, index) => (
                    <div
                      key={`${moment}-${index}`}
                      className="muse-moment"
                    >
                      <span className="muse-timecode">
                        00:{String(20 + index * 2).padStart(2, "0")}
                      </span>
                      <p className="text-sm text-slate-200/90 md:text-base">
                        {moment}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-200/80">
                  Add your reasons in the builder.
                </p>
              )}
            </motion.section>
          );
        })}

        <motion.section
          className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]"
          {...revealProps}
        >
          <div className="space-y-6">
            <h2 className="preview-heading muse-title text-2xl text-slate-100 md:text-3xl">
              {doc.datePlanTitle}
            </h2>
            {datePlanSteps.length > 0 ? (
              <div className="space-y-4">
                {datePlanSteps.map((step, index) => (
                  <div
                    key={`${step.title}-${index}`}
                    className="muse-plan"
                  >
                    <span className="muse-plan-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      {step.title.trim().length > 0 ? (
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                          {step.title}
                        </p>
                      ) : null}
                      {step.body.trim().length > 0 ? (
                        <p className="mt-2 text-sm text-slate-200/90 md:text-base">
                          {step.body}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-200/80">
                Add your next scene in the builder.
              </p>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="preview-heading muse-title text-2xl text-slate-100 md:text-3xl">
              {doc.promiseTitle}
            </h2>
            {promiseItems.length > 0 ? (
              <ul className="space-y-3 text-sm text-slate-200/90 md:text-base">
                {promiseItems.map((item, index) => (
                  <li key={`${item}-${index}`} className="muse-promise">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-200/80">
                Add promise lines in the builder.
              </p>
            )}
          </div>
        </motion.section>

        {perkCards.length > 0 ? (
          <motion.section className="space-y-6" {...revealProps}>
            <h2 className="preview-heading muse-title text-2xl text-slate-100 md:text-3xl">
              Extra sparks
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {perkCards.map((card, index) => (
                <div key={`${card.title}-${index}`} className="muse-cameo">
                  {card.title.trim().length > 0 ? (
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                      {card.title}
                    </p>
                  ) : null}
                  {card.body.trim().length > 0 ? (
                    <p className="mt-2 text-sm text-slate-200/90 md:text-base">
                      {card.body}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </motion.section>
        ) : null}
      </div>

      <style jsx global>{`
        .muse-title {
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-shadow: 0 0 20px rgba(148, 163, 184, 0.2);
        }

        .muse-haze {
          background: radial-gradient(
              circle at top,
              rgba(15, 23, 42, 0.85),
              transparent 60%
            ),
            radial-gradient(
              circle at 20% 80%,
              var(--muse-accent-muted),
              transparent 60%
            ),
            radial-gradient(
              circle at 80% 40%,
              rgba(148, 163, 184, 0.15),
              transparent 60%
            );
        }

        .muse-bokeh {
          background-image: radial-gradient(
              rgba(148, 163, 184, 0.12) 1px,
              transparent 1px
            ),
            radial-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px);
          background-size: 140px 140px, 200px 200px;
          opacity: 0.25;
        }

        .muse-grain {
          background-image: linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.04) 50%,
              transparent 50%,
              transparent 100%
            ),
            radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, transparent 70%);
          background-size: 4px 4px, 120px 120px;
          opacity: 0.25;
          mix-blend-mode: screen;
        }

        .muse-vignette {
          box-shadow: inset 0 0 140px rgba(0, 0, 0, 0.8);
        }

        .muse-card-wrap {
          perspective: 1200px;
        }

        .muse-card {
          position: relative;
          width: 100%;
          min-height: 260px;
          border-radius: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(15, 23, 42, 0.75);
          transform-style: preserve-3d;
          transition: transform 0.6s ease;
          box-shadow: 0 30px 70px -50px rgba(15, 23, 42, 0.9);
        }

        .muse-card.is-flipped {
          transform: rotateY(180deg);
        }

        .muse-card-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 1rem;
        }

        .muse-card-front {
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.9),
            rgba(30, 41, 59, 0.7)
          );
        }

        .muse-card-back {
          transform: rotateY(180deg);
          background: linear-gradient(
            135deg,
            rgba(30, 41, 59, 0.9),
            rgba(15, 23, 42, 0.8)
          );
        }

        .muse-card-label {
          font-size: 0.65rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--muse-accent);
        }

        .muse-card-title {
          font-size: 2.5rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #fff;
        }

        .muse-card-hint {
          font-size: 0.6rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.7);
        }

        .muse-card-cta {
          margin-top: 1rem;
          padding: 0.6rem 1.2rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #fff;
          background: rgba(15, 23, 42, 0.7);
        }

        .muse-card-cta:focus-visible {
          outline: 2px solid var(--muse-accent);
          outline-offset: 2px;
        }

        .muse-film-frame {
          position: relative;
          min-width: 70%;
          height: 260px;
          border-radius: 1.75rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.6);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .muse-film-frame.is-active {
          transform: translateY(-6px);
          box-shadow: 0 30px 60px -40px rgba(15, 23, 42, 0.85);
        }

        @media (min-width: 640px) {
          .muse-film-frame {
            min-width: 55%;
            height: 300px;
          }
        }

        @media (min-width: 1024px) {
          .muse-film-frame {
            min-width: 35%;
            height: 320px;
          }
        }

        .muse-sprocket {
          position: absolute;
          left: 0;
          right: 0;
          height: 8px;
          background-image: radial-gradient(
            circle,
            rgba(226, 232, 240, 0.25) 2px,
            transparent 2px
          );
          background-size: 18px 8px;
          opacity: 0.4;
          pointer-events: none;
        }

        .muse-timecode {
          font-size: 0.6rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(226, 232, 240, 0.7);
        }

        .muse-note {
          border-radius: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(15, 23, 42, 0.75);
          padding: 2rem;
          box-shadow: 0 30px 70px -50px rgba(15, 23, 42, 0.9);
        }

        .muse-moment {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          border-left: 2px solid rgba(148, 163, 184, 0.3);
          padding-left: 1.5rem;
        }

        .muse-plan {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 1rem;
          align-items: flex-start;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(148, 163, 184, 0.15);
        }

        .muse-plan-index {
          height: 32px;
          width: 32px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          font-size: 0.65rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          color: #0f172a;
          background: var(--muse-accent);
        }

        .muse-promise {
          padding: 0.75rem 1rem;
          border-radius: 1.25rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.6);
        }

        .muse-cameo {
          padding: 1.5rem;
          border-radius: 1.75rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(15, 23, 42, 0.65);
          box-shadow: 0 25px 50px -40px rgba(15, 23, 42, 0.85);
        }
      `}</style>
    </div>
  );
}
