import { redirect } from "next/navigation";

type BuilderRedirectProps = {
  params: Promise<{ templateId?: string }>;
};

export default async function BuilderRedirect({ params }: BuilderRedirectProps) {
  const resolvedParams = await params;
  const templateId =
    typeof resolvedParams.templateId === "string"
      ? resolvedParams.templateId
      : "";
  redirect(`/build/${templateId}`);
}
