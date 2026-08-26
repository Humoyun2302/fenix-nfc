"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { forgotPasswordAction, type ActionState } from "../actions";

const initial: ActionState = { ok: false };

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(forgotPasswordAction, initial);

  if (state.ok && state.message) {
    return (
      <div className="rounded-lg border border-line bg-workspace p-4 text-sm text-ink">
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" variant="accent" size="lg" className="w-full" loading={pending}>
        Send reset link
      </Button>
    </form>
  );
}
