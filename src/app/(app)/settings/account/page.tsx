import type { Metadata } from "next";
import { requireUser } from "@/lib/workspace/context";
import { AccountForms } from "./account-forms";

export const metadata: Metadata = { title: "Account settings" };

export default async function AccountSettingsPage() {
  const user = await requireUser();
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Account</h1>
        <p className="text-sm text-ink-secondary">
          Manage your profile, password and account.
        </p>
      </div>
      <AccountForms
        email={user.email}
        fullName={user.profile?.full_name ?? ""}
        username={user.profile?.username ?? ""}
      />
    </div>
  );
}
