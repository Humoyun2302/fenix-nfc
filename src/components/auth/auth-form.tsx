"use client";

import Link from "next/link";
import { useState } from "react";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/layout/logo";
import { hasSupabaseEnv } from "@/lib/env";
import { maskSupabaseError } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";

type Mode = "login" | "register" | "forgot" | "magic" | "reset";

export function AuthForm({ mode }: { mode: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const configured = hasSupabaseEnv();

  async function submit() {
    setPending(true);
    setError(null);
    setMessage(null);

    try {
      if (!configured) throw new Error("Supabase is not configured.");
      const supabase = createClient();
      const redirectTo = `${window.location.origin}/dashboard`;

      if (mode === "register") {
        const result = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
        if (result.error) throw result.error;
        setMessage("Check your email to verify the account.");
      } else if (mode === "forgot") {
        const result = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (result.error) throw result.error;
        setMessage("Password reset email sent.");
      } else if (mode === "magic") {
        const result = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
        if (result.error) throw result.error;
        setMessage("Magic link sent.");
      } else if (mode === "reset") {
        const result = await supabase.auth.updateUser({ password });
        if (result.error) throw result.error;
        setMessage("Password updated.");
      } else {
        const result = await supabase.auth.signInWithPassword({ email, password });
        if (result.error) throw result.error;
        window.location.href = "/dashboard";
      }
    } catch (caught) {
      setError(maskSupabaseError(caught instanceof Error ? caught.message : undefined));
    } finally {
      setPending(false);
    }
  }

  async function googleLogin() {
    setPending(true);
    setError(null);
    try {
      if (!configured) throw new Error("Supabase is not configured.");
      const supabase = createClient();
      const result = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
      if (result.error) throw result.error;
    } catch (caught) {
      setError(maskSupabaseError(caught instanceof Error ? caught.message : undefined));
      setPending(false);
    }
  }

  const title =
    mode === "register"
      ? "Create your Fenix account"
      : mode === "forgot"
        ? "Reset your password"
        : mode === "magic"
          ? "Login with a magic link"
          : mode === "reset"
            ? "Choose a new password"
            : "Welcome back";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="w-full max-w-md rounded-lg border border-border bg-white p-6 shadow-sm">
        <Logo />
        <h1 className="mt-8 text-2xl font-semibold text-foreground">{title}</h1>
        <p className="mt-2 text-sm text-muted">Build and manage premium NFC-ready mini sites.</p>

        {!configured ? (
          <div className="mt-5 rounded-md border border-warning/30 bg-amber-50 p-3 text-sm text-foreground">
            Supabase environment variables are missing.
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {mode !== "reset" ? (
            <label className="block text-sm font-medium">
              Email
              <Input className="mt-1" onChange={(event) => setEmail(event.target.value)} type="email" value={email} />
            </label>
          ) : null}
          {!["forgot", "magic"].includes(mode) ? (
            <label className="block text-sm font-medium">
              Password
              <Input
                className="mt-1"
                onChange={(event) => setPassword(event.target.value)}
                type="password"
                value={password}
              />
            </label>
          ) : null}
          {error ? <p className="text-sm text-error" role="alert">{error}</p> : null}
          {message ? <p className="text-sm text-success" role="status">{message}</p> : null}
          <Button className="w-full" disabled={pending} onClick={submit}>
            <Mail className="h-4 w-4" aria-hidden="true" />
            {pending ? "Please wait" : mode === "login" ? "Login" : "Continue"}
          </Button>
          {mode === "login" ? (
            <>
              <Button className="w-full" disabled={pending} onClick={googleLogin} variant="secondary">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Continue with Google
              </Button>
              <Link className="flex items-center justify-center gap-2 text-sm text-muted hover:text-foreground" href="/magic-link">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                Send magic link
              </Link>
            </>
          ) : null}
        </div>

        <div className="mt-6 flex justify-between text-sm">
          <Link className="text-muted hover:text-foreground" href="/forgot-password">Forgot password</Link>
          {mode === "register" ? (
            <Link className="font-medium text-foreground underline decoration-accent" href="/login">Login</Link>
          ) : (
            <Link className="font-medium text-foreground underline decoration-accent" href="/register">Register</Link>
          )}
        </div>
      </section>
    </main>
  );
}
