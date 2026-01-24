"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { writeEntitlementSessionId } from "@/lib/entitlements";

type PublishSuccessClientProps = {
  sessionId: string;
};

export default function PublishSuccessClient({
  sessionId,
}: PublishSuccessClientProps) {
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<
    "loading" | "verified" | "unverified"
  >("loading");
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("unverified");
      return;
    }

    const confirmPayment = async () => {
      try {
        const response = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
        const payload = (await response.json().catch(() => ({}))) as {
          verified?: boolean;
          slug?: string;
        };
        if (!response.ok || !payload.verified || !payload.slug) {
          setStatus("unverified");
          return;
        }
        setSlug(payload.slug);
        setStatus("verified");
        writeEntitlementSessionId(sessionId);
      } catch {
        setStatus("unverified");
      }
    };

    void confirmPayment();
  }, [sessionId]);

  const shareUrl = useMemo(() => {
    if (!slug) {
      return "";
    }
    const sharePath = `/v/${slug}`;
    if (typeof window === "undefined") {
      return sharePath;
    }
    return `${window.location.origin}${sharePath}`;
  }, [slug]);

  const handleCopy = async () => {
    if (!shareUrl) {
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  if (status === "loading") {
    return (
      <>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          Checking payment
        </p>
        <h1 className="mt-4 font-display text-3xl text-slate-900 md:text-4xl">
          Confirming your checkout
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Hang tight while we verify your payment.
        </p>
      </>
    );
  }

  if (status === "unverified") {
    return (
      <>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          Payment not verified
        </p>
        <h1 className="mt-4 font-display text-3xl text-slate-900 md:text-4xl">
          We could not confirm payment
        </h1>
        <p className="mt-3 text-sm text-slate-600">
          Please refresh in a moment. If it keeps happening, contact support.
        </p>
      </>
    );
  }

  const sharePath = `/v/${slug ?? ""}`;

  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
        Success
      </p>
      <h1 className="mt-4 font-display text-3xl text-slate-900 md:text-4xl">
        Your Valentine is live
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Share the link below with your person.
      </p>
      <div className="mt-6">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-slate-700">
          {shareUrl}
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className={buttonClasses("outline")}
          >
            {copied ? "Copied" : "Copy link"}
          </button>
          <Link
            href={sharePath}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses("primary")}
          >
            Open link
          </Link>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.28em] text-rose-500">
          {copied ? "Copied to clipboard" : "Share this link with your person"}
        </p>
      </div>
    </>
  );
}
