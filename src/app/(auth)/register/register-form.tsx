"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { registerAction, type ActionState } from "../actions";

const initial: ActionState = { ok: false };

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initial);

  if (state.ok && state.message) {
    return (
      <div className="rounded-lg border border-line bg-workspace p-4 text-sm text-ink">
        {state.message}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4" noValidate>
      <Field label="Full name" htmlFor="fullName">
        <Input id="fullName" name="fullName" autoComplete="name" required />
      </Field>
      <Field label="Email" htmlFor="email">
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" htmlFor="password" hint="At least 8 characters.">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </Field>
      {state.error ? (
        <p role="alert" className="text-sm text-danger">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" variant="accent" size="lg" className="w-full" loading={pending}>
        Create account
      </Button>
      <p className="text-center text-xs text-ink-secondary">
        By creating an account you agree to our Terms and Privacy Policy.
      </p>
    </form>
  );
}
