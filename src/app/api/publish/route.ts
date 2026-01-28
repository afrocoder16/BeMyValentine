import { NextResponse } from "next/server";
import { TEMPLATE_IDS, type TemplateId } from "@/data/templates";
import { coerceBuilderDoc } from "@/lib/builder/storage";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { publishWithService } from "@/lib/publish/server";
import { readClientId } from "@/lib/serverClientId";
import { validateDocShape } from "@/lib/publish/validation";

export const runtime = "nodejs";

type PublishRequestBody = {
  templateId?: unknown;
  doc?: unknown;
  clientId?: unknown;
};

const isValidTemplateId = (value: unknown): value is TemplateId =>
  typeof value === "string" && TEMPLATE_IDS.includes(value as TemplateId);

export async function POST(request: Request) {
  let payload: PublishRequestBody | null = null;
  try {
    payload = (await request.json()) as PublishRequestBody;
  } catch {
    return NextResponse.json(
      { error: "invalid_body", message: "Invalid JSON body." },
      { status: 400 }
    );
  }

  if (!payload || !isValidTemplateId(payload.templateId)) {
    return NextResponse.json(
      { error: "invalid_template", message: "Invalid template." },
      { status: 400 }
    );
  }

  if (!payload.doc || typeof payload.doc !== "object") {
    return NextResponse.json(
      { error: "invalid_doc", message: "Invalid document." },
      { status: 400 }
    );
  }

  const doc = payload.doc as Record<string, unknown>;
  const validationError = validateDocShape(doc);
  if (validationError) {
    return NextResponse.json(
      { error: "invalid_doc", message: validationError },
      { status: 400 }
    );
  }

  const templateId = payload.templateId;
  const clientIdFallback =
    typeof payload.clientId === "string" ? payload.clientId : null;
  const clientId = readClientId(request, clientIdFallback);
  if (!clientId) {
    return NextResponse.json(
      { error: "missing_client_id", message: "Client ID is required." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServiceClient();
  const limit = 3;
  const usage = await supabase.rpc("increment_publish_count_if_under_limit", {
    p_client_id: clientId,
    p_limit: limit,
  });

  if (usage.error) {
    return NextResponse.json(
      {
        error: "usage_error",
        message:
          usage.error.message ?? "Unable to track publish usage. Try again.",
      },
      { status: 500 }
    );
  }

  const usageData = Array.isArray(usage.data) ? usage.data[0] : usage.data;
  if (!usageData) {
    return NextResponse.json(
      {
        error: "usage_error",
        message: "Unable to determine publish usage.",
      },
      { status: 500 }
    );
  }

  if (!usageData.allowed) {
    return NextResponse.json(
      {
        error: "publish_limit_reached",
        limit,
        publishCount: usageData.publish_count ?? limit,
      },
      { status: 403 }
    );
  }

  const normalizedDoc = coerceBuilderDoc(templateId, doc);

  try {
    const result = await publishWithService({ templateId, doc: normalizedDoc });
    return NextResponse.json({
      slug: result.slug,
      url: `/v/${result.slug}`,
      publishCount: usageData.publish_count,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "publish_failed",
        message:
          error instanceof Error ? error.message : "Publish failed.",
        code:
          error instanceof Error && "code" in error
            ? (error as Error & { code?: string }).code
            : undefined,
      },
      { status: 500 }
    );
  }
}
