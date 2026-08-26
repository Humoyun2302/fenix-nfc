"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";
import { siteUrl } from "@/lib/env";
import { loginAction, magicLinkAction, type ActionState } from "../actions";

const initial: ActionState = { ok: false };

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/dashboard";
  const [state, action, pending] = useActionState(loginAction, initial);
  const [magicState, magicAction, magicPending] = useActionState(
    magicLinkAction,
    initial,
  );
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [googleLoading, setGoogleLoading] = useState(false);

  async function signInWithGoogle() {
    setGoogleLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${siteUrl}/auth/callback?next=${next}` },
    });
    if (error) setGoogleLoading(false);
  }

  return (
    <div className="space-y-4">
      {params.get("error") ? (
        <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          We couldn&apos;t complete sign-in. Please try again.
        </p>
      ) : null}

      {mode === "password" ? (
        <form action={action} className="space-y-4" noValidate>
          <input type="hidden" name="next" value={next} />
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>
          {state.error ? (
            <p role="alert" className="text-sm text-danger">
              {state.error}
            </p>
          ) : null}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMode("magic")}
              className="text-sm font-medium text-accent hover:text-accent-hover"
            >
              Sign in with a magic link
            </button>
            <Link
              href="/forgot-password"
              className="text-sm text-ink-secondary hover:text-ink"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" variant="accent" size="lg" className="w-full" loading={pending}>
            Sign in
          </Button>
        </form>
      ) : (
        <form action={magicAction} className="space-y-4" noValidate>
          <Field label="Email" htmlFor="magic-email" hint="We'll email you a one-time sign-in link.">
            <Input id="magic-email" name="email" type="email" autoComplete="email" required />
          </Field>
          {magicState.error ? (
            <p role="alert" className="text-sm text-danger">
              {magicState.error}
            </p>
          ) : null}
          {magicState.ok && magicState.message ? (
            <p className="rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
              {magicState.message}
            </p>
          ) : null}
          <Button type="submit" variant="accent" size="lg" className="w-full" loading={magicPending}>
            Send magic link
          </Button>
          <button
            type="button"
            onClick={() => setMode("password")}
            className="w-full text-center text-sm font-medium text-accent hover:text-accent-hover"
          >
            Use password instead
          </button>
        </form>
      )}

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-secondary">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={signInWithGoogle}
        loading={googleLoading}
      >
        Continue with Google
      </Button>
    </div>
  );
}
