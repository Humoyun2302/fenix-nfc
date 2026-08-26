import Link from "next/link";
import { Ban, FileQuestion, Clock4, PauseCircle } from "lucide-react";

const CONFIG = {
  not_found: {
    icon: FileQuestion,
    title: "Page not found",
    description: "This page doesn't exist or has been removed.",
  },
  unpublished: {
    icon: Clock4,
    title: "Not published yet",
    description: "The owner hasn't published this page yet. Check back soon.",
  },
  disabled: {
    icon: Ban,
    title: "Page unavailable",
    description: "This page has been disabled.",
  },
  suspended: {
    icon: PauseCircle,
    title: "Temporarily unavailable",
    description: "This workspace is currently suspended.",
  },
} as const;

export function PublicStateScreen({
  state,
}: {
  state: keyof typeof CONFIG;
}) {
  const cfg = CONFIG[state];
  const Icon = cfg.icon;
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-workspace px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-surface text-ink-secondary shadow-sm">
        <Icon className="size-7" aria-hidden />
      </div>
      <div className="space-y-1">
        <h1 className="text-lg font-semibold text-ink">{cfg.title}</h1>
        <p className="max-w-sm text-sm text-ink-secondary">{cfg.description}</p>
      </div>
      <Link
        href="/"
        className="text-sm font-medium text-accent hover:text-accent-hover"
      >
        Powered by Fenix.nfc
      </Link>
    </main>
  );
}
