import type { PreviewMode } from "@/lib/builder/types";

type PreviewFrameProps = {
  mode: PreviewMode;
  children: React.ReactNode;
};

export default function PreviewFrame({ mode, children }: PreviewFrameProps) {
  if (mode === "phone") {
    return (
      <div className="flex w-full items-center justify-center py-6">
        <div className="rounded-[3rem] border border-white/70 bg-white/60 p-2 shadow-soft">
          <div className="relative h-[720px] w-[360px] max-h-[75vh] max-w-[85vw] overflow-hidden rounded-[2.5rem]">
            <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-900/20" />
            <div className="absolute left-1/2 top-4 z-10 h-2 w-2 -translate-x-1/2 rounded-full bg-slate-900/40" />
            {children}
          </div>
        </div>
      </div>
    );
  }

  return <div className="w-full min-h-full">{children}</div>;
}
