
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { type CSSProperties, useEffect, useMemo, useRef, useState } from "react";

const content = {
  headline: "Will u be my Valentine?",
  subheadline:
    "For the moments that bloom softly and stay with us, this is for you.",
  tags: ["petals", "evergreen", "sweetheart", "in bloom"],
  rsvp: {
    title: "Garden RSVP",
    subtitle: "Say yes and unlock a secret tucked in the roses.",
    buttonText: "Yes, always",
    unlockedText: "Unlocked a little secret",
  },
  favors: [
    {
      title: "Petal Bar",
      body: "Blush blooms, mint leaves, and the sweetest stems.",
      iconType: "flower",
    },
    {
      title: "Tea for Two",
      body: "Slow pours, warm cups, and lingering glances.",
      iconType: "cup",
    },
    {
      title: "Ribbon Notes",
      body: "Little vows tied with silk and tied to us.",
      iconType: "ribbon",
    },
    {
      title: "Sunlit Dessert",
      body: "A bite of something gold, soft, and bright.",
      iconType: "sun",
    },
  ],
  gallery: [
    {
      src: "/demos/cute-classic/1.jpg",
      alt: "Soft picnic moment framed in sunlight.",
      caption: "Soft light, soft promises.",
    },
    {
      src: "/demos/cute-classic/2.jpg",
      alt: "Hands held in a garden glow.",
      caption: "A quiet yes between us.",
    },
    {
      src: "/demos/cute-classic/3.jpg",
      alt: "A bouquet resting on linen.",
      caption: "Pressed petals, lasting vows.",
    },
    {
      src: "/demos/garden-party/1.jpg",
      alt: "Garden seats prepared for two.",
      caption: "Reserved for our forever.",
    },
  ],
  letter: {
    title: "A love note tucked between pages",
    body: [
      "I keep a small garden in my chest where your name grows.",
      "Every petal, every breeze, every pause has your shape.",
      "\"If love had a season, it would look like you.\"",
      "So read this slowly, as if we have all day and only each other.",
    ],
  },
  music: {
    src: "/demos/audio/soft-piano.mp3",
    title: "Soft Piano",
    artist: "Garden Strings",
  },
  timeline: [
    {
      title: "First hello",
      date: "Mar 2, 2023",
      detail: "The night our texts felt like handwritten letters.",
    },
    {
      title: "First date",
      date: "Apr 12, 2023",
      detail: "A walk, a laugh, and a promise we did not say out loud.",
    },
    {
      title: "Favorite moment",
      date: "Jun 8, 2024",
      detail: "Sharing silence and knowing it was everything.",
    },
    {
      title: "Today",
      date: "Feb 14, 2026",
      detail: "A garden RSVP to everything we are becoming.",
    },
  ],
  secret: {
    title: "Secret Garden",
    prompt: "One reason I choose u every day:",
    reasons: [
      "You make ordinary days feel rare.",
      "You listen like you mean it.",
      "You notice the little things.",
      "You make home feel soft.",
      "You keep me brave.",
      "You are my calm.",
      "You are my brightest yes.",
    ],
  },
  footer: {
    from: "From: [Name]",
    to: "To: [Name]",
    date: "February 14, 2026",
    line: "Made with love",
  },
};

const heartClipPath =
  "path('M50 16C43 7 29 6 21 14C13 22 13 35 21 43L50 72L79 43C87 35 87 22 79 14C71 6 57 7 50 16Z')";

const easeSoft: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
};

const petalBurst = [
  { left: "12%", delay: 0, duration: 1.8, size: 10 },
  { left: "26%", delay: 0.1, duration: 2.1, size: 12 },
  { left: "38%", delay: 0.2, duration: 1.9, size: 9 },
  { left: "52%", delay: 0.05, duration: 2.2, size: 11 },
  { left: "64%", delay: 0.18, duration: 2, size: 12 },
  { left: "74%", delay: 0.12, duration: 1.7, size: 10 },
  { left: "86%", delay: 0.22, duration: 2.15, size: 9 },
];

const rootStyle = {
  "--cc-base": "#f9f4ee",
  "--cc-mint": "#d7efe3",
  "--cc-blush": "#f2c7d4",
  "--cc-gold": "#d9b784",
  "--cc-ink": "#1f2933",
} as CSSProperties;

const formatTime = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0:00";
  }
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const FavorIcon = ({ type }: { type: string }) => {
  switch (type) {
    case "flower":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          className="h-8 w-8 text-[color:var(--cc-blush)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="24" cy="24" r="5" fill="currentColor" opacity="0.2" />
          <circle cx="14" cy="18" r="5" />
          <circle cx="34" cy="18" r="5" />
          <circle cx="14" cy="30" r="5" />
          <circle cx="34" cy="30" r="5" />
        </svg>
      );
    case "cup":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          className="h-8 w-8 text-[color:var(--cc-mint)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M10 18h22v12a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8Z" />
          <path d="M32 20h4a6 6 0 0 1 0 12h-4" />
          <path d="M14 12c0 3 4 3 4 6" />
          <path d="M22 12c0 3 4 3 4 6" />
        </svg>
      );
    case "ribbon":
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          className="h-8 w-8 text-[color:var(--cc-gold)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M24 16c-6-6-16-2-16 6c0 6 8 10 16 16" />
          <path d="M24 16c6-6 16-2 16 6c0 6-8 10-16 16" />
          <path d="M18 30l-6 10" />
          <path d="M30 30l6 10" />
        </svg>
      );
    default:
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          className="h-8 w-8 text-[color:var(--cc-gold)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="24" cy="24" r="7" />
          <path d="M24 8v6" />
          <path d="M24 34v6" />
          <path d="M8 24h6" />
          <path d="M34 24h6" />
          <path d="M12 12l4 4" />
          <path d="M32 32l4 4" />
          <path d="M12 36l4-4" />
          <path d="M32 16l4-4" />
        </svg>
      );
  }
};

const HeartOutline = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 100 88"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
  >
    <path d="M50 16C43 7 29 6 21 14C13 22 13 35 21 43L50 72L79 43C87 35 87 22 79 14C71 6 57 7 50 16Z" />
  </svg>
);

export default function CuteClassicGardenRsvpDeluxePage() {
  const prefersReducedMotion = useReducedMotion();
  const secretRef = useRef<HTMLDivElement>(null);
  const musicRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [yesStage, setYesStage] = useState<"idle" | "heart" | "message">(
    "idle"
  );
  const [petalsActive, setPetalsActive] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const lastSparkle = useRef(0);
  const loveBuffer = useRef("");

  const staggerDelay = prefersReducedMotion ? 0 : 0.12;
  const motionDuration = prefersReducedMotion ? 0 : 0.7;

  const favorVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: 16 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: motionDuration, ease: easeSoft },
      },
    }),
    [motionDuration]
  );

  const scrollToSecret = () => {
    secretRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const scrollToMusic = () => {
    musicRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
  };

  const handleYes = () => {
    if (unlocked) {
      scrollToSecret();
      return;
    }
    setUnlocked(true);
    setYesStage("heart");
    if (!prefersReducedMotion) {
      setPetalsActive(true);
    }
    window.setTimeout(() => setYesStage("message"), 650);
    window.setTimeout(scrollToSecret, 1300);
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const handlePlayWhileReading = async () => {
    await togglePlayback();
    scrollToMusic();
  };

  useEffect(() => {
    const stored = window.localStorage.getItem("cc-garden-rsvp-unlocked");
    if (stored === "true") {
      setUnlocked(true);
      setYesStage("message");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "cc-garden-rsvp-unlocked",
      unlocked ? "true" : "false"
    );
  }, [unlocked]);

  useEffect(() => {
    if (!petalsActive) {
      return;
    }
    const timer = window.setTimeout(() => setPetalsActive(false), 2000);
    return () => window.clearTimeout(timer);
  }, [petalsActive]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoaded = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoaded);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.length !== 1) {
        return;
      }
      loveBuffer.current = (
        loveBuffer.current + event.key.toUpperCase()
      ).slice(-4);
      if (loveBuffer.current === "LOVE") {
        setToastVisible(true);
        window.setTimeout(() => setToastVisible(false), 1800);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    const supportsPointer = window.matchMedia("(pointer: fine)").matches;
    if (!supportsPointer) {
      return;
    }
    const handleMove = (event: MouseEvent) => {
      const now = Date.now();
      if (now - lastSparkle.current < 1000) {
        return;
      }
      lastSparkle.current = now;
      const id = now;
      const size = 6 + Math.random() * 6;
      setSparkles((prev) => [
        ...prev.slice(-4),
        { id, x: event.clientX, y: event.clientY, size },
      ]);
      window.setTimeout(() => {
        setSparkles((prev) => prev.filter((sparkle) => sparkle.id !== id));
      }, 1200);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [prefersReducedMotion]);

  const progressPercent = duration ? Math.min(currentTime / duration, 1) : 0;

  return (
    <main
      className="relative isolate min-h-screen overflow-hidden bg-[color:var(--cc-base)] text-[color:var(--cc-ink)]"
      style={rootStyle}
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 cc-paper-texture" />
        <div className="absolute inset-0 cc-dot-grid" />
        <div className="absolute inset-0 cc-grain" />
        <motion.div
          className="absolute left-[10%] top-[-20%] h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,_rgba(242,199,212,0.55)_0%,_rgba(215,239,227,0.05)_60%,_transparent_72%)] blur-3xl"
          animate={
            prefersReducedMotion
              ? { opacity: 0.3, scale: 1 }
              : {
                  opacity: isPlaying ? 0.45 : 0.28,
                  scale: isPlaying ? 1.08 : 1,
                  x: [0, 60, -30],
                  y: [0, 40, -20],
                }
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 28, ease: "easeInOut", repeat: Infinity }
          }
        />
        <div className="absolute inset-0 cc-vignette" />
      </div>

      <div className="pointer-events-none fixed inset-0 z-40">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="cc-cursor-sparkle"
            style={{
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
            }}
          />
        ))}
      </div>
      <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-20 lg:pt-24">
        <div className="absolute right-6 top-8 rounded-full border border-white/70 bg-white/70 px-4 py-1 text-[11px] uppercase tracking-[0.32em] text-slate-500 shadow-sm">
          Recipient view
        </div>
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.42em] text-slate-500">
              <span className="h-2 w-2 rounded-full bg-[color:var(--cc-blush)] shadow" />
              Cute Classic - Garden RSVP Deluxe
            </div>
            <h1 className="font-[var(--font-cormorant)] text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {content.headline}
            </h1>
            <p className="max-w-xl text-lg text-slate-600">
              {content.subheadline}
            </p>
            <div className="flex flex-wrap gap-3">
              {content.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-500 shadow-sm"
                  animate={
                    prefersReducedMotion
                      ? { y: 0 }
                      : { y: [0, -6, 0] }
                  }
                  transition={{
                    duration: 5 + index,
                    delay: index * 0.2,
                    ease: "easeInOut",
                    repeat: prefersReducedMotion ? 0 : Infinity,
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
            <div className="relative mt-10 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--cc-gold)]/50 bg-white/60 shadow-sm">
                <HeartOutline className="h-6 w-6 text-[color:var(--cc-gold)]" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Garden RSVP
                </div>
                <div className="text-sm text-slate-600">
                  A quiet yes in bloom.
                </div>
              </div>
            </div>
          </div>

          <motion.div
            className="group relative rounded-[32px] border border-white/70 bg-white/75 p-8 shadow-[0_24px_70px_-40px_rgba(31,41,55,0.35)] backdrop-blur"
            whileHover={
              prefersReducedMotion ? undefined : { scale: 1.01, y: -2 }
            }
            transition={{ duration: 0.4, ease: easeSoft }}
          >
            <div className="absolute -right-6 top-8 h-16 w-16 rounded-full border border-[color:var(--cc-blush)]/40 bg-white/70" />
            <div className="space-y-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-slate-500">
                  RSVP card
                </p>
                <h2 className="mt-3 font-[var(--font-cormorant)] text-3xl font-semibold">
                  {content.rsvp.title}
                </h2>
                <p className="mt-3 text-sm text-slate-600">
                  {content.rsvp.subtitle}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  type="button"
                  onClick={handleYes}
                  aria-label="RSVP yes"
                  className="relative inline-flex min-w-[170px] items-center justify-center rounded-full border border-transparent bg-[color:var(--cc-blush)] px-6 py-3 text-sm font-semibold text-[color:var(--cc-ink)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cc-blush)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cc-base)] active:scale-[0.98]"
                  animate={
                    yesStage === "heart"
                      ? {
                          backgroundColor: "rgba(255,255,255,0)",
                          borderColor: "rgba(242,199,212,0.7)",
                          color: "var(--cc-ink)",
                        }
                      : {
                          backgroundColor: "var(--cc-blush)",
                          borderColor: "transparent",
                          color: "var(--cc-ink)",
                        }
                  }
                  transition={{ duration: 0.45, ease: easeSoft }}
                >
                  {yesStage === "heart" ? (
                    <HeartOutline className="h-5 w-5" />
                  ) : (
                    content.rsvp.buttonText
                  )}
                </motion.button>
                <button
                  type="button"
                  onClick={scrollToSecret}
                  className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.32em] text-slate-500 transition hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cc-mint)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cc-base)]"
                >
                  Secret
                </button>
              </div>
              <AnimatePresence>
                {(yesStage === "message" || unlocked) && (
                  <motion.p
                    className="text-sm text-slate-600"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.45, ease: easeSoft }}
                  >
                    {content.rsvp.unlockedText}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="pointer-events-none absolute right-8 top-10 opacity-0 transition group-hover:opacity-100">
              <span className="cc-petal-sparkle" />
            </div>
          </motion.div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-[color:var(--cc-mint)]" />
          Garden favors
        </div>
        <h3 className="mt-4 font-[var(--font-cormorant)] text-3xl font-semibold">
          Little luxuries waiting on the table
        </h3>
        <motion.div
          className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: staggerDelay }}
        >
          {content.favors.map((favor) => (
            <motion.div
              key={favor.title}
              variants={favorVariants}
              className="group rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:border-[color:var(--cc-mint)]/60 hover:shadow-[0_20px_50px_-40px_rgba(15,23,42,0.5)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/70 bg-[color:var(--cc-base)] shadow-sm">
                <FavorIcon type={favor.iconType} />
              </div>
              <h4 className="mt-4 font-[var(--font-cormorant)] text-xl font-semibold">
                {favor.title}
              </h4>
              <p className="mt-3 text-sm text-slate-600">{favor.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-[color:var(--cc-blush)]" />
          Garland gallery
        </div>
        <h3 className="mt-4 font-[var(--font-cormorant)] text-3xl font-semibold">
          Frames from the garden
        </h3>
        <div className="mt-10 flex gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0">
          {content.gallery.map((item, index) => {
            const isFeatured = index === 0;
            const isHeart = index === 1;
            return (
              <div
                key={item.src}
                className={`group relative min-w-[240px] flex-1 snap-center ${
                  isFeatured ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
              >
                <div
                  className={`relative overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.4)] ${
                    index % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"
                  }`}
                >
                  <div
                    className="aspect-[4/5] w-full overflow-hidden"
                    style={isHeart ? { clipPath: heartClipPath } : undefined}
                  >
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="pointer-events-none absolute bottom-4 left-4 translate-y-4 rounded-full bg-white/90 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-500 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    {item.caption}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-[color:var(--cc-gold)]" />
          Love letter
        </div>
        <div className="mt-6 rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] md:p-12">
          <div className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 60 220"
              className="absolute -left-6 top-2 hidden h-[180px] w-10 text-[color:var(--cc-mint)] md:block"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
            >
              <path d="M30 10v200" />
              <path d="M30 40c-8 2-14 8-16 16" />
              <path d="M30 78c8 2 14 8 16 16" />
              <circle cx="30" cy="56" r="6" />
              <circle cx="30" cy="118" r="6" />
              <path d="M30 142c-10 2-16 10-18 18" />
            </svg>
            <div className="md:pl-10">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-[var(--font-cormorant)] text-3xl font-semibold">
                  {content.letter.title}
                </h3>
                <span className="text-xs uppercase tracking-[0.35em] text-slate-500">
                  Read slowly
                </span>
              </div>
              <div className="mt-6 space-y-4 text-base text-slate-600">
                {content.letter.body.map((line, index) => (
                  <motion.p
                    key={line}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.55,
                      delay: prefersReducedMotion ? 0 : index * 0.1,
                      ease: easeSoft,
                    }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>
              <div className="mt-8">
                <button
                  type="button"
                  onClick={handlePlayWhileReading}
                  className="inline-flex items-center gap-3 rounded-full border border-[color:var(--cc-mint)]/50 bg-white/80 px-5 py-3 text-xs uppercase tracking-[0.3em] text-slate-500 transition hover:border-[color:var(--cc-mint)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cc-mint)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cc-base)] active:scale-[0.98]"
                >
                  Play song while reading
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={musicRef}
        className="mx-auto max-w-6xl px-6 pb-16"
        aria-label="Music player"
      >
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-[color:var(--cc-blush)]" />
          Music
        </div>
        <div className="mt-6 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-slate-500">
                Now playing
              </p>
              <h3 className="mt-3 font-[var(--font-cormorant)] text-2xl font-semibold">
                {content.music.title}
              </h3>
              <p className="text-sm text-slate-600">{content.music.artist}</p>
            </div>
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause music" : "Play music"}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--cc-blush)]/60 bg-[color:var(--cc-blush)]/60 text-sm font-semibold text-[color:var(--cc-ink)] shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cc-blush)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cc-base)] active:scale-[0.96]"
            >
              {isPlaying ? "II" : "Play"}
            </button>
          </div>
          <div className="mt-8">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <div className="relative mt-3 h-3">
              <div className="absolute inset-0 rounded-full bg-slate-200/70" />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[color:var(--cc-mint)]/60"
                style={{ width: `${progressPercent * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.span
                    key={index}
                    className="h-2 w-2 rounded-full bg-[color:var(--cc-gold)]/60"
                    animate={
                      prefersReducedMotion || !isPlaying
                        ? { scale: 1, opacity: 0.4 }
                        : { scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }
                    }
                    transition={{
                      duration: 1.2,
                      delay: index * 0.2,
                      repeat: prefersReducedMotion || !isPlaying ? 0 : Infinity,
                    }}
                  />
                ))}
              </div>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  const audio = audioRef.current;
                  if (!audio) {
                    return;
                  }
                  audio.currentTime = value;
                  setCurrentTime(value);
                }}
                aria-label="Song progress"
                className="absolute inset-0 h-3 w-full cursor-pointer opacity-0"
              />
            </div>
          </div>
          <audio ref={audioRef} src={content.music.src} preload="metadata" />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-[color:var(--cc-mint)]" />
          Our little timeline
        </div>
        <div className="mt-8 space-y-4">
          {content.timeline.map((moment, index) => {
            const isOpen = expandedIndex === index;
            return (
              <div
                key={moment.title}
                className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedIndex(isOpen ? null : index)
                  }
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cc-blush)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--cc-base)]"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--cc-blush)]/60 bg-white/70">
                      <HeartOutline className="h-4 w-4 text-[color:var(--cc-blush)]" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        {moment.date}
                      </p>
                      <h4 className="mt-1 font-[var(--font-cormorant)] text-xl font-semibold">
                        {moment.title}
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {isOpen ? "Close" : "Open"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.4,
                        ease: easeSoft,
                      }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-sm text-slate-600">
                        {moment.detail}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      <section
        ref={secretRef}
        className="relative mx-auto max-w-6xl px-6 pb-20"
        aria-label="Secret garden"
      >
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-slate-500">
          <span className="h-2 w-2 rounded-full bg-[color:var(--cc-gold)]" />
          Secret garden
        </div>
        <div className="relative mt-6 overflow-hidden rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)] md:p-12">
          {!unlocked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
              <div className="rounded-full border border-[color:var(--cc-blush)]/50 bg-white/90 px-6 py-3 text-xs uppercase tracking-[0.35em] text-slate-500">
                Secret Garden
              </div>
            </div>
          )}
          <div className={unlocked ? "" : "blur-sm"}>
            <h3 className="font-[var(--font-cormorant)] text-3xl font-semibold">
              {content.secret.title}
            </h3>
            <p className="mt-3 text-sm text-slate-600">
              {content.secret.prompt}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {content.secret.reasons.map((reason) => (
                <span
                  key={reason}
                  className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-500"
                >
                  {reason}
                </span>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {petalsActive && !prefersReducedMotion && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-20"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {petalBurst.map((petal, index) => (
                  <motion.span
                    key={`${petal.left}-${index}`}
                    className="absolute top-[-10%] block rounded-full bg-[color:var(--cc-blush)]/70"
                    style={{ left: petal.left, width: petal.size, height: petal.size }}
                    initial={{ y: 0, opacity: 0.9 }}
                    animate={{ y: "220%", opacity: 0 }}
                    transition={{
                      duration: petal.duration,
                      delay: petal.delay,
                      ease: "easeIn",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                {content.footer.from}
              </p>
              <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-500">
                {content.footer.to}
              </p>
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {content.footer.date}
            </div>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.5,
                ease: easeSoft,
              }}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[color:var(--cc-gold)]/60 bg-white/80 shadow-sm"
            >
              <HeartOutline className="h-6 w-6 text-[color:var(--cc-gold)]" />
            </motion.div>
          </div>
          <p className="mt-6 text-center text-xs uppercase tracking-[0.35em] text-slate-500">
            {content.footer.line}
          </p>
        </div>
      </section>

      <AnimatePresence>
        {toastVisible && (
          <motion.div
            role="status"
            aria-live="polite"
            className="fixed bottom-6 right-6 z-50 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-500 shadow-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: easeSoft }}
          >
            I felt that
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .cc-paper-texture {
          background-image: linear-gradient(
              120deg,
              rgba(255, 255, 255, 0.6),
              rgba(255, 255, 255, 0.9)
            ),
            repeating-linear-gradient(
              0deg,
              rgba(31, 41, 55, 0.02) 0,
              rgba(31, 41, 55, 0.02) 1px,
              transparent 1px,
              transparent 6px
            );
          opacity: 0.6;
        }
        .cc-dot-grid {
          background-image: radial-gradient(
            rgba(31, 41, 55, 0.08) 1px,
            transparent 0
          );
          background-size: 28px 28px;
          opacity: 0.25;
        }
        .cc-grain {
          background-image: radial-gradient(
            rgba(31, 41, 55, 0.08) 1px,
            transparent 0
          );
          background-size: 3px 3px;
          opacity: 0.2;
          mix-blend-mode: multiply;
        }
        .cc-vignette {
          box-shadow: inset 0 0 140px rgba(15, 23, 42, 0.15);
        }
        .cc-cursor-sparkle {
          position: absolute;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(242, 199, 212, 0.95),
            rgba(242, 199, 212, 0)
          );
          transform: translate(-50%, -50%);
          animation: cc-sparkle 1.2s ease-out forwards;
          box-shadow: 0 0 12px rgba(217, 183, 132, 0.4);
        }
        .cc-petal-sparkle {
          display: block;
          width: 14px;
          height: 14px;
          border-radius: 999px;
          background: radial-gradient(
            circle,
            rgba(242, 199, 212, 0.85),
            rgba(242, 199, 212, 0)
          );
          box-shadow: 0 0 16px rgba(215, 239, 227, 0.55);
          animation: cc-sparkle 1.6s ease-out infinite;
        }
        @keyframes cc-sparkle {
          0% {
            opacity: 0;
            transform: translate(-4px, 6px) scale(0.6);
          }
          50% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(4px, -6px) scale(0.4);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cc-cursor-sparkle,
          .cc-petal-sparkle {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
