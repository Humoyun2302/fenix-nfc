"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to monitoring in a real deployment.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-workspace px-6 text-center">
      <h1 className="text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="max-w-sm text-sm text-ink-secondary">
        An unexpected error occurred. You can try again, and if the problem
        persists, contact support.
      </p>
      <Button variant="accent" onClick={reset}>
        Try again
      </Button>
    </main>
  );
}
