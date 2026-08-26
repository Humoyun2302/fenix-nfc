import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { MembersClient, type MemberView } from "./members-client";

export const metadata: Metadata = { title: "Team members" };

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string }>;
}) {
  const { ws } = await searchParams;
  const active = await getActiveWorkspace(ws);
  const supabase = await createClient();

  const { data } = await supabase
    .from("workspace_members")
    .select("id, role, user:profiles(full_name, email)")
    .eq("workspace_id", active.workspace.id)
    .order("created_at", { ascending: true });

  const members: MemberView[] = (data ?? []).map((m) => {
    const profile = m.user as unknown as { full_name: string | null; email: string } | null;
    return {
      id: m.id,
      role: m.role,
      fullName: profile?.full_name ?? null,
      email: profile?.email ?? "",
    };
  });

  return (
    <MembersClient
      workspaceId={active.workspace.id}
      role={active.role}
      members={members}
    />
  );
}
