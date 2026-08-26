import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";
import { DashboardClient } from "./dashboard-client";
import type { PageRow } from "@/types/database";

export const metadata: Metadata = { title: "Pages" };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string }>;
}) {
  const { ws } = await searchParams;
  const active = await getActiveWorkspace(ws);

  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("pages")
    .select("*")
    .eq("workspace_id", active.workspace.id)
    .neq("status", "archived")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <DashboardClient
      workspaceId={active.workspace.id}
      role={active.role}
      pages={(pages ?? []) as PageRow[]}
      siteUrl={siteUrl}
    />
  );
}
