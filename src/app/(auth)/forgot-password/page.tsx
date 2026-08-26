import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Reset your password</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Enter your email and we&apos;ll send reset instructions.
      </p>
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
      <p className="mt-6 text-center text-sm text-ink-secondary">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
