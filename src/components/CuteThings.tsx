"use client";

import { useState } from "react";

type CuteThingsProps = {
  lines: string[];
};

const sliceCount = 9;

const shuffleLines = (lines: string[]) => {
  const copy = [...lines];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, sliceCount);
};

export default function CuteThings({ lines }: CuteThingsProps) {
  const [visibleLines, setVisibleLines] = useState(lines.slice(0, sliceCount));

  return (
    <div>
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setVisibleLines(shuffleLines(lines))}
          className="inline-flex items-center justify-center rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-600 transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-50/60"
        >
          Shuffle
        </button>
      </div>
      <div className="mt-6 grid max-h-[360px] gap-3 overflow-y-auto pr-1 md:max-h-none md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
        {visibleLines.map((line) => (
          <div
            key={line}
            className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-soft"
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
