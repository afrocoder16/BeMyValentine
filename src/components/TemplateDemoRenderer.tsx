"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Template } from "@/data/templates";
import { getDemoCopyByTemplateId } from "@/data/demoCopy";
import { buttonClasses } from "@/components/Button";

type TemplateDemoRendererProps = {
  template: Template;
};

type DemoImageProps = {
  src?: string;
  alt: string;
  gradient: string;
  sizes: string;
};

function DemoImage({ src, alt, gradient, sizes }: DemoImageProps) {
  const [showImage, setShowImage] = useState(Boolean(src));

  useEffect(() => {
    setShowImage(Boolean(src));
  }, [src]);

  if (!src || !showImage) {
    return <div className={`h-full w-full bg-gradient-to-br ${gradient}`} />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      onError={() => setShowImage(false)}
    />
  );
}

type DemoAudioPlayerProps = {
  title: string;
  src: string;
};

function DemoAudioPlayer({ title, src }: DemoAudioPlayerProps) {
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
    <div className="flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-soft">
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={isPlaying}
        className="rounded-full bg-rose-600 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-rose-500"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div>
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-rose-400">
          Music
        </p>
        <p className="text-xs text-slate-700">
          <span aria-hidden="true">&#9835;</span> {title}
        </p>
      </div>
      <audio ref={audioRef} src={src} preload="none" />
    </div>
  );
}

export default function TemplateDemoRenderer({
  template,
}: TemplateDemoRendererProps) {
  const copy = getDemoCopyByTemplateId(template.id);
  const images = template.demo.images ?? [];
  const imagesToRender =
    images.length > 0 ? images.slice(0, 6) : new Array(4).fill("");

  return (
    <section className="space-y-12 pb-32">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-rose-100/90">
          {template.vibeTagline}
        </p>
        <h1 className="mt-4 font-display text-4xl text-white md:text-6xl">
          {copy.title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-rose-50/90 md:text-lg">
          {copy.intro}
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-center font-display text-2xl text-white md:text-3xl">
          Our little gallery
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {imagesToRender.map((imageSrc, index) => (
            <div
              key={`${template.id}-demo-${index}`}
              className="relative overflow-hidden rounded-3xl bg-white/80 shadow-soft"
              style={{ aspectRatio: "4 / 5" }}
            >
              <DemoImage
                src={imageSrc || undefined}
                alt={`${template.name} demo photo ${index + 1}`}
                gradient={template.theme.gradient}
                sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 100vw"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2.5rem] bg-white/85 p-8 text-center shadow-soft md:p-10">
        <h2 className="font-display text-2xl text-slate-900 md:text-3xl">
          Love note
        </h2>
        <p className="mt-4 text-sm text-slate-600 md:text-base">
          {copy.loveNote}
        </p>
      </section>

      <section className="rounded-[2.5rem] bg-white/80 p-8 shadow-soft md:p-10">
        <h2 className="text-center font-display text-2xl text-slate-900 md:text-3xl">
          Cute moments
        </h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600 md:text-base">
          {copy.cuteMoments.map((moment) => (
            <li key={moment} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-rose-300" />
              <span>{moment}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[2.5rem] bg-white/80 p-8 text-center shadow-soft md:p-10">
        <h2 className="font-display text-2xl text-slate-900 md:text-3xl">
          Now make it yours
        </h2>
        <p className="mt-3 text-sm text-slate-600 md:text-base">
          Swap in your photos, your words, and the song that feels like you two.
        </p>
        <Link
          href={`/build/${template.id}`}
          className={`${buttonClasses("primary")} mt-6`}
        >
          Now make it yours
        </Link>
      </section>

      {template.demo.music ? (
        <div className="sticky bottom-6 z-20 flex justify-center sm:justify-start">
          <div className="w-[85vw] max-w-sm sm:w-auto">
            <DemoAudioPlayer
              title={template.demo.music.title}
              src={template.demo.music.src}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
