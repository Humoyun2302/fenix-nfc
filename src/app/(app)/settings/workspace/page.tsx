import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { WorkspaceForm } from "./workspace-form";

export const metadata: Metadata = { title: "Workspace settings" };

export default async function WorkspaceSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string }>;
}) {
  const { ws } = await searchParams;
  const active = await getActiveWorkspace(ws);
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Workspace</h1>
        <p className="text-sm text-ink-secondary">
          General settings for {active.workspace.name}.
        </p>
      </div>
      <WorkspaceForm
        workspaceId={active.workspace.id}
        name={active.workspace.name}
        slug={active.workspace.slug}
        role={active.role}
      />
    </div>
  );
}
