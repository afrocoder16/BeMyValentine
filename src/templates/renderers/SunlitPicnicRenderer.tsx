"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  useEffect,
  useMemo,
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

type BasketItem = {
  id: string;
  label: string;
  detail?: string;
};

const DEFAULT_BASKET_HINT = "Pick a few items to personalize this map.";

const buildBasketLine = (label: string) => {
  const lower = label.toLowerCase();
  if (/(strawberry|berry)/.test(lower)) {
    return `Because you picked ${label}, I owe you a sweet surprise.`;
  }
  if (/blanket/.test(lower)) {
    return `Because you picked ${label}, the coziest spot is yours.`;
  }
  if (/(camera|photo)/.test(lower)) {
    return `Because you picked ${label}, we will collect moments.`;
  }
  if (/(playlist|music|song)/.test(lower)) {
    return `Because you picked ${label}, the soundtrack is ready.`;
  }
  if (/note/.test(lower)) {
    return `Because you picked ${label}, there is a secret line waiting.`;
  }
  return `Because you picked ${label}, I am smiling already.`;
};

export default function SunlitPicnicRenderer({
  doc,
  theme,
  mode,
  context = "builder",
}: TemplateRendererProps) {
  const prefersReducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
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

  const photos = doc.photos.length
    ? [...doc.photos].sort((a, b) => a.order - b.order)
    : Array.from({ length: 3 }, (_, index) => ({
        id: `placeholder-${index + 1}`,
        src: "",
        alt: undefined,
        order: index,
      }));
  const moments = doc.moments.filter((moment) => moment.trim().length > 0);
  const photoCaptions = photos.map((photo, index) => {
    const caption = photo.caption?.trim();
    if (caption) {
      return caption;
    }
    return moments[index] ?? `Moment ${index + 1}`;
  });
  const loveNotes =
    doc.loveNotes && doc.loveNotes.length > 0
      ? doc.loveNotes.filter((note) => note.trim().length > 0)
      : doc.loveNote
        ? [doc.loveNote]
        : [];
  const loveNoteTitles = loveNotes.map(
    (_, index) =>
      doc.loveNoteTitles?.[index]?.trim() ||
      (index === 0 ? "Sunset note" : "Extra note")
  );
  const perkCards = doc.perkCards.filter(
    (card) => card.title.trim().length > 0 || card.body.trim().length > 0
  );
  const promiseItems = doc.promiseItems.filter((item) => item.trim().length > 0);
  const datePlanSteps = doc.datePlanSteps.filter(
    (step) => step.title.trim().length > 0 || step.body.trim().length > 0
  );

  const basketItems = useMemo<BasketItem[]>(() => {
    const items = perkCards.map((card, index) => ({
      id: `basket-${index}`,
      label: card.title.trim() || `Item ${index + 1}`,
      detail: card.body.trim() || undefined,
    }));
    const extraLabel = doc.swoonTags[0]?.trim() || "Secret note";
    items.push({
      id: "basket-secret",
      label: extraLabel,
      detail: doc.swoonBody.trim() || "A handwritten surprise inside.",
    });
    return items.slice(0, 5);
  }, [perkCards, doc.swoonTags, doc.swoonBody]);

  const snackLabels = useMemo(() => {
    const labels = doc.swoonTags.filter((tag) => tag.trim().length > 0);
    if (labels.length >= 3) {
      return labels;
    }
    return ["Your favorite", "My favorite", "We both love", "Sweet extra"];
  }, [doc.swoonTags]);

  const [selectedBasket, setSelectedBasket] = useState<string[]>([]);
  const [ticketStamped, setTicketStamped] = useState(false);

  useEffect(() => {
    if (!doc.music?.url) {
      setIsPlaying(false);
      return;
    }
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
    }
    setIsPlaying(true);
  }, [doc.music?.url]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, [doc.music?.url]);

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

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = window.localStorage.getItem("sunlit-picnic-basket");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed)) {
          setSelectedBasket(parsed);
        }
      } catch {
        setSelectedBasket([]);
      }
    }
    const stamped = window.localStorage.getItem("sunlit-picnic-ticket") === "true";
    setTicketStamped(stamped);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(
      "sunlit-picnic-basket",
      JSON.stringify(selectedBasket)
    );
  }, [selectedBasket]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(
      "sunlit-picnic-ticket",
      ticketStamped ? "true" : "false"
    );
  }, [ticketStamped]);

  const selectedSet = useMemo(() => new Set(selectedBasket), [selectedBasket]);
  const toggleBasketItem = (id: string) => {
    setSelectedBasket((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        return Array.from(next);
      }
      if (next.size >= 5) {
        return prev;
      }
      next.add(id);
      return Array.from(next);
    });
  };

  const personalizedLines = basketItems
    .filter((item) => selectedSet.has(item.id))
    .map((item) => buildBasketLine(item.label))
    .slice(0, 3);

  const noteLines = useMemo(() => {
    const note = loveNotes[0] || "";
    if (!note) {
      return [];
    }
    return note
      .split(/(?<=[.!?])\s+/)
      .map((line) => line.trim())
      .filter(Boolean);
  }, [loveNotes]);

  const revealProps = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.35 },
        transition: { duration: 0.6, ease: "easeOut" },
      };

  const paletteStyle = {
    "--picnic-cream": "#FFF7E6",
    "--picnic-butter": "#F9E27D",
    "--picnic-tangerine": "#F7A35B",
    "--picnic-sky": "#A8D8F0",
    "--picnic-sage": "#B9C8A3",
    "--picnic-ink": "#2E2A24",
  } as CSSProperties;

  const showTagline = doc.tagline.trim().length > 0;
  const showSubtitle = doc.showSubtitle !== false && doc.subtitle.trim().length > 0;
  const orderedSections =
    doc.sectionOrder && doc.sectionOrder.length === 3
      ? doc.sectionOrder
      : ["gallery", "love-note", "moments"];

  return (
    <div
      className={`preview-body ${fontStyleClass} relative w-full overflow-hidden ${containerRadius} ${containerHeight} bg-[color:var(--picnic-cream)] ${containerShadow}`}
      style={{ fontFamily: "var(--preview-body)", ...paletteStyle }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 picnic-map" />
        <div className="absolute inset-0 picnic-grain" />
        <div className="absolute inset-0 picnic-bokeh" />
      </div>
      <div className={`absolute inset-0 ${backgroundOverlayClass}`} />

      {prefersReducedMotion ? null : (
        <>
          <motion.div
            className="picnic-cloud cloud-left"
            animate={{ x: [0, 24, 0], opacity: [0.7, 0.9, 0.7] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="picnic-cloud cloud-right"
            animate={{ x: [0, -18, 0], opacity: [0.6, 0.85, 0.6] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 pb-24 pt-16 md:px-12">
        <header className="relative space-y-6">
          {showTagline ? (
            <span className="picnic-label">{doc.tagline}</span>
          ) : null}
          <h1 className={`preview-heading ${titleSizeClass} text-[color:var(--picnic-ink)]`}>
            {doc.title}
          </h1>
          {showSubtitle ? (
            <p className="max-w-2xl text-sm text-[color:var(--picnic-ink)]/80 md:text-base">
              {doc.subtitle}
            </p>
          ) : null}
          {doc.music ? (
            <div className="flex flex-wrap items-center gap-3 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[color:var(--picnic-ink)]/80">
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                aria-pressed={isPlaying}
                className="rounded-full border border-[color:var(--picnic-ink)]/40 bg-[color:var(--picnic-butter)] px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.35em] text-[color:var(--picnic-ink)]"
              >
                {isPlaying ? "Pause" : "Play"}
              </button>
              <span>
                <span aria-hidden="true">&#9835;</span> {doc.music.name}
              </span>
              <audio ref={audioRef} src={doc.music.url} preload="metadata" />
            </div>
          ) : null}
          <div className="picnic-route-hint">
            Meet me here
          </div>
        </header>

        <motion.section className="picnic-stop" {...revealProps}>
          <div className="picnic-pin" aria-hidden="true" />
          <div className="picnic-card">
            <span className="picnic-label">Pack the basket</span>
            <h2 className="preview-heading text-2xl text-[color:var(--picnic-ink)] md:text-3xl">
              Pick your five
            </h2>
            <p className="mt-2 text-sm text-[color:var(--picnic-ink)]/70">
              {selectedBasket.length > 0
                ? `Selected ${selectedBasket.length} of 5 items.`
                : DEFAULT_BASKET_HINT}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {basketItems.map((item) => {
                const isSelected = selectedSet.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleBasketItem(item.id)}
                    aria-pressed={isSelected}
                    className={`picnic-item ${isSelected ? "is-selected" : ""}`}
                  >
                    <span className="picnic-item-title">{item.label}</span>
                    {item.detail ? (
                      <span className="picnic-item-detail">{item.detail}</span>
                    ) : null}
                    <span className="picnic-item-check">
                      {isSelected ? "Picked" : "Add"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {orderedSections.map((section) => {
          if (section === "gallery") {
            return (
              <motion.section key="gallery" className="picnic-stop" {...revealProps}>
                <div className="picnic-pin" aria-hidden="true" />
                <div className="picnic-card">
                  <span className="picnic-label">Trail moments</span>
                  <h2 className="preview-heading text-2xl text-[color:var(--picnic-ink)] md:text-3xl">
                    Postcards on a string
                  </h2>
                  <div className="picnic-string mt-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      {photos.slice(0, 3).map((photo, index) => (
                        <div
                          key={`${photo.id}-${index}`}
                          className={`picnic-postcard postcard-${index % 3}`}
                        >
                          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                            {photo.src ? (
                              <Image
                                src={photo.src}
                                alt={photo.alt ?? `Moment ${index + 1}`}
                                fill
                                sizes="(min-width: 1024px) 240px, (min-width: 640px) 45vw, 80vw"
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
                          <p className="mt-3 text-xs uppercase tracking-[0.3em] text-[color:var(--picnic-ink)]/70">
                            {photoCaptions[index]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.section>
            );
          }

          if (section === "love-note") {
            return (
              <motion.section key="love-note" className="picnic-stop" {...revealProps}>
                <div className="picnic-pin" aria-hidden="true" />
                <div className="picnic-card">
                  <span className="picnic-label">Sunset note</span>
                  <h2 className="preview-heading text-2xl text-[color:var(--picnic-ink)] md:text-3xl">
                    {loveNoteTitles[0] ?? "Sunset note"}
                  </h2>
                  {noteLines.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {noteLines.map((line, index) => (
                        <motion.p
                          key={`${line}-${index}`}
                          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.4 }}
                          transition={{ duration: 0.4, delay: index * 0.08 }}
                          className="text-sm text-[color:var(--picnic-ink)]/80 md:text-base"
                        >
                          {line}
                        </motion.p>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm text-[color:var(--picnic-ink)]/70">
                      Add a love note in the builder.
                    </p>
                  )}

                  <div className="mt-6 rounded-[1.5rem] border border-white/60 bg-white/70 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--picnic-ink)]/70">
                      Personalized
                    </p>
                    {personalizedLines.length > 0 ? (
                      <ul className="mt-3 space-y-2 text-sm text-[color:var(--picnic-ink)]/80">
                        {personalizedLines.map((line, index) => (
                          <li key={`${line}-${index}`}>{line}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-[color:var(--picnic-ink)]/60">
                        {DEFAULT_BASKET_HINT}
                      </p>
                    )}
                  </div>
                </div>
              </motion.section>
            );
          }

          return (
            <motion.section key="moments" className="picnic-stop" {...revealProps}>
              <div className="picnic-pin" aria-hidden="true" />
              <div className="picnic-card">
                <span className="picnic-label">Map notes</span>
                <h2 className="preview-heading text-2xl text-[color:var(--picnic-ink)] md:text-3xl">
                  {doc.momentsTitle}
                </h2>
                {moments.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    {moments.map((moment, index) => (
                      <div
                        key={`${moment}-${index}`}
                        className="picnic-note"
                      >
                        <span className="picnic-note-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-sm text-[color:var(--picnic-ink)]/80">
                          {moment}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[color:var(--picnic-ink)]/70">
                    Add map notes in the builder.
                  </p>
                )}
              </div>
            </motion.section>
          );
        })}

        <motion.section className="picnic-stop" {...revealProps}>
          <div className="picnic-pin" aria-hidden="true" />
          <div className="picnic-card">
            <span className="picnic-label">{doc.promiseTitle}</span>
            <h2 className="preview-heading text-2xl text-[color:var(--picnic-ink)] md:text-3xl">
              Our snack list
            </h2>
            {promiseItems.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {promiseItems.map((item, index) => (
                  <span key={`${item}-${index}`} className="picnic-tag">
                    <span className="picnic-tag-label">
                      {snackLabels[index % snackLabels.length]}
                    </span>
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-[color:var(--picnic-ink)]/70">
                Add snack notes in the builder.
              </p>
            )}
          </div>
        </motion.section>

        <motion.section className="picnic-stop" {...revealProps}>
          <div className="picnic-pin" aria-hidden="true" />
          <div className="picnic-card">
            <span className="picnic-label">{doc.swoonLabel || "Picnic ticket"}</span>
            <h2 className="preview-heading text-2xl text-[color:var(--picnic-ink)] md:text-3xl">
              Admit one: Sunlit Picnic
            </h2>
            <div className="picnic-ticket mt-6">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--picnic-ink)]/70">
                  Ticket holder
                </p>
                <p className="mt-2 text-base font-semibold text-[color:var(--picnic-ink)]">
                  {doc.swoonBody.trim().length > 0
                    ? doc.swoonBody
                    : "Bring your best smile."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTicketStamped(true)}
                className="picnic-stamp-btn"
              >
                {doc.swoonHeadline.trim().length > 0
                  ? doc.swoonHeadline
                  : "YES"}
              </button>
              {ticketStamped ? (
                <motion.div
                  className="picnic-stamp"
                  initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: -6, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Approved
                </motion.div>
              ) : null}
            </div>
            {ticketStamped ? (
              <div className="mt-6 rounded-[1.5rem] border border-white/70 bg-white/80 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--picnic-ink)]/70">
                  {doc.datePlanTitle}
                </p>
                {datePlanSteps.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-sm text-[color:var(--picnic-ink)]/80">
                    {datePlanSteps.map((step, index) => (
                      <li key={`${step.title}-${index}`}>
                        <span className="font-semibold">{step.title}:</span> {step.body}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-[color:var(--picnic-ink)]/70">
                    Add the next date idea in the builder.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </motion.section>
      </div>

      <style jsx global>{`
        .picnic-map {
          background-image: linear-gradient(
              120deg,
              rgba(255, 255, 255, 0.7) 0%,
              rgba(255, 255, 255, 0.3) 45%,
              rgba(255, 255, 255, 0.7) 100%
            ),
            linear-gradient(
              180deg,
              rgba(168, 216, 240, 0.4) 0%,
              rgba(255, 247, 230, 0.6) 35%,
              rgba(185, 200, 163, 0.45) 100%
            ),
            repeating-linear-gradient(
              90deg,
              rgba(46, 42, 36, 0.06) 0,
              rgba(46, 42, 36, 0.06) 1px,
              transparent 1px,
              transparent 90px
            ),
            repeating-linear-gradient(
              0deg,
              rgba(46, 42, 36, 0.05) 0,
              rgba(46, 42, 36, 0.05) 1px,
              transparent 1px,
              transparent 110px
            );
          opacity: 0.6;
        }

        .picnic-grain {
          background-image: linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.25),
              rgba(255, 255, 255, 0.25) 50%,
              transparent 50%,
              transparent 100%
            ),
            radial-gradient(circle, rgba(46, 42, 36, 0.08) 0%, transparent 70%);
          background-size: 4px 4px, 160px 160px;
          opacity: 0.2;
          mix-blend-mode: multiply;
        }

        .picnic-bokeh {
          background-image: radial-gradient(
              rgba(255, 255, 255, 0.35) 2px,
              transparent 2px
            ),
            radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 140px 140px, 220px 220px;
          opacity: 0.25;
        }

        .picnic-cloud {
          position: absolute;
          top: 8%;
          width: 200px;
          height: 90px;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.9), transparent 70%);
          filter: blur(2px);
          opacity: 0.6;
        }

        .cloud-left {
          left: 8%;
        }

        .cloud-right {
          right: 6%;
          top: 18%;
        }

        .picnic-label {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(46, 42, 36, 0.2);
          padding: 0.35rem 1rem;
          font-size: 0.6rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--picnic-ink);
        }

        .picnic-route-hint {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border-radius: 999px;
          border: 1px dashed rgba(46, 42, 36, 0.25);
          padding: 0.4rem 1.1rem;
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--picnic-ink);
          background: rgba(255, 255, 255, 0.6);
        }

        .picnic-stop {
          position: relative;
          padding-left: 2.5rem;
        }

        .picnic-stop::before {
          content: "";
          position: absolute;
          left: 0.7rem;
          top: 0.5rem;
          bottom: 0.5rem;
          width: 2px;
          background: repeating-linear-gradient(
            180deg,
            rgba(46, 42, 36, 0.2) 0,
            rgba(46, 42, 36, 0.2) 6px,
            transparent 6px,
            transparent 16px
          );
        }

        .picnic-pin {
          position: absolute;
          left: 0.15rem;
          top: 1.2rem;
          height: 20px;
          width: 20px;
          border-radius: 999px;
          border: 2px solid var(--picnic-tangerine);
          background: var(--picnic-cream);
          box-shadow: 0 6px 16px rgba(247, 163, 91, 0.35);
        }

        .picnic-card {
          border-radius: 2rem;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid rgba(46, 42, 36, 0.12);
          padding: 2rem;
          box-shadow: 0 30px 80px -55px rgba(46, 42, 36, 0.35);
        }

        .picnic-item {
          border-radius: 1.5rem;
          border: 1px solid rgba(46, 42, 36, 0.12);
          padding: 1rem;
          text-align: left;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .picnic-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 30px -22px rgba(46, 42, 36, 0.35);
        }

        .picnic-item.is-selected {
          border-color: rgba(247, 163, 91, 0.6);
          box-shadow: 0 20px 40px -28px rgba(247, 163, 91, 0.4);
        }

        .picnic-item-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--picnic-ink);
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .picnic-item-detail {
          font-size: 0.75rem;
          color: rgba(46, 42, 36, 0.7);
        }

        .picnic-item-check {
          margin-top: 0.4rem;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--picnic-tangerine);
        }

        .picnic-string {
          position: relative;
          padding-top: 1.5rem;
        }

        .picnic-string::before {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0.6rem;
          height: 2px;
          background: rgba(46, 42, 36, 0.2);
        }

        .picnic-postcard {
          border-radius: 1.8rem;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(46, 42, 36, 0.15);
          padding: 0.8rem;
          box-shadow: 0 25px 50px -38px rgba(46, 42, 36, 0.35);
        }

        .postcard-0 {
          transform: rotate(-2deg);
        }

        .postcard-1 {
          transform: rotate(1.5deg);
        }

        .postcard-2 {
          transform: rotate(-1deg);
        }

        .picnic-note {
          display: flex;
          align-items: center;
          gap: 1rem;
          border-radius: 1.4rem;
          background: rgba(255, 255, 255, 0.8);
          padding: 0.8rem 1rem;
          border: 1px dashed rgba(46, 42, 36, 0.2);
        }

        .picnic-note-index {
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: var(--picnic-tangerine);
        }

        .picnic-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          border-radius: 999px;
          border: 1px solid rgba(46, 42, 36, 0.2);
          padding: 0.4rem 0.9rem;
          background: rgba(255, 255, 255, 0.9);
          font-size: 0.75rem;
          color: var(--picnic-ink);
        }

        .picnic-tag-label {
          font-size: 0.55rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--picnic-tangerine);
        }

        .picnic-ticket {
          position: relative;
          display: grid;
          gap: 1.5rem;
          border-radius: 2rem;
          padding: 1.5rem;
          border: 1px dashed rgba(46, 42, 36, 0.3);
          background: rgba(255, 255, 255, 0.85);
        }

        .picnic-stamp-btn {
          align-self: flex-start;
          border-radius: 999px;
          border: 2px solid rgba(46, 42, 36, 0.2);
          padding: 0.6rem 1.4rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-weight: 600;
          background: var(--picnic-butter);
          color: var(--picnic-ink);
          box-shadow: 0 12px 30px -20px rgba(247, 163, 91, 0.6);
        }

        .picnic-stamp {
          position: absolute;
          right: 1.5rem;
          top: 1.5rem;
          padding: 0.4rem 0.9rem;
          border: 2px solid rgba(46, 42, 36, 0.3);
          border-radius: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 0.6rem;
          background: rgba(247, 163, 91, 0.18);
          color: var(--picnic-ink);
        }

        @media (min-width: 768px) {
          .picnic-stop {
            padding-left: 3.5rem;
          }
        }
      `}</style>
    </div>
  );
}
