"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";
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

type HeartTrail = {
  id: number;
  x: number;
  y: number;
};

const rootStyle = {
  "--cc-base": "#fbf6ef",
  "--cc-blush": "#f3c6cf",
  "--cc-gold": "#d6b27c",
  "--cc-ink": "#1f2933",
  "--cc-sage": "#b7c7b0",
} as CSSProperties;

const couponKinds = ["snack", "hug", "playlist", "kiss"] as const;

const CouponIcon = ({ type }: { type: (typeof couponKinds)[number] }) => {
  switch (type) {
    case "snack":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 8h14l-1 10H6L5 8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M8 6h8"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "hug":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M8 9c0-2 1.8-3 4-3s4 1 4 3-1.8 3-4 3-4-1-4-3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M4 18c2-4 6-5 8-5s6 1 8 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "playlist":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 7h8M6 11h8M6 15h5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <circle
            cx="18"
            cy="15"
            r="2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      );
    case "kiss":
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M7 12c0-2 2-3 5-3s5 1 5 3-2 3-5 3-5-1-5-3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M9 12h6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
  }
};

const menuIcons = ["wine", "candle", "moon", "dessert"] as const;

const MenuIcon = ({ type }: { type: (typeof menuIcons)[number] }) => {
  switch (type) {
    case "wine":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M8 4h8v4a4 4 0 0 1-8 0V4Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M12 12v6m-3 2h6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "candle":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 4c1 1 2 2 2 3a2 2 0 0 1-4 0c0-1 1-2 2-3Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M9 10h6v8H9v-8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      );
    case "moon":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M15 4a7 7 0 1 0 5 12 7.5 7.5 0 0 1-5-12Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
      );
    case "dessert":
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 10h12l-2 8H8l-2-8Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M9 6h6"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
  }
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
    <div className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/90 px-4 py-2 text-[color:var(--cc-ink)] shadow-[0_18px_40px_-28px_rgba(83,64,51,0.35)] ring-1 ring-[color:rgba(214,178,124,0.4)] backdrop-blur">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isPlaying}
        className="rounded-full bg-[color:var(--cc-blush)] px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[color:var(--cc-ink)] shadow-[0_12px_26px_-18px_rgba(214,178,124,0.7)] ring-1 ring-white/80 transition hover:-translate-y-0.5 hover:bg-[color:var(--cc-gold)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--cc-gold)]"
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
  const captionFallbacks = moments.slice(0, photos.length);
  const photoCaptions = photos.map((photo, index) => {
    const caption = photo.caption?.trim();
    if (caption) {
      return caption;
    }
    return captionFallbacks[index] ?? "";
  });
  const perkCards = doc.perkCards.filter(
    (perk) => perk.title.trim().length > 0 || perk.body.trim().length > 0
  );
  const sparkleWords = doc.swoonTags.filter((tag) => tag.trim().length > 0);
  const tempLabels = sparkleWords.length
    ? sparkleWords
    : ["sweet", "warm", "glowing", "obsessed"];
  const datePlanSteps = doc.datePlanSteps.filter(
    (step) => step.title.trim().length > 0 || step.body.trim().length > 0
  );
  const promiseItems = doc.promiseItems.filter(
    (item) => item.trim().length > 0
  );
  const menuFallbacks = ["Starters", "Main", "Dessert", "Sweet finish"];
  const polaroidTilts = [-2, 1.5, -1.2, 2, -1.6, 1.2];
  const loveTempLabel =
    /swoon/i.test(doc.swoonLabel) || doc.swoonLabel.trim().length === 0
      ? "Love temperature"
      : doc.swoonLabel;
  const loveTempHeadline =
    /crush/i.test(doc.swoonHeadline) || doc.swoonHeadline.trim().length === 0
      ? "Love level: glowing"
      : doc.swoonHeadline;
  const loveTempBody =
    doc.swoonBody.trim().length > 0
      ? doc.swoonBody
      : "Soft, steady, and sweet in all the right places.";
  const dateMenuTitle =
    /plan/i.test(doc.datePlanTitle) || doc.datePlanTitle.trim().length === 0
      ? "Tonight's menu"
      : doc.datePlanTitle;
  const promiseTitle =
    /tiny promises/i.test(doc.promiseTitle) || doc.promiseTitle.trim().length === 0
      ? "Promise notes"
      : doc.promiseTitle;
  const loveNotePreview = doc.loveNote.trim();
  const envelopePreview =
    loveNotePreview.length > 0
      ? loveNotePreview.length > 100
        ? `${loveNotePreview.slice(0, 100)}...`
        : loveNotePreview
      : "A letter tucked inside, waiting for your yes.";
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [tempActive, setTempActive] = useState(false);
  const [heartTrails, setHeartTrails] = useState<HeartTrail[]>([]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const lastHeartTime = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tempRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setReduceMotion(media.matches);
    handleChange();
    if (media.addEventListener) {
      media.addEventListener("change", handleChange);
    } else {
      media.addListener(handleChange);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", handleChange);
      } else {
        media.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const target = tempRef.current;
    if (!target) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTempActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (isPhone || reduceMotion) {
      return;
    }
    if (typeof window !== "undefined") {
      const pointerFine = window.matchMedia("(pointer: fine)");
      if (!pointerFine.matches) {
        return;
      }
    }
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const now = Date.now();
    if (now - lastHeartTime.current < 800) {
      return;
    }
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      return;
    }
    const id = now;
    lastHeartTime.current = now;
    setHeartTrails((prev) => [...prev, { id, x, y }]);
    window.setTimeout(() => {
      setHeartTrails((prev) => prev.filter((heart) => heart.id !== id));
    }, 1400);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`preview-body ${fontStyleClass} cc-stationery relative w-full overflow-hidden ${containerRadius} ${containerHeight} ${containerShadow}`}
      style={{ fontFamily: "var(--preview-body)", ...rootStyle }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="cc-paper-grain absolute inset-0" />
        <div className={`absolute inset-0 ${backgroundOverlayClass}`} />
        <div className="cc-stitch absolute inset-6 rounded-[2.25rem]" />
        <div className="cc-ink-lines absolute inset-8 rounded-[2rem]" />
        <div className="cc-flower cc-flower-top-left" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none">
            <path
              d="M20 92C32 70 50 58 76 52C90 50 100 44 108 34"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M34 94C38 76 48 64 64 56C78 50 92 42 98 30"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M32 68C30 60 34 54 40 52C46 50 52 54 54 60C56 66 52 72 46 74C40 76 34 72 32 68Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M72 46C70 40 74 34 80 32C86 30 92 34 94 40C96 46 92 52 86 54C80 56 74 52 72 46Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </div>
        <div className="cc-flower cc-flower-bottom-right" aria-hidden="true">
          <svg viewBox="0 0 120 120" fill="none">
            <path
              d="M100 28C88 50 70 62 44 68C30 70 20 76 12 86"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M86 26C82 44 72 56 56 64C42 70 28 78 22 90"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M88 52C90 60 86 66 80 68C74 70 68 66 66 60C64 54 68 48 74 46C80 44 86 48 88 52Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M48 74C50 80 46 86 40 88C34 90 28 86 26 80C24 74 28 68 34 66C40 64 46 68 48 74Z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </div>
        <span className="cc-emboss cc-emboss-top" aria-hidden="true" />
        <span className="cc-emboss cc-emboss-bottom" aria-hidden="true" />
      </div>
      <div className="pointer-events-none absolute inset-0">
        {heartTrails.map((heart) => (
          <span
            key={heart.id}
            className="cc-heart-trail"
            style={{ left: heart.x, top: heart.y }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 20s-6-4.6-8.4-7.3C1.2 10.2 2 6.7 5.2 5.6c2.1-.8 4.1.2 5.2 1.8 1.1-1.6 3.1-2.6 5.2-1.8 3.2 1.1 4 4.6 1.6 7.1C18 15.4 12 20 12 20Z" />
            </svg>
          </span>
        ))}
      </div>

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
        <header className="text-center text-[color:var(--cc-ink)]">
          {showTagline ? (
            <div className="mx-auto inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[color:var(--cc-ink)] shadow-soft">
              <span className="h-2 w-2 rounded-full bg-[color:var(--cc-blush)]" />
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

        <div className="cc-ribbon my-2" aria-hidden="true">
          <span />
          <span className="cc-ribbon-bow" />
          <span />
        </div>

        <section className="flex flex-col items-center gap-4 text-center">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.4em] text-[color:var(--cc-gold)]">
            Envelope reveal
          </p>
          <button
            type="button"
            onClick={() => setIsEnvelopeOpen((prev) => !prev)}
            aria-pressed={isEnvelopeOpen}
            className="cc-envelope-button"
          >
            <span className="sr-only">Open envelope</span>
            <div className={`cc-envelope ${isEnvelopeOpen ? "is-open" : ""}`}>
              <div className="cc-envelope-body" />
              <div className="cc-envelope-flap" />
              <div className="cc-envelope-seal">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 20s-6-4.6-8.4-7.3C1.2 10.2 2 6.7 5.2 5.6c2.1-.8 4.1.2 5.2 1.8 1.1-1.6 3.1-2.6 5.2-1.8 3.2 1.1 4 4.6 1.6 7.1C18 15.4 12 20 12 20Z" />
                </svg>
              </div>
              <div className="cc-envelope-card">
                <span className="text-[0.55rem] font-semibold uppercase tracking-[0.35em] text-[color:var(--cc-gold)]">
                  The answer
                </span>
                <span className="preview-heading text-3xl text-[color:var(--cc-ink)]">
                  YES
                </span>
                <span className="cc-envelope-preview text-xs text-slate-600">
                  {envelopePreview}
                </span>
              </div>
            </div>
          </button>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
            <span className="rounded-full border border-white/80 bg-white/90 px-3 py-2">
              Open me
            </span>
            <span className="rounded-full border border-white/80 bg-white/90 px-3 py-2 text-[color:var(--cc-gold)]">
              Wax seal
            </span>
          </div>
        </section>

        <section className="grid items-start gap-6 lg:grid-cols-[1.05fr_1fr]">
          <div
            ref={tempRef}
            className="relative overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/90 p-6 text-left shadow-soft"
          >
            <span className="cc-heart-pin" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--cc-gold)]">
              {loveTempLabel}
            </p>
            <h3 className="preview-heading mt-3 text-2xl text-[color:var(--cc-ink)] md:text-3xl">
              {loveTempHeadline}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{loveTempBody}</p>
            <div className="cc-thermo mt-5">
              <div
                className={`cc-thermo-fill ${
                  tempActive && !reduceMotion ? "is-active" : ""
                }`}
              >
                <span className="cc-thermo-spark" aria-hidden="true" />
              </div>
            </div>
            {tempLabels.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-[color:var(--cc-ink)]">
                {tempLabels.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className="rounded-full border border-white/80 bg-white/90 px-3 py-1"
                  >
                    {word}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--cc-gold)]">
              Valentine coupons
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {perkCards.map((perk, index) => {
                const icon =
                  couponKinds[index % couponKinds.length] ?? "snack";
                return (
                  <div key={`${perk.title}-${index}`} className="cc-coupon">
                    <span className="cc-coupon-stamp" aria-hidden="true">
                      Redeem
                    </span>
                    <div className="cc-coupon-icon">
                      <CouponIcon type={icon} />
                    </div>
                    {perk.title.trim().length > 0 ? (
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--cc-ink)]">
                        {perk.title}
                      </p>
                    ) : null}
                    {perk.body.trim().length > 0 ? (
                      <p className="mt-2 text-sm text-slate-600">
                        {perk.body}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <div className="cc-ribbon my-2" aria-hidden="true">
          <span />
          <span className="cc-ribbon-bow" />
          <span />
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-soft">
            <span className="cc-heart-pin" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--cc-gold)]">
              Date menu
            </p>
            <h3 className="preview-heading mt-2 text-2xl text-[color:var(--cc-ink)] md:text-3xl">
              {dateMenuTitle}
            </h3>
            {datePlanSteps.length > 0 ? (
              <div className="mt-5 space-y-3">
                {datePlanSteps.map((step, index) => {
                  const menuLabel =
                    step.title.trim().length > 0 &&
                    !/plan/i.test(step.title)
                      ? step.title
                      : menuFallbacks[index] ?? step.title;
                  const icon =
                    menuIcons[index % menuIcons.length] ?? "wine";
                  return (
                    <div key={`${step.title}-${index}`} className="cc-menu-item">
                      <div className="cc-menu-icon">
                        <MenuIcon type={icon} />
                      </div>
                      <div>
                        {menuLabel ? (
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--cc-ink)]">
                            {menuLabel}
                          </p>
                        ) : null}
                        {step.body.trim().length > 0 ? (
                          <p className="mt-2 text-sm text-slate-600">
                            {step.body}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-soft transition duration-300 hover:-translate-y-1">
            <span className="cc-heart-pin" aria-hidden="true" />
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--cc-gold)]">
              Vows, but cute
            </p>
            <h3 className="preview-heading mt-2 text-2xl text-[color:var(--cc-ink)] md:text-3xl">
              {promiseTitle}
            </h3>
            {promiseItems.length > 0 ? (
              <ul className="mt-5 grid gap-3 text-sm text-slate-700">
                {promiseItems.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="cc-note"
                    style={{ animationDelay: `${index * 0.12}s` }}
                  >
                    <span className="cc-note-pin" aria-hidden="true" />
                    <span className="cc-note-heart" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        <div className="cc-ribbon my-2" aria-hidden="true">
          <span />
          <span className="cc-ribbon-bow" />
          <span />
        </div>

        {orderedSections.map((section) => {
          if (section === "gallery") {
            return (
              <section key="gallery" className="relative space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="preview-heading text-2xl text-[color:var(--cc-ink)] md:text-3xl">
                    Polaroids on a string
                  </h2>
                  <span className="rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[color:var(--cc-gold)]">
                    Sweet memories
                  </span>
                </div>
                <div className="cc-string" aria-hidden="true" />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map((photo, index) => {
                    const tilt = polaroidTilts[index % polaroidTilts.length];
                    return (
                      <div
                        key={`${photo.id}-${index}`}
                        className="cc-polaroid"
                        style={
                          {
                            "--tilt": `${tilt}deg`,
                            animationDelay: `${index * 0.08}s`,
                          } as CSSProperties
                        }
                      >
                        <span className="cc-clip" aria-hidden="true" />
                        <div className="cc-polaroid-photo">
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
                        {photoCaptions[index] ? (
                          <div
                            className="mt-3 text-sm text-slate-600"
                            style={{ fontFamily: "var(--font-great-vibes)" }}
                          >
                            {photoCaptions[index]}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
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
                        className="cc-letter text-center"
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
                  <div className="cc-letter text-center">
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
              className="rounded-[2.5rem] border border-white/80 bg-white/90 p-8 shadow-soft"
            >
              <h2 className="preview-heading text-center text-2xl text-[color:var(--cc-ink)] md:text-3xl">
                {doc.momentsTitle}
              </h2>
              <ul className="mt-5 grid gap-3 text-sm text-slate-700 md:text-base">
                {moments.map((moment, index) => (
                  <li
                    key={`${moment}-${index}`}
                    className="cc-moment"
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
