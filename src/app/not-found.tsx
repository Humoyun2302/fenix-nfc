import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FenixLogo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-workspace px-6 text-center">
      <FenixLogo />
      <h1 className="text-2xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-secondary">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/">
        <Button variant="accent">Back to home</Button>
      </Link>
    </main>
  );
}
