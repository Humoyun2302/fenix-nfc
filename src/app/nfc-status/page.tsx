import Link from "next/link";
import { ScanLine } from "lucide-react";

const MESSAGES: Record<string, { title: string; description: string }> = {
  invalid: {
    title: "Invalid NFC tag",
    description: "This tag code isn't recognized. It may be mistyped or damaged.",
  },
  not_found: {
    title: "Tag not assigned",
    description: "This tag isn't linked to a page yet.",
  },
  disabled: {
    title: "Tag disabled",
    description: "This NFC tag has been turned off by its owner.",
  },
  suspended: {
    title: "Unavailable",
    description: "The workspace for this tag is currently suspended.",
  },
};

export default async function NfcStatusPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const msg = MESSAGES[state ?? "invalid"] ?? MESSAGES.invalid;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-workspace px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-surface text-ink-secondary shadow-sm">
        <ScanLine className="size-7" aria-hidden />
      </div>
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-ink">{msg.title}</h1>
        <p className="max-w-sm text-sm text-ink-secondary">{msg.description}</p>
      </div>
      <Link href="/" className="text-sm font-medium text-accent hover:text-accent-hover">
        Powered by Fenix.nfc
      </Link>
    </main>
  );
}
