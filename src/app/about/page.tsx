import Link from "next/link";
import { aboutContent } from "@/content/about";
import { buttonClasses } from "@/components/Button";
import CuteThings from "@/components/CuteThings";
import { SUPPORT_URL } from "@/config/constants";

export default function AboutPage() {
  const { hero, howItWorks, timeline, dateIdeas, cuteThings } = aboutContent;

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16 md:pt-24">
      <section className="rounded-[3rem] bg-white/70 p-8 shadow-soft md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          {hero.label}
        </p>
        <h1 className="mt-4 font-display text-4xl text-slate-900 md:text-5xl">
          {hero.title}
        </h1>
        <div className="mt-4 space-y-4 text-lg text-slate-600 md:text-xl">
          {hero.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/templates" className={buttonClasses("primary")}>
            Start building
          </Link>
        </div>
      </section>

      <section className="mt-16 rounded-[3rem] bg-white/70 px-8 py-10 shadow-soft md:px-12">
        <h2 className="font-display text-3xl text-slate-900">
          Support the project
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          This page is free. If it made someone smile, you can support the creator.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("primary")}
          >
            ☕ Buy me a coffee
          </a>
        </div>
        <p className="mt-3 text-xs text-slate-500">
          Voluntary tip. The Valentine page is completely free.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-slate-900">
          {howItWorks.title}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {howItWorks.steps.map((step, index) => (
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
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-slate-900">
          {timeline.title}
        </h2>
        <div className="mt-8 space-y-4">
          {timeline.items.map((item) => (
            <div
              key={item.label}
              className="flex gap-4 rounded-3xl bg-white/80 p-6 shadow-soft"
            >
              <div className="mt-1 h-12 w-1 rounded-full bg-gradient-to-b from-rose-300 via-pink-200 to-amber-100" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
                  {item.label}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl text-slate-900">
          {dateIdeas.title}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dateIdeas.categories.map((category) => (
            <div
              key={category.title}
              className="rounded-3xl bg-white/80 p-6 shadow-soft"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
                {category.title}
              </p>
              <div className="mt-4 space-y-3">
                {category.items.map((idea) => (
                  <div key={idea.title}>
                    <p className="text-sm font-semibold text-slate-800">
                      {idea.title}
                    </p>
                    <p className="text-xs text-slate-500">{idea.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl text-slate-900">
              {cuteThings.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Short, sweet, and easy to copy.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <CuteThings lines={cuteThings.lines} />
        </div>
      </section>
    </main>
  );
}
