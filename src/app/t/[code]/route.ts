import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/env";
import { resolveNfcDestination } from "@/lib/nfc";
import { createClient } from "@/lib/supabase/server";

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: "NFC routing is not configured." }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: tag } = await supabase
    .from("nfc_tags")
    .select("id, workspace_id, public_code, status, assigned_page_id, assigned_url, pages(slug)")
    .eq("public_code", code)
    .single();

  const typed = tag as
    | {
        id: string;
        workspace_id: string;
        status: "active" | "disabled";
        assigned_url: string | null;
        pages: { slug: string } | null;
      }
    | null;

  if (!typed) return NextResponse.json({ error: "Unknown NFC tag." }, { status: 404 });
  if (typed.status !== "active") return NextResponse.json({ error: "NFC tag is disabled." }, { status: 410 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://fenixnfc.uz";
  const destination = resolveNfcDestination({
    appUrl,
    assignedPageSlug: typed.pages?.slug,
    assignedUrl: typed.assigned_url,
  });

  await supabase.from("nfc_scans").insert({
    nfc_tag_id: typed.id,
    workspace_id: typed.workspace_id,
    destination,
  });
  await supabase
    .from("nfc_tags")
    .update({ last_scan_at: new Date().toISOString() })
    .eq("id", typed.id);
  await supabase.from("analytics_events").insert({
    workspace_id: typed.workspace_id,
    event_type: "nfc_scan",
    metadata: { code, destination },
  });

  return NextResponse.redirect(destination, 302);
}
