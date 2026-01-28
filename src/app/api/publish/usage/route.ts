import { NextResponse } from "next/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { readClientId } from "@/lib/serverClientId";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const clientId = readClientId(request);
  if (!clientId) {
    return NextResponse.json(
      { error: "missing_client_id", message: "Client ID is required." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseServiceClient();
  const { data, error } = await supabase
    .from("publish_usage")
    .select("publish_count")
    .eq("client_id", clientId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      {
        error: "usage_error",
        message: error.message ?? "Unable to read publish usage.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    publishCount: data?.publish_count ?? 0,
    limit: 3,
  });
}
