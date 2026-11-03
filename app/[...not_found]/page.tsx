import { notFound, redirect } from "next/navigation";

export default function NotFoundCatchAll({
  params,
}: {
  params?: { not_found?: string[] };
}) {
  if (params?.not_found?.[0]?.toLowerCase() === "portfolio") {
    redirect("/#work");
  }
  notFound();
  return null;
}
