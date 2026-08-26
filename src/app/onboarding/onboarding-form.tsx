"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { createFirstWorkspaceAction, type OnboardingState } from "./actions";

const initial: OnboardingState = { ok: false };

export function OnboardingForm() {
  const [state, action, pending] = useActionState(
    createFirstWorkspaceAction,
    initial,
  );

  return (
    <form action={action} className="space-y-4" noValidate>
      <Field label="Workspace name" htmlFor="name">
        <Input id="name" name="name" placeholder="Acme Studio" required autoFocus />
      </Field>
      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" variant="accent" size="lg" className="w-full" loading={pending}>
        Create workspace
      </Button>
    </form>
  );
}
