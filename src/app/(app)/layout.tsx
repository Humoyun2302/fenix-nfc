import { requireUser, getUserWorkspaces } from "@/lib/workspace/context";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TopNav, type NavWorkspace } from "@/components/navigation/top-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const memberships = await getUserWorkspaces();
  if (memberships.length === 0) redirect("/onboarding");

  const workspaces: NavWorkspace[] = memberships.map((m) => ({
    id: m.workspace.id,
    name: m.workspace.name,
    role: m.role,
  }));

  const active = memberships[0];
  let planLabel = "Free";
  if (active.workspace.plan_id) {
    const supabase = await createClient();
    const { data: plan } = await supabase
      .from("plans")
      .select("name")
      .eq("id", active.workspace.plan_id)
      .maybeSingle();
    if (plan?.name) planLabel = plan.name;
  }

  return (
    <div className="min-h-dvh bg-workspace">
      <TopNav
        user={{ email: user.email, fullName: user.profile?.full_name ?? null }}
        workspaces={workspaces}
        activeWorkspaceId={active.workspace.id}
        planLabel={planLabel}
      />
      {children}
    </div>
  );
}
