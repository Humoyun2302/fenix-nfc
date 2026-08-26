import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";
import { NfcClient } from "./nfc-client";
import type { NfcTagRow, PageRow } from "@/types/database";

export const metadata: Metadata = { title: "NFC tags" };

export default async function NfcSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string }>;
}) {
  const { ws } = await searchParams;
  const active = await getActiveWorkspace(ws);
  const supabase = await createClient();

  const [{ data: tags }, { data: pages }] = await Promise.all([
    supabase
      .from("nfc_tags")
      .select("*")
      .eq("workspace_id", active.workspace.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("pages")
      .select("id, title, slug, status")
      .eq("workspace_id", active.workspace.id)
      .neq("status", "archived"),
  ]);

  return (
    <NfcClient
      workspaceId={active.workspace.id}
      role={active.role}
      tags={(tags ?? []) as NfcTagRow[]}
      pages={(pages ?? []) as Pick<PageRow, "id" | "title" | "slug" | "status">[]}
      siteUrl={siteUrl}
    />
  );
}
