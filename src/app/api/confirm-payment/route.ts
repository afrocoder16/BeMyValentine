import { NextResponse } from "next/server";
import Stripe from "stripe";
import { TEMPLATE_IDS, type TemplateId } from "@/data/templates";
import type { PlanId } from "@/lib/builder/planRules";
import { coerceBuilderDoc } from "@/lib/builder/storage";
import { publishWithService } from "@/lib/publish/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error("Missing STRIPE_SECRET_KEY");
}
const stripe = new Stripe(stripeSecret);
const isDev = process.env.NODE_ENV !== "production";

const maskSessionId = (value: string) => {
  if (!value) {
    return "missing";
  }
  if (value.length <= 10) {
    return value;
  }
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

const log = (...args: unknown[]) => {
  if (!isDev) {
    return;
  }
  console.log(...args);
};

type ConfirmPaymentBody = {
  session_id?: unknown;
};

const isValidTemplateId = (value: unknown): value is TemplateId =>
  typeof value === "string" && TEMPLATE_IDS.includes(value as TemplateId);

export async function POST(request: Request) {
  let payload: ConfirmPaymentBody | null = null;
  try {
    payload = (await request.json()) as ConfirmPaymentBody;
  } catch {
    return NextResponse.json(
      { verified: false, error: "invalid_body" },
      { status: 400 }
    );
  }

  const sessionId =
    payload && typeof payload.session_id === "string" ? payload.session_id : "";

  if (!sessionId) {
    log("confirm-payment: missing session_id");
    return NextResponse.json(
      { verified: false, error: "missing_session_id" },
      { status: 400 }
    );
  }

  log("confirm-payment: session", maskSessionId(sessionId));

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    log(
      "confirm-payment: stripe session retrieve failed",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ verified: false, error: "session_not_found" });
  }

  if (session.payment_status !== "paid") {
    log(
      "confirm-payment: unpaid session",
      maskSessionId(sessionId),
      session.payment_status
    );
    return NextResponse.json({ verified: false, error: "not_paid" });
  }

  const supabase = getSupabaseServiceClient();

  const { data: existingPage, error: existingError } = await supabase
    .from("pages")
    .select("slug")
    .eq("entitlement_session_id", sessionId)
    .maybeSingle();

  if (existingError) {
    log(
      "confirm-payment: existing page lookup failed",
      existingError.message
    );
  }

  if (existingPage?.slug) {
    return NextResponse.json({ verified: true, slug: existingPage.slug });
  }

  const { data: pending, error: pendingError } = await supabase
    .from("pending_publishes")
    .select("template_id, doc, plan")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (pendingError || !pending) {
    log(
      "confirm-payment: pending publish missing",
      pendingError?.message ?? "no row"
    );
    return NextResponse.json({ verified: false, error: "pending_missing" });
  }

  if (!isValidTemplateId(pending.template_id)) {
    log("confirm-payment: invalid template", pending.template_id);
    return NextResponse.json({ verified: false, error: "invalid_template" });
  }

  const plan = pending.plan as PlanId;
  const doc = coerceBuilderDoc(
    pending.template_id,
    pending.doc as Record<string, unknown>
  );

  const now = new Date().toISOString();
  const { error: paidError } = await supabase
    .from("pending_publishes")
    .update({ paid_at: now })
    .eq("stripe_session_id", sessionId);

  if (paidError) {
    log("confirm-payment: failed to mark paid", paidError.message);
  }

  const { error: entitlementError } = await supabase.from("entitlements").upsert(
    {
      session_id: sessionId,
      plan,
      status: "active",
      customer_email:
        session.customer_details?.email ?? session.customer_email ?? null,
      updated_at: now,
      created_at: now,
    },
    { onConflict: "session_id" }
  );

  if (entitlementError) {
    log(
      "confirm-payment: entitlement upsert failed",
      entitlementError.message
    );
  }

  try {
    const result = await publishWithService({
      templateId: pending.template_id,
      doc,
      entitlementSessionId: sessionId,
    });
    return NextResponse.json({ verified: true, slug: result.slug });
  } catch (error) {
    log(
      "confirm-payment: publish failed",
      error instanceof Error ? error.message : error
    );
    return NextResponse.json({ verified: false, error: "publish_failed" });
  }
}
