import type { Metadata } from "next";
import { FenixLogo } from "@/components/brand/logo";
import { getCurrentUser } from "@/lib/workspace/context";
import { InviteActions } from "./invite-actions";

export const metadata: Metadata = { title: "Accept invitation" };

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const user = await getCurrentUser();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-workspace px-6">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 text-center shadow-sm">
        <FenixLogo className="mx-auto mb-6" />
        <h1 className="text-xl font-semibold text-ink">You&apos;ve been invited</h1>
        <p className="mt-2 text-sm text-ink-secondary">
          {user
            ? "Accept this invitation to join the workspace. Existing pages and analytics remain intact."
            : "Sign in or create an account to accept this invitation."}
        </p>
        <div className="mt-6">
          <InviteActions token={token} signedIn={!!user} />
        </div>
      </div>
    </main>
  );
}
