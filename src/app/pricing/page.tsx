import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { PLAN_RULES, type PlanId } from "@/lib/builder/planRules";

const heroHighlights = [
  "Guided sky map that draws your story as constellations.",
  "Tap the stars to reveal moments, orbit reasons, and wish-list pins.",
  "Shooting stars land date ideas you can lock as tiny constellations.",
];

const planDetails: Array<{
  id: PlanId;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  highlight: boolean;
  cta: string;
}> = [
  {
    id: "normal",
    name: "Normal",
    tagline: "Perfect for your first constellation.",
    description: "Build a single shimmering page, preview it for free, and share it instantly.",
    features: [
      `Up to ${PLAN_RULES.normal.maxPhotos} photos + 1 share link`,
      "Use every template (Starlit Constellations included)",
      "Autosave, mobile-ready playback, and instant QR access",
    ],
    highlight: false,
    cta: "Start building",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "All the bells for keepsake reveals.",
    description: "More photos, priority uploads, and unlimited revisions before publishing.",
    features: [
      `Up to ${PLAN_RULES.pro.maxPhotos} photos with GIF support`,
      "Priority uploads + faster publishing",
      "Unlimited revisions plus share link + QR access",
    ],
    highlight: true,
    cta: "Go Pro",
  },
];

const builderPerks = [
  "Preview + edit before publishing",
  "Instant share link + QR",
  "Mobile-first experience built for iPhone",
  "Swap music and fonts as often as you want",
];

export default function PricingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-16 md:pt-24">
      <section className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
            Pricing
          </p>
          <span className="hidden rounded-full border border-white/60 bg-white/70 px-4 py-1 text-xs text-slate-500 sm:inline-flex">
            Built for latenight confessions
          </span>
        </div>
        <h1 className="font-display text-4xl text-slate-900 md:text-5xl">
          Pick the plan that keeps your constellation glowing.
        </h1>
        <p className="text-lg text-slate-600 md:text-xl">
          Every plan includes the Starlit Constellations experience, instant sharing,
          and the ability to add songs, photos, and stories that feel like your shared sky.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {heroHighlights.map((highlight) => (
            <div
              key={highlight}
              className="rounded-2xl border border-white/70 bg-white/80 p-4 text-xs font-semibold uppercase tracking-[0.3em] text-slate-600 shadow-soft"
            >
              {highlight}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            Template spotlight
          </p>
          <h2 className="font-display text-3xl text-slate-900">
            Starlit Constellations shines in every plan.
          </h2>
          <p className="text-sm text-slate-600">
            Name a star, tap to ignite the sky, and let the map draw the trust and meaning in your
            story. Orbit reasons keep the romance steady while wish-list shooting stars drop new
            adventures to pin.
          </p>
          <Link
            href="/templates"
            className={`${buttonClasses("outline")} w-max text-xs font-semibold tracking-[0.3em]`}
          >
            Show all templates
          </Link>
        </div>
        <div className="rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-800 p-6 text-white shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
            Starlit Constellations
          </p>
          <h3 className="mt-3 font-display text-2xl">Name a star. Write the night sky.</h3>
          <p className="mt-3 text-sm text-slate-200">
            Tap the pulsing star to light the nebula, reveal constellation moments, and let orbit
            reasons and wish list sparks stay lit.
          </p>
          <div className="mt-6 space-y-3 text-[0.65rem] uppercase tracking-[0.35em] text-slate-200">
            <p>Glow: subtle grain + nebula gradient</p>
            <p>Stars: twinkling, parallax, shooting streaks</p>
            <p>Ask: dual YES buttons + aurora shower</p>
          </div>
        </div>
      </section>

      <section className="mt-12 grid gap-6 lg:grid-cols-2">
        {planDetails.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col justify-between rounded-[2.5rem] border border-white/60 bg-white/90 p-8 shadow-soft ${
              plan.highlight ? "ring-2 ring-rose-200/70" : ""
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-500">
                  {plan.name}
                </p>
                {plan.highlight ? (
                  <span className="rounded-full bg-rose-100 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-rose-600">
                    {PLAN_RULES[plan.id].label} plan
                  </span>
                ) : null}
              </div>
              <p className="font-display text-4xl text-slate-900">
                {PLAN_RULES[plan.id].price}
              </p>
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">
                {plan.tagline}
              </p>
              <p className="text-sm text-slate-600">{plan.description}</p>
              <ul className="space-y-3 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="mt-1 text-rose-500">&#10003;</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/templates"
              className={`${buttonClasses(plan.highlight ? "primary" : "outline")} mt-6 text-xs font-semibold uppercase tracking-[0.3em]`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </section>

      <section className="mt-12 space-y-4 rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 py-10 text-white shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-200">
          Built for last-minute declarations
        </p>
        <h2 className="font-display text-3xl">Preview free, publish when you&rsquo;re ready.</h2>
        <p className="text-sm text-slate-200">
          Swap photos, words, and music as often as you like. Every plan includes a share link,
          mobile-ready layout, and the Starlit Constellations template so your relationship can
          shine like the night sky.
        </p>
        <div className="flex flex-wrap gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-200">
          {builderPerks.map((perk) => (
            <span key={perk} className="rounded-full border border-white/60 px-3 py-1">
              {perk}
            </span>
          ))}
        </div>
        <Link href="/templates" className="inline-flex items-center justify-center rounded-full border border-white/80 bg-white px-6 py-2 text-xs font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-rose-50">
          Browse templates
        </Link>
      </section>
    </main>
  );
}
