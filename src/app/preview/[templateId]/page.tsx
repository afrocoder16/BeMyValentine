import Link from "next/link";
import { getTemplateById } from "@/data/templates";
import { buttonClasses } from "@/components/Button";
import TemplateDemoRenderer from "@/components/TemplateDemoRenderer";

type PreviewPageProps = {
  params: Promise<{ templateId?: string }>;
};

export default async function PreviewPage({ params }: PreviewPageProps) {
  const resolvedParams = await params;
  const templateId =
    typeof resolvedParams.templateId === "string"
      ? resolvedParams.templateId
      : null;
  const selectedTemplate = getTemplateById(templateId);

  if (!selectedTemplate) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 via-amber-50 to-rose-100 px-6 py-16">
        <div className="w-full max-w-xl rounded-[2.5rem] bg-white/90 p-8 text-center shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
            Preview
          </p>
          <h1 className="mt-4 font-display text-3xl text-slate-900 md:text-4xl">
            We could not find that template.
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Pick another style and we will load its demo preview.
          </p>
          <Link href="/templates" className={`${buttonClasses("primary")} mt-6`}>
            Browse templates
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className={`relative min-h-screen bg-gradient-to-br ${selectedTemplate.theme.gradient}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: "url('/textures/noise.png')",
            backgroundRepeat: "repeat",
          }}
        />
      </div>
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-24 pt-16 md:pt-24">
        <TemplateDemoRenderer template={selectedTemplate} />
      </div>
    </main>
  );
}
