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
  recipientName: "My Love",
  tagline: "Bold, nostalgic, fun.",
  title: "Will u be my Valentine?",
  subtitle: "Cue the vintage soundtrack and the boldest smile.",
  loveNote:
    "You are my favorite throwback and my best right-now. With you, every day feels like a highlight reel.",
  confessionLines: [
    "I LIKE U",
    "LIKE, A LOT",
    "YOU ARE MY FAVORITE",
    "REWIND WORTHY",
    "PRESS PLAY ON US",
    "BE MY VALENTINE?",
  ],
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
    {
      src: "/demos/retro-love/1.jpg",
      alt: "Arcade memory four.",
      caption: "PIXEL HEARTS",
      timecode: "00:19",
    },
    {
      src: "/demos/retro-love/2.jpg",
      alt: "Arcade memory five.",
      caption: "BONUS LEVEL",
      timecode: "00:24",
    },
  ],
  audio: {
    src: "/audio/retro-love.mp3",
    title: "Retro Love",
    artist: "Side A",
  },
  ending: {
    headline: "Tiny Promises",
    stampText: "APPROVED",
    finalLine: "Made for u, always.",
  },
};

const theme = {
  "--bg": "#09000F",
  "--ink": "#F6F0FF",
  "--neonPink": "#FF3BD4",
  "--neonCyan": "#2DFFF3",
  "--neonYellow": "#FFE94A",
  "--hotRed": "#FF2E2E",
  "--tapeGray": "#B8B2C3",
  "--shadow": "rgba(0,0,0,0.55)",
} as CSSProperties;

const sceneCount = 5;
const sceneTimecodes = [
  "00:00:04",
  "00:09:12",
  "00:18:22",
  "00:29:04",
  "00:45:00",
];
const trackingTarget = 62;
const trackingTolerance = 8;

const confessionTransitions = [
  {
    initial: { opacity: 0, scale: 0.9, filter: "blur(6px)" },
    animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, scale: 1.06, filter: "blur(4px)" },
  },
  {
    initial: { opacity: 0, x: -80, clipPath: "inset(0 100% 0 0)" },
    animate: { opacity: 1, x: 0, clipPath: "inset(0 0 0 0)" },
    exit: { opacity: 0, x: 80 },
  },
  {
    initial: { opacity: 0, y: 60, scale: 1.08 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -40, scale: 0.96 },
  },
  {
    initial: { opacity: 0, scale: 1.2, rotate: -2 },
    animate: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 0.9, rotate: 2 },
  },
  {
    initial: { opacity: 0, filter: "blur(8px)", scale: 0.95 },
    animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
    exit: { opacity: 0, filter: "blur(6px)", scale: 1.02 },
  },
];

const pixelHearts = [
  { left: "16%", delay: 0.4 },
  { left: "42%", delay: 1.1 },
  { left: "68%", delay: 0.8 },
];

const pixelBursts = [
  { top: "24%", left: "20%", delay: 0 },
  { top: "50%", left: "30%", delay: 0.05 },
  { top: "60%", left: "60%", delay: 0.12 },
  { top: "36%", left: "70%", delay: 0.18 },
];

const confettiPieces = [
  { left: "12%", delay: 0, duration: 1.6, shape: "pixel" },
  { left: "28%", delay: 0.1, duration: 1.9, shape: "star" },
  { left: "46%", delay: 0.2, duration: 1.7, shape: "dot" },
  { left: "62%", delay: 0.08, duration: 1.8, shape: "pixel" },
  { left: "78%", delay: 0.14, duration: 1.6, shape: "star" },
];

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
    viewBox="0 0 160 90"
    className={className}
    fill="none"
  >
    <rect
      x="6"
      y="6"
      width="148"
      height="78"
      rx="12"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      d="M24 60l16-30 16 20 14-16 18 24"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" viewBox="0 0 16 16" className={className} fill="none">
    <path d="M4 3l9 5-9 5V3Z" fill="currentColor" />
  </svg>
);

const VhsTape = ({
  className,
  label,
  sublabel,
  spinning,
  reduceMotion,
}: {
  className?: string;
  label: string;
  sublabel: string;
  spinning: boolean;
  reduceMotion: boolean;
}) => (
  <svg aria-hidden="true" viewBox="0 0 420 260" className={className} fill="none">
    <rect
      x="16"
      y="24"
      width="388"
      height="212"
      rx="26"
      fill="var(--tapeGray)"
      stroke="var(--ink)"
      strokeWidth="6"
    />
    <rect
      x="54"
      y="54"
      width="312"
      height="108"
      rx="14"
      fill="var(--bg)"
      stroke="var(--ink)"
      strokeWidth="4"
    />
    <rect
      x="70"
      y="70"
      width="280"
      height="76"
      rx="10"
      fill="var(--bg)"
      stroke="rgba(246,240,255,0.2)"
      strokeWidth="2"
    />
    <rect x="64" y="170" width="292" height="50" rx="12" fill="var(--ink)" opacity="0.15" />
    <rect x="84" y="182" width="252" height="28" rx="8" fill="var(--tapeGray)" />
    <g>
      <motion.g
        animate={reduceMotion || !spinning ? undefined : { rotate: 360 }}
        transition={
          reduceMotion || !spinning
            ? undefined
            : { duration: 2.4, ease: "linear", repeat: Infinity }
        }
        style={{ transformOrigin: "150px 106px" }}
      >
        <circle cx="150" cy="106" r="28" fill="var(--ink)" />
        <circle cx="150" cy="106" r="10" fill="var(--bg)" />
        <circle cx="150" cy="106" r="3" fill="var(--ink)" />
      </motion.g>
      <motion.g
        animate={reduceMotion || !spinning ? undefined : { rotate: -360 }}
        transition={
          reduceMotion || !spinning
            ? undefined
            : { duration: 2.4, ease: "linear", repeat: Infinity }
        }
        style={{ transformOrigin: "270px 106px" }}
      >
        <circle cx="270" cy="106" r="28" fill="var(--ink)" />
        <circle cx="270" cy="106" r="10" fill="var(--bg)" />
        <circle cx="270" cy="106" r="3" fill="var(--ink)" />
      </motion.g>
    </g>
    <rect x="88" y="184" width="246" height="24" rx="8" fill="var(--tapeGray)" />
    <rect x="88" y="184" width="246" height="24" rx="8" fill="url(#tapeGlow)" opacity="0.6" />
    <text
      x="110"
      y="202"
      fill="var(--bg)"
      fontFamily="var(--font-retro-mono)"
      fontSize="10"
      letterSpacing="2"
    >
      {label}
    </text>
    <text
      x="110"
      y="214"
      fill="var(--bg)"
      fontFamily="var(--font-retro-mono)"
      fontSize="10"
      letterSpacing="2"
      opacity="0.7"
    >
      {sublabel}
    </text>
    <rect x="62" y="58" width="300" height="10" rx="5" fill="rgba(255,255,255,0.08)" />
    <defs>
      <linearGradient id="tapeGlow" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
  </svg>
);

export default function RetroLoveVhsArcadePage() {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sceneRefs = useRef<Array<HTMLDivElement | null>>([]);
  const trackingHoldRef = useRef<number | null>(null);

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
  const [snapshotToast, setSnapshotToast] = useState(false);
  const [approved, setApproved] = useState(false);
  const [welcomeBack, setWelcomeBack] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [audioVisible, setAudioVisible] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [initialScene, setInitialScene] = useState<number | null>(null);
  const [maxUnlockedScene, setMaxUnlockedScene] = useState(0);
  const [startFlash, setStartFlash] = useState(false);
  const [endingFlash, setEndingFlash] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [sideB, setSideB] = useState(false);

  const confessionVariant =
    confessionTransitions[confessionIndex % confessionTransitions.length];

  const currentPhoto = content.photos[reelIndex] ?? content.photos[0];

  const hudTimecode =
    activeScene === 3
      ? currentPhoto?.timecode ?? sceneTimecodes[3]
      : sceneTimecodes[activeScene] ?? sceneTimecodes[0];

  const trackingDistance = Math.abs(tracking - trackingTarget);
  const trackingIntensity = signalLocked
    ? 0
    : Math.min(1, trackingDistance / trackingTolerance);
  const trackingBlur = trackingIntensity * 6;
  const trackingShift = (tracking - trackingTarget) * 0.18;
  const trackingNoise = 0.12 + trackingIntensity * 0.35;

  const reelProgress =
    content.photos.length > 1
      ? reelIndex / (content.photos.length - 1)
      : 0;

  const showAudioToggle = started || activeScene >= 2;
  const progressRatio = audioDuration
    ? Math.min(audioProgress / audioDuration, 1)
    : 0;

  const setSceneRef = (index: number) => (node: HTMLDivElement | null) => {
    sceneRefs.current[index] = node;
  };

  const scrollToScene = (index: number, allowLocked = false) => {
    if (!allowLocked && index > maxUnlockedScene) {
      return;
    }
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
    setStartFlash(true);
    setMaxUnlockedScene((prev) => Math.max(prev, 1));
    window.setTimeout(() => scrollToScene(1, true), 520);
    window.setTimeout(() => setBurstActive(false), 900);
    window.setTimeout(() => setStartFlash(false), 240);
  };

  const handleTrackingChange = (value: number) => {
    setTracking(value);
  };

  const handleConfessionAdvance = () => {
    if (confessionIndex >= content.confessionLines.length - 1) {
      scrollToScene(3, true);
      return;
    }
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
    const progress = Math.min(
      Math.max((clientX - rect.left) / rect.width, 0),
      1
    );
    const nextIndex = Math.round(progress * (content.photos.length - 1));
    setReelIndex(nextIndex);
  };

  const handleScrubStart = (event: PointerEvent<HTMLDivElement>) => {
    setScrubbing(true);
    updateScrub(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
    setMaxUnlockedScene((prev) => Math.max(prev, 4));
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
    setSnapshotToast(true);
    window.setTimeout(() => setFlashActive(false), 200);
    window.setTimeout(() => setSnapshotToast(false), 1200);
    setMaxUnlockedScene((prev) => Math.max(prev, 4));
  };

  const handleApprove = () => {
    if (approved) {
      return;
    }
    setApproved(true);
    setAudioVisible(true);
    setEndingFlash(true);
    if (!prefersReducedMotion) {
      setConfettiActive(true);
    }
    window.setTimeout(() => setEndingFlash(false), 240);
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
      setMaxUnlockedScene(4);
    }
    const parsedScene = storedScene ? Number(storedScene) : 0;
    const targetScene = approvedValue
      ? 4
      : Math.min(Math.max(parsedScene, 0), 4);
    setInitialScene(Number.isFinite(targetScene) ? targetScene : 0);
  }, []);

  useEffect(() => {
    if (initialScene === null) {
      return;
    }
    window.setTimeout(() => scrollToScene(initialScene, true), 120);
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
    const handleTime = () => {
      setAudioProgress(audio.currentTime);
      setAudioDuration(audio.duration || 0);
    };
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTime);
    audio.addEventListener("loadedmetadata", handleTime);
    return () => {
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTime);
      audio.removeEventListener("loadedmetadata", handleTime);
    };
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
      if (event.key === "ArrowLeft") {
        setReelIndex((prev) => Math.max(prev - 1, 0));
      }
      if (event.key === "ArrowRight") {
        setReelIndex((prev) =>
          Math.min(prev + 1, content.photos.length - 1)
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeScene]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }
    setTransitionKey((prev) => prev + 1);
  }, [activeScene, prefersReducedMotion]);

  useEffect(() => {
    if (signalLocked) {
      return;
    }
    const inRange = Math.abs(tracking - trackingTarget) <= trackingTolerance;
    if (inRange && !trackingHoldRef.current) {
      trackingHoldRef.current = window.setTimeout(() => {
        setSignalLocked(true);
        setMaxUnlockedScene((prev) => Math.max(prev, 2));
        scrollToScene(2, true);
      }, 600);
    }
    if (!inRange && trackingHoldRef.current) {
      window.clearTimeout(trackingHoldRef.current);
      trackingHoldRef.current = null;
    }
    return () => {
      if (trackingHoldRef.current) {
        window.clearTimeout(trackingHoldRef.current);
        trackingHoldRef.current = null;
      }
    };
  }, [tracking, signalLocked]);

  useEffect(() => {
    if (confessionIndex >= content.confessionLines.length - 1) {
      setMaxUnlockedScene((prev) => Math.max(prev, 3));
    }
  }, [confessionIndex]);

  useEffect(() => {
    if (activeScene >= 3 && maxUnlockedScene >= 3) {
      setMaxUnlockedScene((prev) => Math.max(prev, 4));
    }
  }, [activeScene, maxUnlockedScene]);

  const handleProgressJump = (index: number) => {
    if (index > maxUnlockedScene) {
      return;
    }
    scrollToScene(index, true);
  };

  const handleSeek = (event: PointerEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audioDuration) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const progress = Math.min(
      Math.max((event.clientX - rect.left) / rect.width, 0),
      1
    );
    audio.currentTime = progress * audioDuration;
    setAudioProgress(audio.currentTime);
  };

  return (
    <main
      className={`${displayFont.variable} ${monoFont.variable} ${bodyFont.variable} relative bg-[color:var(--bg)] text-[color:var(--ink)]`}
      style={theme}
    >
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 vhs-bloom" />
        {!prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 vhs-bloom-motion"
            animate={{
              opacity: [0.35, 0.5, 0.35],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div className="absolute inset-0 vhs-banding" />
        <div className="absolute inset-0 vhs-noise" />
        <div className="absolute inset-0 vhs-vignette" />
        <div className="absolute inset-0 vhs-scanlines" />
        {!prefersReducedMotion && (
          <motion.div
            className="absolute left-0 right-0 h-12 vhs-tracking"
            animate={{ y: ["-20%", "120%"] }}
            transition={{
              duration: 1.6,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: 14,
            }}
          />
        )}
      </div>

      <AnimatePresence>
        {!prefersReducedMotion && transitionKey > 0 && (
          <motion.div
            key={`transition-${transitionKey}`}
            className="pointer-events-none fixed inset-0 z-30 vhs-transition"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 1, 0] }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />
        )}
      </AnimatePresence>

      {(startFlash || endingFlash) && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-40 bg-[color:var(--ink)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <div className="fixed left-4 top-4 z-40 flex flex-wrap items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--ink)]">
        <span className="vhs-chip">TAPE: SIDE A</span>
        <span className="vhs-chip">{hudTimecode}</span>
        <span className="vhs-chip">
          SCENE {activeScene + 1}/{sceneCount}
        </span>
      </div>

      <AnimatePresence>
        {snapshotToast && (
          <motion.div
            className="fixed left-4 top-16 z-40 vhs-toast"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            SNAPSHOT SAVED
          </motion.div>
        )}
      </AnimatePresence>

      {showAudioToggle && (
        <button
          type="button"
          onClick={() => setAudioVisible((prev) => !prev)}
          aria-label="Toggle audio"
          aria-pressed={audioVisible}
          className="fixed right-4 top-4 z-40 vhs-chip vhs-chip-action"
        >
          AUDIO
        </button>
      )}

      <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2">
        {Array.from({ length: sceneCount }).map((_, index) => {
          const isActive = index === activeScene;
          const isLocked = index > maxUnlockedScene;
          return (
            <button
              key={`scene-${index}`}
              type="button"
              onClick={() => handleProgressJump(index)}
              className={`h-3 w-3 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neonCyan)] ${
                isActive
                  ? "border-[color:var(--neonCyan)] bg-[color:var(--neonCyan)]"
                  : "border-[color:var(--ink)]/40 bg-transparent"
              } ${isLocked ? "opacity-40" : "hover:border-[color:var(--neonPink)]"}`}
              aria-label={`Go to scene ${index + 1}`}
              aria-disabled={isLocked}
              disabled={isLocked}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {!hasInteracted && (
          <motion.div
            className="fixed bottom-6 right-6 z-40 vhs-chip"
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
        className={`relative z-10 h-screen overflow-y-auto snap-y snap-mandatory ${
          prefersReducedMotion ? "" : "scroll-smooth"
        }`}
      >
        <section
          ref={setSceneRef(0)}
          data-scene="0"
          className="relative flex h-screen snap-start items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-10 rounded-[2.5rem] border border-[color:var(--neonCyan)]/30 shadow-[0_0_60px_rgba(45,255,243,0.2)]" />
          <div className="absolute inset-16 rounded-[2rem] border border-[color:var(--neonPink)]/20" />
          <div className="absolute right-20 top-20 vhs-chip">CREDIT 01</div>
          <div className="relative z-10 flex max-w-4xl flex-col items-center gap-6 px-6 text-center">
            <motion.h1
              className="vhs-title text-6xl font-[var(--font-retro-display)] uppercase tracking-[0.25em] sm:text-8xl"
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      textShadow: [
                        "0 0 16px rgba(255,59,212,0.6)",
                        "0 0 22px rgba(45,255,243,0.6)",
                        "0 0 16px rgba(255,233,74,0.5)",
                      ],
                    }
              }
              transition={{ duration: 2.6, repeat: Infinity }}
            >
              RETRO LOVE
            </motion.h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[color:var(--neonYellow)]">
              {content.title}
            </p>
            <motion.button
              type="button"
              onClick={handleStart}
              className="vhs-button vhs-button-hot"
              whileTap={{ scale: 0.96 }}
              whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
              animate={
                prefersReducedMotion
                  ? undefined
                  : { opacity: [0.5, 1, 0.5], x: [0, 1, -1, 0] }
              }
              transition={{ duration: 1.1, repeat: Infinity }}
            >
              PRESS START
            </motion.button>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--neonCyan)]">
              {content.subtitle}
            </p>
          </div>
          {!prefersReducedMotion && (
            <div className="absolute inset-0 pointer-events-none">
              {pixelHearts.map((heart, index) => (
                <motion.div
                  key={`${heart.left}-${index}`}
                  className="absolute bottom-10 text-[color:var(--neonPink)]"
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
                    className="absolute h-3 w-3 bg-[color:var(--neonYellow)]"
                    style={{ top: burst.top, left: burst.left }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.6, delay: burst.delay }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--ink)]/70"
            animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            Scroll
          </motion.div>
        </section>

        <section
          ref={setSceneRef(1)}
          data-scene="1"
          className="relative flex h-screen snap-start items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(45,255,243,0.18),_transparent_60%)]" />
          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 px-6 text-center">
            <h2 className="vhs-title text-4xl font-[var(--font-retro-display)] uppercase tracking-[0.35em] sm:text-6xl">
              VHS Tape Loader
            </h2>
            <div
              className="relative w-full max-w-4xl"
              style={{
                filter: `blur(${trackingBlur}px)`,
                transform: `translateY(${trackingShift}px)`,
              }}
            >
              <VhsTape
                className="h-auto w-full"
                label={content.recipientName}
                sublabel={content.tagline}
                spinning={signalLocked}
                reduceMotion={!!prefersReducedMotion}
              />
              {!signalLocked && (
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(9,0,15,0.6), rgba(9,0,15,0.2), rgba(9,0,15,0.6))",
                    opacity: trackingNoise,
                  }}
                />
              )}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
                  opacity: trackingNoise,
                }}
              />
            </div>
            <div className="flex w-full max-w-xl flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.3em]">
                <span className="text-[color:var(--neonCyan)]">Tracking</span>
                <span>{signalLocked ? "SIGNAL LOCKED" : "ADJUST"}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={tracking}
                onChange={(event) =>
                  handleTrackingChange(Number(event.target.value))
                }
                aria-label="Tracking slider"
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[color:var(--ink)]/20 accent-[color:var(--neonCyan)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neonCyan)]"
              />
              <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--ink)]/70">
                Tune it till it feels right.
              </p>
              <AnimatePresence>
                {signalLocked && (
                  <motion.div
                    className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--neonCyan)]"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                  >
                    SIGNAL LOCKED
                    <ApprovedStamp className="h-6 w-12" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--ink)]/70"
            animate={prefersReducedMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            Scroll
          </motion.div>
        </section>
        <section
          ref={setSceneRef(2)}
          data-scene="2"
          className="relative flex h-screen snap-start items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 vhs-confession-bg" />
          {!signalLocked && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[color:var(--bg)]/80 text-center text-xs font-semibold uppercase tracking-[0.4em] text-[color:var(--neonCyan)]">
              SIGNAL NOT LOCKED
            </div>
          )}
          <div
            className={`relative z-10 flex w-full max-w-5xl flex-col items-center gap-10 px-6 text-center ${
              signalLocked ? "" : "pointer-events-none blur-sm"
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[color:var(--neonCyan)]">
              The confession
            </p>
            <div className="relative w-full rounded-[2.5rem] border border-[color:var(--ink)]/20 bg-[color:var(--bg)]/60 px-6 py-14 shadow-[0_0_40px_rgba(255,59,212,0.15)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={confessionIndex}
                  className="vhs-title text-5xl font-[var(--font-retro-display)] uppercase tracking-[0.25em] sm:text-7xl"
                  initial={confessionVariant.initial}
                  animate={confessionVariant.animate}
                  exit={confessionVariant.exit}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
                >
                  {content.confessionLines[confessionIndex]}
                </motion.div>
              </AnimatePresence>
              {!prefersReducedMotion && (
                <motion.div
                  key={`confession-glow-${confessionIndex}`}
                  className="pointer-events-none absolute inset-0 vhs-spotlight"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-[color:var(--neonYellow)]">
              Tap to advance
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <motion.button
                type="button"
                onClick={handleConfessionAdvance}
                className="vhs-button vhs-button-outline"
                whileTap={{ scale: 0.96 }}
              >
                Next line
              </motion.button>
              <button
                type="button"
                onClick={handleRewind}
                className="vhs-chip vhs-chip-action"
              >
                Rewind
              </button>
            </div>
          </div>
        </section>

        <section
          ref={setSceneRef(3)}
          data-scene="3"
          className="relative flex h-screen snap-start items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,255,243,0.15),_transparent_60%)]" />
          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 px-6">
            <div className="flex w-full max-w-5xl items-center justify-between text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--neonCyan)]">
              <span>MEMORY REEL</span>
              <button
                type="button"
                onClick={handleFreezeFrame}
                className="vhs-chip vhs-chip-action"
              >
                Freeze Frame
              </button>
            </div>
            <div className="relative flex h-[60vh] w-full max-w-5xl items-center justify-center overflow-hidden rounded-[2rem] border border-[color:var(--ink)]/30 bg-[color:var(--bg)]/50 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPhoto?.src}
                  src={currentPhoto?.src}
                  alt={currentPhoto?.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute inset-0 vhs-frame" />
              <div className="absolute left-6 top-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--ink)]">
                <PlayIcon className="h-3 w-3 text-[color:var(--neonCyan)]" />
                PLAY
                <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-[color:var(--hotRed)] shadow-[0_0_8px_rgba(255,46,46,0.8)]" />
                REC
              </div>
              <div className="absolute right-6 top-6 text-[10px] font-semibold uppercase tracking-[0.4em] text-[color:var(--ink)]">
                {currentPhoto?.timecode}
              </div>
              <AnimatePresence>
                {flashActive && (
                  <motion.div
                    className="absolute inset-0 bg-[color:var(--ink)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.85 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhoto?.caption}
                  className="absolute bottom-6 left-6 vhs-caption"
                  initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
                  animate={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                  exit={{ opacity: 0, clipPath: "inset(0 0 0 100%)" }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.35 }}
                >
                  {currentPhoto?.caption}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex w-full max-w-5xl flex-col gap-4">
              <div
                ref={timelineRef}
                role="slider"
                tabIndex={0}
                aria-label="Photo reel scrubber"
                className="relative h-14 w-full cursor-ew-resize rounded-full border border-[color:var(--ink)]/30 bg-[color:var(--bg)]/70"
                onPointerDown={handleScrubStart}
                onPointerMove={handleScrubMove}
                onPointerUp={handleScrubEnd}
                onPointerLeave={handleScrubEnd}
              >
                <div className="absolute inset-x-6 top-1/2 h-[2px] -translate-y-1/2 bg-[color:var(--ink)]/30" />
                {content.photos.map((photo, index) => {
                  const isActive = index === reelIndex;
                  return (
                    <div
                      key={photo.timecode}
                      className={`absolute top-1/2 -translate-y-1/2 text-[9px] font-semibold uppercase tracking-[0.3em] ${
                        isActive
                          ? "text-[color:var(--neonCyan)]"
                          : "text-[color:var(--ink)]/70"
                      }`}
                      style={{
                        left: `${(index / (content.photos.length - 1)) * 100}%`,
                      }}
                    >
                      <span
                        className={`block h-3 w-[2px] ${
                          isActive
                            ? "bg-[color:var(--neonCyan)]"
                            : "bg-[color:var(--ink)]/60"
                        }`}
                      />
                      <span className="mt-2 block">{photo.timecode}</span>
                    </div>
                  );
                })}
                <div
                  className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[color:var(--neonCyan)] bg-[color:var(--bg)] shadow-[0_0_14px_rgba(45,255,243,0.9)]"
                  style={{ left: `${reelProgress * 100}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.4em]">
                <span className="text-[color:var(--neonCyan)]">
                  Drag to scrub
                </span>
                <span className="text-[color:var(--ink)]/70">
                  Arrow keys supported
                </span>
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
            {welcomeBack && <div className="vhs-chip">WELCOME BACK</div>}
            <h2 className="vhs-title text-4xl font-[var(--font-retro-display)] uppercase tracking-[0.3em] sm:text-6xl">
              {content.ending.headline}
            </h2>
            <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[color:var(--neonCyan)]">
              Choose your ending
            </p>
            <div className="flex flex-col gap-6 sm:flex-row">
              <motion.button
                type="button"
                onClick={handleApprove}
                className="vhs-button vhs-button-hot"
                whileTap={{ scale: 0.96 }}
              >
                YES
              </motion.button>
              <motion.button
                type="button"
                onClick={handleApprove}
                className="vhs-button vhs-button-bright"
                whileTap={{ scale: 0.96 }}
              >
                YES (LOUDER)
              </motion.button>
            </div>

            <AnimatePresence>
              {approved && (
                <motion.div
                  className="flex flex-col items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
                >
                  <motion.div
                    className="text-[color:var(--hotRed)]"
                    initial={{ scale: 0.6, rotate: -8 }}
                    animate={{ scale: 1, rotate: -6 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                  >
                    <ApprovedStamp className="h-20 w-40" />
                  </motion.div>
                  <p className="max-w-2xl text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]">
                    {content.loveNote}
                  </p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.45em] text-[color:var(--neonYellow)]">
                    {content.ending.finalLine}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {approved && audioVisible && (
                <motion.div
                  className="flex w-full max-w-md flex-col gap-4 rounded-[2rem] border border-[color:var(--ink)]/40 bg-[color:var(--bg)]/70 p-5"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.3em] text-[color:var(--neonCyan)]">
                    <span>{content.audio.title}</span>
                    <button
                      type="button"
                      onClick={() => setSideB((prev) => !prev)}
                      className="vhs-chip vhs-chip-action"
                    >
                      {sideB ? "Side B" : "Side A"}
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setAudioPlaying((prev) => !prev)}
                      className="vhs-chip vhs-chip-action"
                    >
                      {audioPlaying ? "Pause" : "Play"}
                    </button>
                    <div className="flex-1">
                      <div
                        className="relative h-2 w-full cursor-pointer rounded-full bg-[color:var(--ink)]/20"
                        onPointerDown={handleSeek}
                      >
                        <div
                          className="absolute left-0 top-0 h-full rounded-full bg-[color:var(--neonPink)]"
                          style={{ width: `${progressRatio * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[color:var(--ink)]/70">
                    {sideB
                      ? `${content.audio.title} - Side B`
                      : `${content.audio.title} - ${content.audio.artist}`}
                  </div>
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
                      piece.shape === "star"
                        ? "vhs-confetti-star"
                        : piece.shape === "dot"
                          ? "vhs-confetti-dot"
                          : "vhs-confetti-pixel"
                    }`}
                    style={{ left: piece.left }}
                    initial={{ y: 0, opacity: 0.9, rotate: 0 }}
                    animate={{ y: "220%", opacity: 0, rotate: 180 }}
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
        .vhs-title {
          text-shadow: 2px 0 var(--neonPink), -2px 0 var(--neonCyan);
        }

        .vhs-chip {
          border: 1px solid rgba(246, 240, 255, 0.4);
          border-radius: 999px;
          padding: 0.35rem 0.75rem;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          font-family: var(--font-retro-mono);
          background: rgba(9, 0, 15, 0.55);
          box-shadow: 0 0 16px rgba(45, 255, 243, 0.2);
        }

        .vhs-chip-action {
          border-color: rgba(45, 255, 243, 0.6);
          color: var(--neonCyan);
        }

        .vhs-button {
          padding: 0.9rem 2.2rem;
          border-radius: 999px;
          border: 2px solid var(--ink);
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.35em;
          font-size: 12px;
          box-shadow: 0 0 24px rgba(255, 59, 212, 0.3);
          font-family: var(--font-retro-mono);
        }

        .vhs-button:focus-visible,
        .vhs-chip:focus-visible {
          outline: 2px solid var(--neonCyan);
          outline-offset: 2px;
        }

        .vhs-button-hot {
          background: var(--hotRed);
          color: var(--ink);
          box-shadow: 0 0 26px rgba(255, 46, 46, 0.6);
        }

        .vhs-button-bright {
          background: var(--neonYellow);
          color: #120015;
          box-shadow: 0 0 26px rgba(255, 233, 74, 0.6);
        }

        .vhs-button-outline {
          background: rgba(9, 0, 15, 0.6);
          border-color: rgba(246, 240, 255, 0.5);
          color: var(--ink);
        }

        .vhs-bloom {
          background: radial-gradient(
              circle at top,
              rgba(255, 59, 212, 0.18),
              transparent 55%
            ),
            radial-gradient(
              circle at bottom,
              rgba(45, 255, 243, 0.12),
              transparent 60%
            );
          opacity: 0.5;
        }

        .vhs-bloom-motion {
          background: radial-gradient(
              circle at 30% 20%,
              rgba(255, 59, 212, 0.25),
              transparent 55%
            ),
            radial-gradient(
              circle at 70% 80%,
              rgba(45, 255, 243, 0.18),
              transparent 60%
            );
        }

        .vhs-noise {
          background-image: radial-gradient(
              rgba(255, 255, 255, 0.06) 1px,
              transparent 0
            ),
            radial-gradient(rgba(0, 0, 0, 0.4) 1px, transparent 0);
          background-size: 3px 3px, 6px 6px;
          mix-blend-mode: screen;
          opacity: 0.25;
        }

        .vhs-vignette {
          background: radial-gradient(
            circle,
            transparent 45%,
            rgba(0, 0, 0, 0.7)
          );
        }

        .vhs-scanlines {
          background-image: repeating-linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0) 0,
            rgba(0, 0, 0, 0) 2px,
            rgba(0, 0, 0, 0.3) 3px
          );
          opacity: 0.4;
          mix-blend-mode: overlay;
        }

        .vhs-banding {
          background: repeating-linear-gradient(
            0deg,
            rgba(255, 255, 255, 0.03) 0,
            rgba(255, 255, 255, 0.03) 10px,
            rgba(0, 0, 0, 0.12) 20px
          );
          opacity: 0.4;
        }

        .vhs-tracking {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(246, 240, 255, 0.2),
            transparent
          );
          opacity: 0.3;
        }

        .vhs-transition {
          background: linear-gradient(
            180deg,
            rgba(9, 0, 15, 0.9),
            rgba(255, 59, 212, 0.2),
            rgba(9, 0, 15, 0.9)
          );
          mix-blend-mode: screen;
        }

        .vhs-toast {
          border: 1px solid rgba(45, 255, 243, 0.6);
          border-radius: 999px;
          padding: 0.35rem 0.75rem;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-family: var(--font-retro-mono);
          background: rgba(9, 0, 15, 0.7);
          color: var(--neonCyan);
        }

        .vhs-confession-bg {
          background: radial-gradient(
              circle at center,
              rgba(255, 233, 74, 0.1),
              transparent 60%
            ),
            repeating-linear-gradient(
              to bottom,
              rgba(255, 255, 255, 0.03) 0,
              rgba(255, 255, 255, 0.03) 12px,
              rgba(0, 0, 0, 0.25) 20px
            );
        }

        .vhs-spotlight {
          background: radial-gradient(
            circle at center,
            rgba(255, 59, 212, 0.2),
            transparent 60%
          );
        }

        .vhs-frame {
          box-shadow: inset 0 0 80px rgba(0, 0, 0, 0.65);
          border: 1px solid rgba(246, 240, 255, 0.2);
        }

        .vhs-caption {
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          border: 1px solid rgba(246, 240, 255, 0.4);
          background: rgba(9, 0, 15, 0.7);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          font-family: var(--font-retro-mono);
        }

        .vhs-confetti-pixel {
          width: 10px;
          height: 10px;
          background: var(--neonYellow);
        }

        .vhs-confetti-star {
          width: 12px;
          height: 12px;
          background: var(--neonPink);
          clip-path: polygon(
            50% 0%,
            60% 35%,
            100% 35%,
            68% 55%,
            80% 100%,
            50% 70%,
            20% 100%,
            32% 55%,
            0 35%,
            40% 35%
          );
        }

        .vhs-confetti-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: var(--neonCyan);
        }

        @media (prefers-reduced-motion: reduce) {
          .vhs-tracking,
          .vhs-scanlines,
          .vhs-bloom-motion {
            display: none;
          }
        }
      `}</style>
    </main>
  );
}
