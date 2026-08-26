import type { Metadata } from "next";
import { requireUser, getUserWorkspaces } from "@/lib/workspace/context";
import { redirect } from "next/navigation";
import { FenixLogo } from "@/components/brand/logo";
import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = { title: "Create your workspace" };

export default async function OnboardingPage() {
  await requireUser();
  const workspaces = await getUserWorkspaces();
  if (workspaces.length > 0) redirect("/dashboard");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-workspace px-6">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8 shadow-sm">
        <FenixLogo className="mb-6" />
        <h1 className="text-xl font-semibold text-ink">
          Create your first workspace
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          A workspace holds your pages, leads, and NFC tags. You can rename it
          anytime.
        </p>
        <div className="mt-6">
          <OnboardingForm />
        </div>
      </div>
    </main>
  );
}
