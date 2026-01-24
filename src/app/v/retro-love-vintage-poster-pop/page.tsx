"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bebas_Neue, IBM_Plex_Mono, Inter } from "next/font/google";
import {
  type CSSProperties,
  type PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

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

const content = {
  recipientName: "[Name]",
  tapeLabel: "Mixtape for:",
  confessionLines: ["I LIKE U", "LIKE, A LOT", "BE MY VALENTINE?"],
  photos: [
    {
      src: "/demos/retro-love/1.jpg",
      alt: "Arcade memory one.",
      caption: "FIRST ARCADE NIGHT",
      timecode: "00:04",
    },
    {
      src: "/demos/retro-love/2.jpg",
      alt: "Arcade memory two.",
      caption: "NEON PROMISES",
      timecode: "00:09",
    },
    {
      src: "/demos/retro-love/3.jpg",
      alt: "Arcade memory three.",
      caption: "LATE-NIGHT LOOP",
      timecode: "00:14",
    },
  ],
  ending: {
    headline: "CHOOSE YOUR ENDING",
    message: "You just unlocked the bonus level of us.",
    stampText: "APPROVED",
  },
  audio: {
    src: "/audio/retro-love.mp3",
    title: "Retro Love",
    artist: "VHS Arcade",
  },
};

const theme = {
  "--vhs-bg": "#09000F",
  "--vhs-ink": "#F6F0FF",
  "--vhs-pink": "#FF3BD4",
  "--vhs-cyan": "#2DFFF3",
  "--vhs-yellow": "#FFE94A",
  "--vhs-red": "#FF2E2E",
  "--vhs-tape": "#B8B2C3",
  "--vhs-shadow": "rgba(0,0,0,0.55)",
} as CSSProperties;

const headlinePieces = ["RETRO", "LOVE"];
const confessionTransitions = [
  {
    initial: { opacity: 0, scale: 0.9, y: 30 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.05, y: -20 },
  },
  {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  },
  {
    initial: { opacity: 0, scale: 1.15 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
];

const pixelHearts = [
  { left: "12%", delay: 0.2, size: 10 },
  { left: "26%", delay: 0.6, size: 8 },
  { left: "44%", delay: 0.1, size: 12 },
  { left: "62%", delay: 0.4, size: 9 },
  { left: "78%", delay: 0.7, size: 11 },
];

const pixelBursts = [
  { top: "20%", left: "15%", delay: 0 },
  { top: "40%", left: "30%", delay: 0.05 },
  { top: "60%", left: "20%", delay: 0.1 },
  { top: "30%", left: "55%", delay: 0.12 },
  { top: "50%", left: "70%", delay: 0.08 },
  { top: "70%", left: "65%", delay: 0.15 },
  { top: "25%", left: "80%", delay: 0.18 },
];

const confettiPieces = [
  { left: "10%", delay: 0, duration: 1.6, shape: "pixel" },
  { left: "22%", delay: 0.12, duration: 1.8, shape: "triangle" },
  { left: "36%", delay: 0.2, duration: 1.7, shape: "dot" },
  { left: "52%", delay: 0.08, duration: 1.9, shape: "pixel" },
  { left: "68%", delay: 0.18, duration: 1.6, shape: "triangle" },
  { left: "82%", delay: 0.05, duration: 1.8, shape: "dot" },
];

const sceneTimecodes = ["00:00:03", "00:03:11", "00:07:06", "00:12:24", "00:15:33"];
const trackingTarget = 62;
const trackingTolerance = 8;

const PixelHeart = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 20"
    className={className}
    fill="none"
  >
    <path
      d="M3 2h5v3h3V2h5v5h-2v2h-2v2h-2v2h-2v-2H8V9H6V7H4V2Z"
      fill="currentColor"
    />
  </svg>
);

const ApprovedStamp = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 120 60"
    className={className}
    fill="none"
  >
    <rect
      x="4"
      y="4"
      width="112"
      height="52"
      rx="8"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      d="M20 44l12-28 12 18 10-12 12 18"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
  </svg>
);

const VhsTape = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 320 200"
    className={className}
    fill="none"
  >
    <rect
      x="10"
      y="20"
      width="300"
      height="160"
      rx="20"
      fill="var(--vhs-tape)"
      stroke="var(--vhs-ink)"
      strokeWidth="6"
    />
    <rect
      x="40"
      y="50"
      width="240"
      height="70"
      rx="8"
      fill="var(--vhs-bg)"
      stroke="var(--vhs-ink)"
      strokeWidth="4"
    />
    <rect
      x="60"
      y="130"
      width="200"
      height="30"
      rx="6"
      fill="var(--vhs-ink)"
    />
    <circle cx="110" cy="85" r="22" fill="var(--vhs-ink)" />
    <circle cx="210" cy="85" r="22" fill="var(--vhs-ink)" />
    <circle cx="110" cy="85" r="8" fill="var(--vhs-bg)" />
    <circle cx="210" cy="85" r="8" fill="var(--vhs-bg)" />
    <rect
      x="90"
      y="136"
      width="140"
      height="18"
      rx="4"
      fill="var(--vhs-tape)"
    />
  </svg>
);

const ScanlinesSvg = ({ className }: { className?: string }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 120 120"
    className={className}
    fill="none"
  >
    <defs>
      <pattern id="scan" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="2" fill="rgba(246,240,255,0.08)" />
      </pattern>
    </defs>
    <rect width="120" height="120" fill="url(#scan)" />
  </svg>
);
export default function RetroLoveVhsArcadePage() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [hasInteracted, setHasInteracted] = useState(false);
  const [started, setStarted] = useState(false);
  const [burstActive, setBurstActive] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [tracking, setTracking] = useState(18);
  const [signalLocked, setSignalLocked] = useState(false);
  const [confessionIndex, setConfessionIndex] = useState(0);
  const [reelIndex, setReelIndex] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [flashActive, setFlashActive] = useState(false);
  const [snapshotCount, setSnapshotCount] = useState(0);
  const [approved, setApproved] = useState(false);
  const [welcomeBack, setWelcomeBack] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [audioVisible, setAudioVisible] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [initialScene, setInitialScene] = useState<number | null>(null);

  const confessionVariant =
    confessionTransitions[confessionIndex % confessionTransitions.length];

  const hudTimecode =
    activeScene === 3
      ? content.photos[reelIndex]?.timecode ?? sceneTimecodes[3]
      : sceneTimecodes[activeScene] ?? sceneTimecodes[0];

  const trackingDistance = Math.abs(tracking - trackingTarget);
  const trackingClarity = signalLocked
    ? 1
    : Math.max(0, 1 - trackingDistance / trackingTolerance);

  const setSceneRef = (index: number) => (node: HTMLDivElement | null) => {
    sceneRefs.current[index] = node;
  };

  const scrollToScene = (index: number) => {
    const node = sceneRefs.current[index];
    const container = containerRef.current;
    if (!node || !container) {
      return;
    }
    container.scrollTo({
      top: node.offsetTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const handleStart = () => {
    if (started) {
      return;
    }
    setStarted(true);
    setHasInteracted(true);
    setBurstActive(true);
    window.setTimeout(() => scrollToScene(1), 500);
    window.setTimeout(() => setBurstActive(false), 900);
  };

  const handleTrackingChange = (value: number) => {
    setTracking(value);
    if (!signalLocked && Math.abs(value - trackingTarget) <= trackingTolerance) {
      setSignalLocked(true);
      window.setTimeout(() => scrollToScene(2), 600);
    }
  };

  const handleConfessionAdvance = () => {
    setConfessionIndex((prev) =>
      Math.min(prev + 1, content.confessionLines.length - 1)
    );
  };

  const handleRewind = () => {
    setConfessionIndex(0);
  };

  const updateScrub = (clientX: number) => {
    const timeline = timelineRef.current;
    if (!timeline) {
      return;
    }
    const rect = timeline.getBoundingClientRect();
    const progress = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const nextIndex = Math.round(progress * (content.photos.length - 1));
    setReelIndex(nextIndex);
  };

  const handleScrubStart = (event: PointerEvent<HTMLDivElement>) => {
    setScrubbing(true);
    updateScrub(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleScrubMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrubbing) {
      return;
    }
    updateScrub(event.clientX);
  };

  const handleScrubEnd = () => {
    setScrubbing(false);
  };

  const handleFreezeFrame = () => {
    setFlashActive(true);
    setSnapshotCount((prev) => prev + 1);
    window.setTimeout(() => setFlashActive(false), 200);
  };

  const handleApprove = () => {
    if (approved) {
      return;
    }
    setApproved(true);
    setAudioVisible(true);
    if (!prefersReducedMotion) {
      setConfettiActive(true);
    }
  };

  useEffect(() => {
    const storedApproved = window.localStorage.getItem("retro-love-approved");
    const storedScene = window.localStorage.getItem("retro-love-last-scene");
    const approvedValue = storedApproved === "true";
    setApproved(approvedValue);
    if (approvedValue) {
      setWelcomeBack(true);
      setAudioVisible(true);
      setHasInteracted(true);
    }
    const parsedScene = storedScene ? Number(storedScene) : 0;
    const targetScene = approvedValue ? 4 : Math.min(Math.max(parsedScene, 0), 4);
    setInitialScene(Number.isFinite(targetScene) ? targetScene : 0);
  }, []);

  useEffect(() => {
    if (initialScene === null) {
      return;
    }
    window.setTimeout(() => scrollToScene(initialScene), 120);
  }, [initialScene]);

  useEffect(() => {
    window.localStorage.setItem(
      "retro-love-approved",
      approved ? "true" : "false"
    );
  }, [approved]);

  useEffect(() => {
    window.localStorage.setItem("retro-love-last-scene", String(activeScene));
  }, [activeScene]);

  useEffect(() => {
    if (!confettiActive) {
      return;
    }
    const timer = window.setTimeout(() => setConfettiActive(false), 2000);
    return () => window.clearTimeout(timer);
  }, [confettiActive]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const handleEnded = () => setAudioPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audioPlaying) {
      audio
        .play()
        .then(() => setAudioPlaying(true))
        .catch(() => setAudioPlaying(false));
    } else {
      audio.pause();
    }
  }, [audioPlaying]);

  useEffect(() => {
    const markInteraction = () => setHasInteracted(true);
    window.addEventListener("pointerdown", markInteraction);
    window.addEventListener("keydown", markInteraction);
    return () => {
      window.removeEventListener("pointerdown", markInteraction);
      window.removeEventListener("keydown", markInteraction);
    };
  }, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-scene") ?? 0);
            setActiveScene(index);
          }
        });
      },
      { root, threshold: 0.6 }
    );
    sceneRefs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && activeScene === 0) {
        handleStart();
      }
      if (activeScene !== 3) {
        return;
      }
      if (document.activeElement?.tagName === "INPUT") {
        return;
      }
      if (event.key === "ArrowLeft") {
        setReelIndex((prev) => Math.max(prev - 1, 0));
      }
      if (event.key === "ArrowRight") {
        setReelIndex((prev) => Math.min(prev + 1, content.photos.length - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeScene]);

  return (
    <main
      className={`${displayFont.variable} ${monoFont.variable} ${bodyFont.variable} bg-[color:var(--vhs-bg)] text-[color:var(--vhs-ink)]`}
      style={theme}
    >
      <div className="pointer-events-none fixed inset-0 z-40">
        <div className="absolute inset-0 vhs-grain" />
        <div className="absolute inset-0 vhs-vignette" />
        <div className="absolute inset-0 vhs-barrel" />
        <ScanlinesSvg className="absolute inset-0 h-full w-full opacity-60" />
        {!prefersReducedMotion && (
          <motion.div
            className="absolute left-0 right-0 h-10 vhs-tracking"
            animate={{ y: ["-20%", "120%"] }}
            transition={{ duration: 10, ease: "linear", repeat: Infinity }}
          />
        )}
      </div>

      <div className="fixed left-4 top-4 z-50 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--vhs-ink)]">
        <span className="rounded-full border border-[color:var(--vhs-ink)]/40 px-3 py-1 font-[var(--font-retro-mono)]">
          TAPE: SIDE A
        </span>
        <span className="rounded-full border border-[color:var(--vhs-ink)]/40 px-3 py-1 font-[var(--font-retro-mono)]">
          {hudTimecode}
        </span>
        {snapshotCount > 0 && (
          <span className="rounded-full border border-[color:var(--vhs-cyan)] px-3 py-1 text-[color:var(--vhs-cyan)]">
            SNAP x{snapshotCount}
          </span>
        )}
      </div>

      {approved && (
        <button
          type="button"
          onClick={() => setAudioVisible((prev) => !prev)}
          className="fixed right-4 top-4 z-50 rounded-full border border-[color:var(--vhs-cyan)]/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[color:var(--vhs-cyan)]"
        >
          AUDIO
        </button>
      )}

      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 rounded-full border border-[color:var(--vhs-ink)]/40 bg-[color:var(--vhs-bg)]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--vhs-ink)]"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
          >
            PRESS START
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={containerRef}
        className={`relative h-screen overflow-y-auto snap-y snap-mandatory ${
          prefersReducedMotion ? "" : "scroll-smooth"
        }`}
      >
        <section
          ref={setSceneRef(0)}
          data-scene="0"
          className="relative flex h-screen snap-start items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,59,212,0.25),_transparent_55%)]" />
          <div className="relative z-10 flex flex-col items-center gap-6 text-center">
            <motion.div
              className="vhs-aberration flex flex-wrap justify-center gap-6 text-6xl font-[var(--font-retro-display)] uppercase tracking-[0.2em] sm:text-8xl lg:text-9xl"
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      textShadow: [
                        "0 0 18px rgba(255,59,212,0.7)",
                        "0 0 22px rgba(45,255,243,0.7)",
                        "0 0 18px rgba(255,233,74,0.7)",
                      ],
                    }
              }
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              {headlinePieces.map((piece, index) => (
                <motion.span
                  key={piece}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.6,
                    delay: prefersReducedMotion ? 0 : index * 0.2,
                  }}
                >
                  {piece}
                </motion.span>
              ))}
            </motion.div>
            <motion.button
              type="button"
              onClick={handleStart}
              className="rounded-full border-2 border-[color:var(--vhs-ink)] bg-[color:var(--vhs-red)] px-8 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--vhs-ink)] shadow-[0_0_18px_rgba(255,46,46,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--vhs-cyan)]"
              animate={
                prefersReducedMotion
                  ? undefined
                  : { opacity: [0.5, 1, 0.5] }
              }
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              PRESS START
            </motion.button>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--vhs-cyan)]">
              Insert heart to continue
            </p>
          </div>
          {!prefersReducedMotion && (
            <div className="absolute inset-0 pointer-events-none">
              {pixelHearts.map((heart, index) => (
                <motion.div
                  key={`${heart.left}-${index}`}
                  className="absolute bottom-10 text-[color:var(--vhs-pink)]"
                  style={{ left: heart.left }}
                  animate={{ y: [-10, -140], opacity: [0, 0.8, 0] }}
                  transition={{
                    duration: 6,
                    delay: heart.delay,
                    repeat: Infinity,
                  }}
                >
                  <PixelHeart className="h-4 w-4" />
                </motion.div>
              ))}
            </div>
          )}

          <AnimatePresence>
            {burstActive && !prefersReducedMotion && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-20"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {pixelBursts.map((burst, index) => (
                  <motion.span
                    key={`${burst.left}-${index}`}
                    className="absolute h-3 w-3 bg-[color:var(--vhs-yellow)]"
                    style={{ top: burst.top, left: burst.left }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.6, delay: burst.delay }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section
          ref={setSceneRef(1)}
          data-scene="1"
          className="relative flex h-screen snap-start items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(45,255,243,0.25),_transparent_55%)]" />
          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-6 px-6 text-center">
            <h2 className="vhs-aberration text-4xl font-[var(--font-retro-display)] uppercase tracking-[0.3em] sm:text-6xl">
              VHS TAPE LOADER
            </h2>
            <div className="relative w-full max-w-3xl">
              <VhsTape className="h-auto w-full" />
              <div
                className="absolute left-1/2 top-[38%] w-[70%] -translate-x-1/2 rounded-md border border-[color:var(--vhs-ink)]/40 bg-[color:var(--vhs-bg)]/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--vhs-ink)]"
                style={{
                  filter: `blur(${(1 - trackingClarity) * 6}px)`,
                  opacity: 0.5 + trackingClarity * 0.5,
                }}
              >
                {content.tapeLabel} {content.recipientName}
              </div>
            </div>

            <div className="flex w-full max-w-xl flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em]">
                <span className="text-[color:var(--vhs-cyan)]">Tracking</span>
                <span>{signalLocked ? "SIGNAL LOCKED" : "ADJUST"}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={tracking}
                onChange={(event) => handleTrackingChange(Number(event.target.value))}
                aria-label="Tracking slider"
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--vhs-ink)]/20 accent-[color:var(--vhs-cyan)]"
              />
              {signalLocked && (
                <div className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--vhs-cyan)]">
                  SIGNAL LOCKED
                </div>
              )}
            </div>
          </div>
        </section>

        <section
          ref={setSceneRef(2)}
          data-scene="2"
          className="relative flex h-screen snap-start items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,233,74,0.2),_transparent_60%)]" />
          {!signalLocked && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[color:var(--vhs-bg)]/80 text-center text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--vhs-cyan)]">
              SIGNAL NOT LOCKED
            </div>
          )}
          <div
            className={`relative z-10 flex w-full max-w-4xl flex-col items-center gap-10 px-6 text-center ${
              signalLocked ? "" : "pointer-events-none blur-sm"
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={confessionIndex}
                className="vhs-aberration text-5xl font-[var(--font-retro-display)] uppercase tracking-[0.25em] sm:text-7xl"
                initial={confessionVariant.initial}
                animate={confessionVariant.animate}
                exit={confessionVariant.exit}
                transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
              >
                {content.confessionLines[confessionIndex]}
              </motion.div>
            </AnimatePresence>
            <button
              type="button"
              onClick={handleConfessionAdvance}
              className="rounded-full border border-[color:var(--vhs-ink)]/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--vhs-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--vhs-pink)]"
            >
              Tap to advance
            </button>
            <button
              type="button"
              onClick={handleRewind}
              className="rounded-full border border-[color:var(--vhs-cyan)]/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-[color:var(--vhs-cyan)]"
            >
              Rewind
            </button>
          </div>
        </section>
        <section
          ref={setSceneRef(3)}
          data-scene="3"
          className="relative flex h-screen snap-start items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,255,243,0.2),_transparent_60%)]" />
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 px-6">
            <div className="relative flex h-[65vh] w-full max-w-4xl items-center justify-center overflow-hidden rounded-[18px] border-2 border-[color:var(--vhs-ink)]/30">
              <AnimatePresence mode="wait">
                <motion.img
                  key={content.photos[reelIndex]?.src}
                  src={content.photos[reelIndex]?.src}
                  alt={content.photos[reelIndex]?.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                />
              </AnimatePresence>
              <AnimatePresence>
                {flashActive && (
                  <motion.div
                    className="absolute inset-0 bg-[color:var(--vhs-ink)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              <motion.div
                key={content.photos[reelIndex]?.caption}
                className="absolute bottom-6 left-6 vhs-aberration rounded-full border border-[color:var(--vhs-ink)]/40 bg-[color:var(--vhs-bg)]/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em]"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
              >
                {content.photos[reelIndex]?.caption}
              </motion.div>
            </div>

            <div className="flex w-full max-w-4xl flex-col gap-4">
              <div
                ref={timelineRef}
                role="slider"
                tabIndex={0}
                aria-label="Photo reel scrubber"
                className="relative h-14 w-full cursor-ew-resize rounded-full border border-[color:var(--vhs-ink)]/30 bg-[color:var(--vhs-bg)]/70"
                onPointerDown={handleScrubStart}
                onPointerMove={handleScrubMove}
                onPointerUp={handleScrubEnd}
                onPointerLeave={handleScrubEnd}
              >
                <div className="absolute inset-x-6 top-1/2 h-[2px] -translate-y-1/2 bg-[color:var(--vhs-ink)]/30" />
                {content.photos.map((photo, index) => (
                  <div
                    key={photo.timecode}
                    className="absolute top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[color:var(--vhs-ink)]"
                    style={{ left: `${(index / (content.photos.length - 1)) * 100}%` }}
                  >
                    <span className="block h-3 w-[2px] bg-[color:var(--vhs-ink)]/60" />
                    <span className="mt-2 block">{photo.timecode}</span>
                  </div>
                ))}
                <div
                  className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[color:var(--vhs-cyan)] bg-[color:var(--vhs-bg)]"
                  style={{ left: `${(reelIndex / (content.photos.length - 1)) * 100}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.35em]">
                <button
                  type="button"
                  onClick={handleFreezeFrame}
                  className="rounded-full border border-[color:var(--vhs-yellow)]/60 px-5 py-2 text-[color:var(--vhs-yellow)]"
                >
                  Freeze Frame
                </button>
                <span className="text-[color:var(--vhs-cyan)]">Drag to scrub</span>
              </div>
            </div>
          </div>
        </section>

        <section
          ref={setSceneRef(4)}
          data-scene="4"
          className="relative flex h-screen snap-start items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,59,212,0.2),_transparent_60%)]" />
          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 px-6 text-center">
            {welcomeBack && (
              <div className="rounded-full border border-[color:var(--vhs-cyan)]/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--vhs-cyan)]">
                WELCOME BACK
              </div>
            )}
            <h2 className="vhs-aberration text-4xl font-[var(--font-retro-display)] uppercase tracking-[0.3em] sm:text-6xl">
              {content.ending.headline}
            </h2>
            <div className="flex flex-col gap-6 sm:flex-row">
              <button
                type="button"
                onClick={handleApprove}
                className="rounded-full border-2 border-[color:var(--vhs-ink)] bg-[color:var(--vhs-cyan)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--vhs-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--vhs-yellow)]"
              >
                YES
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="rounded-full border-2 border-[color:var(--vhs-ink)] bg-[color:var(--vhs-pink)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--vhs-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--vhs-yellow)]"
              >
                YES (LOUDER)
              </button>
            </div>

            <AnimatePresence>
              {approved && (
                <motion.div
                  className="flex flex-col items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                >
                  <div className="flex items-center gap-4 rounded-lg border-2 border-[color:var(--vhs-red)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--vhs-red)]">
                    {content.ending.stampText}
                    <ApprovedStamp className="h-8 w-16" />
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[color:var(--vhs-ink)]">
                    {content.ending.message}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {approved && audioVisible && (
                <motion.div
                  className="flex flex-col items-center gap-4 rounded-[18px] border-2 border-[color:var(--vhs-ink)]/40 bg-[color:var(--vhs-bg)]/70 px-6 py-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                >
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--vhs-cyan)]">
                    {content.audio.title} - {content.audio.artist}
                  </div>
                  <button
                    type="button"
                    onClick={() => setAudioPlaying((prev) => !prev)}
                    className="rounded-full border border-[color:var(--vhs-ink)]/50 px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--vhs-ink)]"
                  >
                    {audioPlaying ? "Pause" : "Play"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {confettiActive && !prefersReducedMotion && (
              <motion.div
                className="pointer-events-none absolute inset-0 z-20"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {confettiPieces.map((piece, index) => (
                  <motion.span
                    key={`${piece.left}-${index}`}
                    className={`absolute top-[-10%] block ${
                      piece.shape === "triangle"
                        ? "vhs-confetti-triangle"
                        : piece.shape === "dot"
                        ? "vhs-confetti-dot"
                        : "vhs-confetti-pixel"
                    }`}
                    style={{ left: piece.left }}
                    initial={{ y: 0, opacity: 0.9 }}
                    animate={{ y: "220%", opacity: 0 }}
                    transition={{
                      duration: piece.duration,
                      delay: piece.delay,
                      ease: "easeIn",
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      <audio ref={audioRef} src={content.audio.src} preload="metadata" />

      <style jsx global>{`
        .vhs-grain {
          background-image: radial-gradient(
              rgba(246, 240, 255, 0.1) 1px,
              transparent 0
            ),
            radial-gradient(rgba(0, 0, 0, 0.25) 1px, transparent 0);
          background-size: 3px 3px, 5px 5px;
          opacity: 0.25;
          mix-blend-mode: screen;
        }
        .vhs-vignette {
          background: radial-gradient(
            circle,
            transparent 40%,
            rgba(0, 0, 0, 0.6)
          );
          opacity: 0.7;
        }
        .vhs-barrel {
          background: radial-gradient(
            circle,
            rgba(0, 0, 0, 0.2) 0,
            transparent 55%,
            rgba(0, 0, 0, 0.55) 100%
          );
          transform: scale(1.02);
          opacity: 0.6;
        }
        .vhs-tracking {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(246, 240, 255, 0.15),
            transparent
          );
          opacity: 0.3;
        }
        .vhs-aberration {
          text-shadow: 3px 0 var(--vhs-pink), -3px 0 var(--vhs-cyan);
        }
        .vhs-confetti-pixel {
          width: 10px;
          height: 10px;
          background: var(--vhs-yellow);
        }
        .vhs-confetti-triangle {
          width: 12px;
          height: 12px;
          background: var(--vhs-pink);
          clip-path: polygon(50% 0, 0 100%, 100% 100%);
        }
        .vhs-confetti-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--vhs-cyan);
        }
        @media (prefers-reduced-motion: reduce) {
          .vhs-tracking {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
