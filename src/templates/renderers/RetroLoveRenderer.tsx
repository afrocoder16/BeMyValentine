"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Bebas_Neue, IBM_Plex_Mono, Inter } from "next/font/google";
import {
  type CSSProperties,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import type { TemplateRendererProps } from "@/lib/builder/types";
import { resolvePhotoFilterStyle } from "@/templates/renderers/utils";

const displayFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-retro-display",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-retro-mono",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-retro-body",
});

const theme = {
  "--retro-bg": "#0B0014",
  "--retro-ink": "#F6F0FF",
  "--retro-pink": "#FF3BD4",
  "--retro-cyan": "#2DFFF3",
  "--retro-yellow": "#FFE94A",
  "--retro-red": "#FF2E2E",
  "--retro-tape": "#B8B2C3",
  "--retro-shadow": "rgba(0,0,0,0.55)",
  "--retro-panel": "rgba(18, 8, 28, 0.92)",
} as CSSProperties;

const defaultSectionOrder = ["gallery", "love-note", "moments"] as const;

const formatTime = (value: number) => {
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
};

export default function RetroLoveRenderer({
  doc,
  mode,
  context = "builder",
}: TemplateRendererProps) {
  const prefersReducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const galleryRef = useRef<HTMLElement | null>(null);
  const loveNoteRef = useRef<HTMLElement | null>(null);
  const momentsRef = useRef<HTMLElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const isPhone = mode === "phone";
  const isPublished = context === "published";
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
  const containerShadow = isPhone || !isPublished ? "shadow-soft" : "shadow-none";

  const showSubtitle = doc.showSubtitle !== false;
  const heroTitle = doc.title.trim() || "Retro Love";
  const heroSubtitle = doc.subtitle.trim();
  const tagline = doc.tagline.trim() || "SIDE A";
  const heroTitleSizeClass =
    doc.titleSize === "small"
      ? "text-4xl sm:text-6xl lg:text-7xl"
      : doc.titleSize === "big"
        ? "text-6xl sm:text-8xl lg:text-[8rem]"
        : "text-5xl sm:text-7xl lg:text-8xl";

  const promiseTitle = doc.promiseTitle.trim() || "Neon chorus";
  const promiseItems = doc.promiseItems
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  const chorusItems =
    promiseItems.length > 0
      ? promiseItems
      : doc.moments.filter((moment) => moment.trim().length > 0);

  const notesSource =
    doc.loveNotes && doc.loveNotes.length > 0 ? doc.loveNotes : [doc.loveNote];
  const loveNotes = notesSource
    .map((note) => note.trim())
    .filter((note) => note.length > 0);
  const loveNoteTitles = loveNotes.map(
    (_, index) =>
      doc.loveNoteTitles?.[index]?.trim() ||
      (index === 0 ? "Love note" : "Extra love")
  );

  const moments = doc.moments.filter((moment) => moment.trim().length > 0);
  const momentsTitle = doc.momentsTitle.trim() || "Replay list";

  const photos = doc.photos.length
    ? [...doc.photos].sort((a, b) => a.order - b.order)
    : Array.from({ length: 5 }, (_, index) => ({
        id: `placeholder-${index + 1}`,
        src: "",
        alt: undefined,
        caption: "",
        order: index,
      }));
  const photoFilterStyle = resolvePhotoFilterStyle(doc.photoMood);
  const sectionOrder = doc.sectionOrder ?? [...defaultSectionOrder];
  const firstSection = sectionOrder[0] ?? "gallery";

  const audioTitle = doc.music?.name?.trim() || "Retro Love";
  const audioSrc = doc.music?.url || "";
  const canPlay = Boolean(audioSrc);
  const progressPercent =
    duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;

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
    setProgress(0);
    setDuration(0);
    const audio = audioRef.current;
    if (!audio || !audioSrc) {
      setIsPlaying(false);
      return;
    }
    audio.pause();
    audio.currentTime = 0;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [audioSrc]);

  const handleTogglePlay = async () => {
    const audio = audioRef.current;
    if (!audio || !canPlay) {
      return;
    }
    if (!audio.paused) {
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

  const handleJumpToMemories = () => {
    const target =
      firstSection === "love-note"
        ? loveNoteRef.current
        : firstSection === "moments"
          ? momentsRef.current
          : galleryRef.current;
    if (!target) {
      return;
    }
    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const revealProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 0.6, ease: "easeOut" },
      };

  const renderGallery = () => (
    <motion.section
      id="gallery"
      ref={galleryRef}
      className="relative px-6 py-16"
      {...revealProps}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="retro-label">Photo booth</span>
          <h2 className="retro-heading text-3xl sm:text-4xl">
            Snapshots on repeat
          </h2>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 pt-2 [scrollbar-width:none] sm:pb-8">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative w-[70vw] max-w-[320px] shrink-0 snap-center sm:w-[40vw] lg:w-[28vw]"
            >
              <div className="retro-film-frame relative overflow-hidden">
                {photo.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo.src}
                    alt={photo.alt ?? `Memory ${index + 1}`}
                    className="h-full w-full object-cover"
                    style={photoFilterStyle}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,59,212,0.4),_transparent_60%)] text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--retro-ink)]/70">
                    Frame {index + 1}
                  </div>
                )}
                <div className="absolute left-4 top-4 rounded-full border border-[color:var(--retro-ink)]/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--retro-ink)]">
                  Shot {String(index + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[color:var(--retro-ink)]/40 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[color:var(--retro-cyan)]">
                {photo.alt ?? `Memory ${index + 1}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );

  const renderLoveNotes = () => (
    <motion.section
      id="love-note"
      ref={loveNoteRef}
      className="relative px-6 py-16"
      {...revealProps}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="retro-label">Voice notes</span>
          <h2 className="retro-heading text-3xl sm:text-4xl">
            Messages saved for you
          </h2>
        </div>
        <div className="space-y-4">
          {(loveNotes.length > 0 ? loveNotes : ["Write your love note here."]).map(
            (note, index) => (
              <div
                key={`retro-note-${index}`}
                className="retro-ticket flex flex-col gap-3 px-6 py-5 sm:flex-row sm:items-start sm:justify-between"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--retro-yellow)]">
                    {loveNoteTitles[index] ?? "Love note"}
                  </p>
                  <p className="mt-3 text-sm text-[color:var(--retro-ink)]">
                    {note}
                  </p>
                </div>
                <div className="retro-stamp text-[10px] uppercase tracking-[0.4em] text-[color:var(--retro-pink)]">
                  Saved
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </motion.section>
  );

  const renderMoments = () => (
    <motion.section
      id="moments"
      ref={momentsRef}
      className="relative px-6 py-16"
      {...revealProps}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <div className="flex flex-wrap items-center gap-4">
          <span className="retro-label">High score</span>
          <h2 className="retro-heading text-3xl sm:text-4xl">
            {momentsTitle}
          </h2>
        </div>
        <div className="space-y-5">
          {(moments.length > 0 ? moments : ["Write your favorite moment."]).map(
            (moment, index) => (
              <div
                key={`retro-moment-${index}`}
                className="flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <span className="text-3xl font-semibold text-[color:var(--retro-cyan)]/90">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--retro-ink)]">
                      {moment}
                    </p>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[color:var(--retro-pink)]">
                      Lv {index + 1}
                    </span>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[color:var(--retro-ink)]/20">
                    <div
                      className="h-full rounded-full bg-[color:var(--retro-pink)]"
                      style={{
                        width: `${((index + 2) / (moments.length + 2)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </motion.section>
  );

  const sectionRenderers: Record<string, () => ReactElement> = {
    gallery: renderGallery,
    "love-note": renderLoveNotes,
    moments: renderMoments,
  };

  return (
    <div
      className={`${displayFont.variable} ${monoFont.variable} ${bodyFont.variable} relative w-full overflow-hidden ${containerRadius} ${containerHeight} ${containerShadow} bg-[color:var(--retro-bg)] text-[color:var(--retro-ink)]`}
      style={theme}
    >
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 retro-bloom" />
        <div className="absolute inset-0 retro-grid" />
        <div className="absolute inset-0 retro-noise" />
        <div className="absolute inset-0 retro-scanlines" />
        <div className="absolute inset-0 retro-vignette" />
      </div>

      <div className="relative z-10">
        <section className="relative overflow-hidden px-6 pb-16 pt-20">
          <div className="absolute inset-0 retro-hero-glow" />
          <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--retro-cyan)]">
                <span className="rounded-full border border-[color:var(--retro-ink)]/40 px-4 py-1 font-[var(--font-retro-mono)] text-[color:var(--retro-ink)]">
                  {tagline}
                </span>
                <span className="rounded-full border border-[color:var(--retro-ink)]/40 px-4 py-1 font-[var(--font-retro-mono)] text-[color:var(--retro-ink)]">
                  Side A
                </span>
              </div>
              <motion.h1
                className={`retro-heading ${heroTitleSizeClass}`}
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        textShadow: [
                          "0 0 14px rgba(255,59,212,0.6)",
                          "0 0 22px rgba(45,255,243,0.6)",
                          "0 0 14px rgba(255,233,74,0.6)",
                        ],
                      }
                }
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                {heroTitle}
              </motion.h1>
              {showSubtitle && heroSubtitle ? (
                <p className="max-w-xl text-sm text-[color:var(--retro-ink)]/80 sm:text-base">
                  {heroSubtitle}
                </p>
              ) : null}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  disabled={!canPlay}
                  className="retro-button"
                  aria-pressed={isPlaying}
                  aria-label={isPlaying ? "Pause tape" : "Play tape"}
                >
                  {isPlaying ? "Pause tape" : "Play tape"}
                </button>
                <button
                  type="button"
                  onClick={handleJumpToMemories}
                  className="retro-button ghost"
                >
                  Jump to memories
                </button>
              </div>
              <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.5em] text-[color:var(--retro-yellow)]">
                Insert heart to continue
              </div>
            </div>

            <div className="retro-console relative">
              <div className="absolute inset-0 retro-console-glow" />
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--retro-ink)]/80">
                  <span>Mixtape deck</span>
                  <span className="text-[color:var(--retro-cyan)]">
                    {audioTitle}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-6">
                  {[0, 1].map((index) => (
                    <motion.div
                      key={`reel-${index}`}
                      className="retro-reel"
                      animate={
                        prefersReducedMotion || !isPlaying
                          ? { rotate: 0 }
                          : { rotate: 360 }
                      }
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <div className="retro-reel-core" />
                    </motion.div>
                  ))}
                </div>
                <div className="rounded-full border border-[color:var(--retro-ink)]/50 bg-[color:var(--retro-bg)]/60 px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-[color:var(--retro-ink)]">
                  {canPlay ? "Now playing" : "Upload a track"}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    disabled={!canPlay}
                    className="retro-button small"
                    aria-pressed={isPlaying}
                    aria-label={isPlaying ? "Stop tape" : "Start tape"}
                  >
                    {isPlaying ? "Stop" : "Start"}
                  </button>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[color:var(--retro-ink)]/20">
                      <div
                        className="h-full rounded-full bg-[color:var(--retro-cyan)]"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.35em] text-[color:var(--retro-ink)]/70">
                      <span>{formatTime(progress)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>
              {audioSrc ? <audio ref={audioRef} src={audioSrc} /> : null}
            </div>
          </div>
        </section>

        <motion.section
          className="relative px-6 py-14"
          {...revealProps}
        >
          <div className="mx-auto w-full max-w-5xl">
            <div className="flex flex-wrap items-center gap-4">
              <span className="retro-label">Chorus</span>
              <h2 className="retro-heading text-3xl sm:text-4xl">
                {promiseTitle}
              </h2>
            </div>
            <div className="mt-8 space-y-4">
              {(chorusItems.length > 0 ? chorusItems : ["Write a line here."]).map(
                (line, index) => (
                  <motion.div
                    key={`chorus-${index}`}
                    className={`retro-banner ${index % 2 === 0 ? "" : "alt"}`}
                    {...(prefersReducedMotion
                      ? {}
                      : {
                          initial: { opacity: 0, x: index % 2 === 0 ? -20 : 20 },
                          whileInView: { opacity: 1, x: 0 },
                          viewport: { once: true, amount: 0.3 },
                          transition: { duration: 0.5, ease: "easeOut" },
                        })}
                  >
                    <span className="retro-banner-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="retro-banner-text">{line}</span>
                  </motion.div>
                )
              )}
            </div>
          </div>
        </motion.section>

        {sectionOrder.map((sectionKey) => {
          const renderer = sectionRenderers[sectionKey];
          return renderer ? renderer() : null;
        })}

        <footer className="relative px-6 pb-16 pt-10">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
            <div className="retro-label">End of tape</div>
            <p className="text-sm uppercase tracking-[0.35em] text-[color:var(--retro-ink)]/70">
              Made with love and neon
            </p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .retro-heading {
          font-family: var(--font-retro-display);
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .retro-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border: 1px solid rgba(246, 240, 255, 0.35);
          padding: 0.35rem 0.9rem;
          border-radius: 999px;
          font-size: 0.6rem;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          font-family: var(--font-retro-mono);
          color: var(--retro-cyan);
        }

        .retro-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.8rem;
          border-radius: 999px;
          border: 2px solid rgba(246, 240, 255, 0.6);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.3em;
          font-size: 0.65rem;
          color: var(--retro-ink);
          background: rgba(255, 46, 46, 0.9);
          box-shadow: 0 0 24px rgba(255, 46, 46, 0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .retro-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 32px rgba(255, 46, 46, 0.45);
        }

        .retro-button:focus-visible {
          outline: 2px solid var(--retro-cyan);
          outline-offset: 3px;
        }

        .retro-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
          box-shadow: none;
        }

        .retro-button.small {
          padding: 0.55rem 1.2rem;
          font-size: 0.55rem;
        }

        .retro-button.ghost {
          background: transparent;
          color: var(--retro-cyan);
          border-color: rgba(45, 255, 243, 0.6);
          box-shadow: none;
        }

        .retro-console {
          position: relative;
          border-radius: 2.5rem;
          border: 2px solid rgba(246, 240, 255, 0.4);
          padding: 1.75rem;
          background: var(--retro-panel);
          box-shadow: 0 30px 80px -50px rgba(0, 0, 0, 0.85);
          overflow: hidden;
        }

        .retro-console-glow {
          background: linear-gradient(
            120deg,
            rgba(255, 59, 212, 0.2),
            transparent 45%,
            rgba(45, 255, 243, 0.18)
          );
          opacity: 0.8;
        }

        .retro-reel {
          height: 90px;
          width: 90px;
          border-radius: 50%;
          border: 2px solid rgba(246, 240, 255, 0.7);
          background: rgba(11, 0, 20, 0.6);
          display: grid;
          place-items: center;
          position: relative;
          box-shadow: inset 0 0 20px rgba(45, 255, 243, 0.2);
        }

        .retro-reel-core {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          border: 2px solid rgba(246, 240, 255, 0.7);
          background: rgba(255, 59, 212, 0.6);
          box-shadow: 0 0 16px rgba(255, 59, 212, 0.5);
        }

        .retro-banner {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1rem 1.5rem;
          border-radius: 1.5rem;
          border: 2px solid rgba(246, 240, 255, 0.5);
          background: rgba(11, 0, 20, 0.65);
          backdrop-filter: blur(8px);
        }

        .retro-banner.alt {
          margin-left: auto;
          background: rgba(45, 255, 243, 0.12);
        }

        .retro-banner-index {
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.3em;
          color: var(--retro-yellow);
        }

        .retro-banner-text {
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.25em;
          font-size: 0.85rem;
          color: var(--retro-ink);
        }

        .retro-ticket {
          border-radius: 1.6rem;
          border: 2px dashed rgba(246, 240, 255, 0.35);
          background: rgba(18, 8, 28, 0.8);
          box-shadow: inset 0 0 0 1px rgba(246, 240, 255, 0.1);
        }

        .retro-stamp {
          border: 1px solid rgba(255, 59, 212, 0.6);
          padding: 0.35rem 0.8rem;
          border-radius: 999px;
          align-self: flex-start;
        }

        .retro-film-frame {
          border-radius: 1.8rem;
          border: 2px solid rgba(246, 240, 255, 0.5);
          background: rgba(18, 8, 28, 0.75);
          aspect-ratio: 3 / 4;
          box-shadow: 0 25px 45px -35px rgba(0, 0, 0, 0.8);
        }

        .retro-bloom {
          background: radial-gradient(
              circle at top,
              rgba(255, 59, 212, 0.18),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom right,
              rgba(45, 255, 243, 0.18),
              transparent 60%
            );
        }

        .retro-grid {
          background-image: linear-gradient(
              rgba(255, 255, 255, 0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 60px 60px;
          opacity: 0.25;
        }

        .retro-noise {
          background-image: radial-gradient(
              rgba(255, 255, 255, 0.08) 1px,
              transparent 1px
            ),
            radial-gradient(
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 3px 3px, 4px 4px;
          mix-blend-mode: screen;
          opacity: 0.25;
        }

        .retro-scanlines {
          background-image: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.05),
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px,
            transparent 3px
          );
          opacity: 0.2;
        }

        .retro-vignette {
          box-shadow: inset 0 0 160px rgba(0, 0, 0, 0.75);
        }

        .retro-hero-glow {
          background: radial-gradient(
            circle at top left,
            rgba(255, 59, 212, 0.28),
            transparent 55%
          );
          opacity: 0.8;
        }

        @media (prefers-reduced-motion: reduce) {
          .retro-button,
          .retro-banner {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
