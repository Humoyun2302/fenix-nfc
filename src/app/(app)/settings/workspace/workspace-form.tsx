"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { canManage } from "@/lib/permissions/roles";
import type { WorkspaceRole } from "@/types/database";
import { renameWorkspaceAction, type WorkspaceState } from "./actions";

const initial: WorkspaceState = { ok: false };

export function WorkspaceForm({
  workspaceId,
  name,
  slug,
  role,
}: {
  workspaceId: string;
  name: string;
  slug: string;
  role: WorkspaceRole;
}) {
  const [state, action, pending] = useActionState(renameWorkspaceAction, initial);
  const manager = canManage(role);

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <form action={action} className="space-y-4" noValidate>
        <input type="hidden" name="workspaceId" value={workspaceId} />
        <Field label="Workspace name" htmlFor="name">
          <Input id="name" name="name" defaultValue={name} disabled={!manager} required />
        </Field>
        <Field label="Workspace slug" htmlFor="slug" hint="Used internally to identify your workspace.">
          <Input id="slug" value={slug} disabled />
        </Field>
        {state.error ? (
          <p role="alert" className="text-sm text-danger">
            {state.error}
          </p>
        ) : null}
        {state.ok && state.message ? (
          <p className="text-sm text-success">{state.message}</p>
        ) : null}
        {manager ? (
          <Button type="submit" variant="accent" loading={pending}>
            Save changes
          </Button>
        ) : (
          <p className="text-sm text-ink-secondary">
            Only owners and admins can change workspace settings.
          </p>
        )}
      </form>
    </section>
  );
}
