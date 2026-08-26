import type { Metadata } from "next";
import { ResetPasswordForm } from "./reset-form";

export const metadata: Metadata = { title: "Set new password" };

export default function ResetPasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-ink">Set a new password</h1>
      <p className="mt-1 text-sm text-ink-secondary">
        Choose a strong password for your account.
      </p>
      <div className="mt-6">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
