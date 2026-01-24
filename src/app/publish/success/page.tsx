import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import PublishSuccessClient from "./PublishSuccessClient";

type PublishSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>;
};

const renderMessage = (title: string, message: string) => (
  <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 via-amber-50 to-rose-100 px-6 py-16">
    <div className="w-full max-w-xl rounded-[2.5rem] bg-white/90 p-8 text-center shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
        Publish
      </p>
      <h1 className="mt-4 font-display text-3xl text-slate-900 md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-slate-600">{message}</p>
      <Link href="/templates" className={`${buttonClasses("primary")} mt-6`}>
        Browse templates
      </Link>
    </div>
  </main>
);

export default async function PublishSuccessPage({
  searchParams,
}: PublishSuccessPageProps) {
  const resolvedParams = await searchParams;
  const sessionId =
    typeof resolvedParams.session_id === "string"
      ? resolvedParams.session_id
      : null;

  if (!sessionId) {
    return renderMessage(
      "Missing checkout session",
      "We could not confirm your payment. Please try again."
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 via-amber-50 to-rose-100 px-6 py-16">
      <div className="w-full max-w-xl rounded-[2.5rem] bg-white/90 p-8 text-center shadow-soft">
        <PublishSuccessClient sessionId={sessionId} />
      </div>
    </main>
  );
}
