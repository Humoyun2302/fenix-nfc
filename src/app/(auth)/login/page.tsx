import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Sign in to your Fenix.nfc account.
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>

      <p className="mt-6 text-center text-sm text-ink-secondary">
        New to Fenix.nfc?{" "}
        <Link href="/register" className="font-medium text-accent hover:text-accent-hover">
          Create an account
        </Link>
      </p>
    </div>
  );
}
