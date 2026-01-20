import type { TemplateId } from "@/data/templates";
import type { BuilderDoc } from "@/lib/builder/types";
import { getSupabaseClient } from "@/lib/supabase/client";

type PublishResult = {
  slug: string;
};

const SLUG_LENGTH = 8;
const MAX_ATTEMPTS = 4;

const generateSlug = () => {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  let slug = "";
  for (let i = 0; i < SLUG_LENGTH; i += 1) {
    slug += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return slug;
};

export const publishPage = async (
  templateId: TemplateId,
  doc: BuilderDoc
): Promise<PublishResult> => {
  const supabase = getSupabaseClient();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    const slug = generateSlug();
    const now = new Date().toISOString();
    const { error } = await supabase.from("pages").insert({
      slug,
      template_id: templateId,
      doc,
      status: "published",
      created_at: now,
      updated_at: now,
    });

    if (!error) {
      return { slug };
    }

    if (error.code !== "23505") {
      throw error;
    }
  }

  throw new Error("Unable to generate a unique link. Please try again.");
};
