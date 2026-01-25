import Link from "next/link";
import Image from "next/image";
import { getTemplates } from "@/data/templates";
import { buttonClasses } from "@/components/Button";
import TemplateCard from "@/components/TemplateCard";
import LoveNotes from "@/components/LoveNotes";

export default function Home() {
  const templates = getTemplates();
  const primaryTemplate = templates[0];
  const heroPreview = primaryTemplate
    ? {
        name: primaryTemplate.name,
        image: primaryTemplate.demo.images[0] ?? "",
        gradient: primaryTemplate.theme.gradient,
      }
    : {
        name: "Cute Classic",
        image: "",
        gradient: "from-rose-200 via-amber-100 to-pink-200",
      };
  const demoLine = "For the nights that glow, this is for you.";
  const buildSteps = ["Pick", "Add media", "Write note", "Publish"];
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16 md:pt-24">
      <section className="relative grid items-center gap-10 overflow-hidden rounded-[3rem] border border-white/80 bg-white/70 p-6 shadow-[0_18px_50px_-40px_rgba(15,23,42,0.3)] md:p-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="pointer-events-none absolute inset-0">
          <div className="hero-pan absolute inset-0 opacity-70" />
          <div className="hero-drift absolute -left-20 top-8 h-72 w-72 rounded-full bg-rose-200/70 blur-3xl" />
          <div className="hero-drift absolute -right-20 top-[-4rem] h-80 w-80 rounded-full bg-amber-100/70 blur-3xl" />
          <div className="hero-drift absolute bottom-[-6rem] left-1/3 h-80 w-80 rounded-full bg-pink-100/70 blur-3xl" />
          <div className="hero-grain absolute inset-0 opacity-35" />
          <div className="hero-sweep absolute inset-y-0 -left-1/3 w-2/3" />
          <span
            aria-hidden="true"
            className="twinkle absolute left-12 top-16 h-2.5 w-2.5 rounded-full bg-white/80"
          />
          <span
            aria-hidden="true"
            className="twinkle absolute right-24 top-28 h-2.5 w-2.5 rotate-45 rounded-[4px] bg-rose-200/80"
            style={{ animationDelay: "-1.2s" }}
          />
          <span
            aria-hidden="true"
            className="floaty absolute right-16 bottom-16 h-10 w-10 rounded-full bg-amber-100/80"
            style={{ animationDuration: "9s" }}
          />
          <div className="absolute inset-0 rounded-[3rem] border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
        </div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em]">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-rose-500 shadow-soft">
              <span
                aria-hidden="true"
                className="hero-pulse h-2 w-2 rounded-full bg-rose-400"
              />
              Valentine page maker
            </span>
            <span className="rounded-full border border-white/80 bg-white/70 px-4 py-2 text-slate-500">
              No login needed
            </span>
            <span className="rounded-full border border-white/80 bg-white/70 px-4 py-2 text-slate-500">
              Live build in 12 sec
            </span>
          </div>
          <h1 className="max-w-[520px] font-display text-4xl leading-[1.08] text-slate-900 md:max-w-[560px] md:text-6xl md:leading-[1.05]">
            <span className="block">Make a</span>
            <span className="block">
              <span className="text-rose-500">Valentine</span> page in
            </span>
            <span className="block">
              <span className="inline-flex items-center gap-2 rounded-2xl bg-rose-100/80 px-3 py-1 text-rose-600">
                60 seconds.
              </span>
            </span>
          </h1>
          <p className="text-lg text-slate-600 md:text-xl">
            Turn photos, words, and a favorite song into a page they will
            replay.
          </p>
          <div className="flex flex-wrap gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
            <span className="rounded-full border border-white/80 bg-white/80 px-3 py-2 text-rose-500">
              Photos + music
            </span>
            <span className="rounded-full border border-white/80 bg-white/80 px-3 py-2 text-slate-600">
              Instant share link
            </span>
            <span className="rounded-full border border-white/80 bg-white/80 px-3 py-2 text-slate-600">
              Made for mobile
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/templates"
              className={`${buttonClasses("primary")} hero-cta-primary group relative shadow-[0_20px_50px_-28px_rgba(244,63,94,0.65)]`}
            >
              Browse templates
              <span className="hero-cta-label">Takes 60 sec</span>
            </Link>
            <Link
              href="#templates"
              className={`${buttonClasses("outline")} bg-white/90`}
            >
              Start building
            </Link>
          </div>
          <p className="text-sm text-slate-500">
            Built for mobile, looks insane on iPhone.
          </p>
          <div className="hero-journey mt-5 rounded-[2rem] border border-white/80 bg-white/80 p-4 text-slate-600 shadow-soft">
            <div className="flex items-center justify-between text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-slate-500">
              <span>Live build path</span>
              <span className="text-rose-500">12 sec</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-slate-600 sm:grid-cols-4">
              {buildSteps.map((step) => (
                <span
                  key={step}
                  className="rounded-full border border-white/90 bg-white/90 px-3 py-2 text-center"
                >
                  {step}
                </span>
              ))}
            </div>
            <div className="hero-journey-line mt-4" aria-hidden="true">
              <span className="hero-journey-dot" />
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-rose-100/80 blur-2xl" />
          <div className="hero-sticker hero-sticker-left">
            No login needed
          </div>
          <div className="hero-sticker hero-sticker-right">
            Instant share link
          </div>
          <div className="glass-card hero-preview-shell rounded-[2.25rem] bg-white/80 p-4 md:p-5">
            <div className="relative overflow-hidden rounded-3xl bg-white/85 p-5">
              <div className="hero-sheen absolute -left-1/2 top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              <div className="relative flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                <span className="inline-flex items-center gap-2">
                  <span className="hero-pulse h-2 w-2 rounded-full bg-rose-400" />
                  Live build
                </span>
                <span>12 sec loop</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                <span>Step 1/4</span>
                <span className="text-rose-500">Photos</span>
              </div>
              <div className="hero-demo-track mt-2" aria-hidden="true">
                <span className="hero-demo-track-dot" />
              </div>
              <div className="hero-demo mt-4 rounded-[2.5rem] border border-white/90 bg-white/90 p-4 shadow-soft">
                <div className="hero-demo-photo rounded-[2rem] border border-white/80 bg-white/80 p-3">
                  <div
                    className={`relative aspect-[4/5] overflow-hidden rounded-[1.6rem] bg-gradient-to-br ${heroPreview.gradient}`}
                  >
                    {heroPreview.image ? (
                      <Image
                        src={heroPreview.image}
                        alt={`${heroPreview.name} preview`}
                        fill
                        sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 80vw"
                        className="hero-demo-photo-img object-cover"
                      />
                    ) : (
                      <div
                        className={`h-full w-full bg-gradient-to-br ${heroPreview.gradient}`}
                      />
                    )}
                    <div className="hero-scanlines absolute inset-0" />
                  </div>
                </div>
                <div className="hero-demo-note mt-4 rounded-[1.5rem] border border-white/80 bg-white/90 px-4 py-3 text-xs text-slate-600">
                  <p className="text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-rose-400">
                    Love note
                  </p>
                  <div className="hero-demo-note-line">
                    <span className="hero-demo-note-text">{demoLine}</span>
                    <span className="hero-demo-cursor" aria-hidden="true" />
                  </div>
                </div>
                <div className="hero-demo-music mt-4 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-600">
                  <span className="hero-demo-eq" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>
                  Added music
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="rounded-full border border-white/80 bg-white/90 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                    Autosave on
                  </div>
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="hero-demo-publish rounded-full px-5 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white"
                  >
                    Publish
                  </button>
                </div>
                <div className="hero-demo-toast mt-4 rounded-[1.2rem] border border-emerald-100 bg-emerald-50/80 px-4 py-2 text-xs text-emerald-600">
                  Link ready to share
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-slate-500">
                <span className="rounded-full border border-white/80 bg-white/90 px-3 py-2">
                  Auto-build loop
                </span>
                <span className="rounded-full border border-white/80 bg-white/90 px-3 py-2 text-rose-500">
                  Tap to edit
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Pick a template",
            text: "Choose a style that matches your story and vibe.",
          },
          {
            title: "Make it yours",
            text: "Edit the template, add photos, music, and words that feel like you.",
          },
          {
            title: "Get link + QR",
            text: "Share instantly or schedule the perfect reveal.",
          },
        ].map((step, index) => (
          <div
            key={step.title}
            className="rounded-3xl bg-white/80 p-6 shadow-soft"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-sm font-semibold text-rose-600">
              {index + 1}
            </span>
            <h3 className="mt-4 font-display text-2xl text-slate-900">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{step.text}</p>
          </div>
        ))}
      </section>

      <section id="templates" className="mt-20 scroll-mt-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
              Template previews
            </p>
            <h2 className="mt-3 font-display text-3xl text-slate-900">
              Pick your look, then make it yours.
            </h2>
          </div>
          <Link href="/templates" className={buttonClasses("ghost")}>
            See all templates
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.slice(0, 5).map((template) => (
            <TemplateCard key={template.id} template={template} compact />
          ))}
        </div>
      </section>

      <LoveNotes />

      <section className="mt-20">
        <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-12 text-white shadow-soft">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
                Ready to build?
              </p>
              <h2 className="mt-3 font-display text-3xl text-white">
                Make your Valentine page today.
              </h2>
              <p className="mt-3 text-sm text-rose-100">
                Preview it free. Publish when it feels perfect.
              </p>
            </div>
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-rose-50"
            >
              Browse templates
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
