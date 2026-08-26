import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export function ConfigRequired() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="w-full max-w-lg rounded-lg border border-border bg-surface p-6 shadow-sm">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-amber-50 text-warning">
          <AlertTriangle className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">Configuration required</h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Connect Supabase before using authenticated workflows. Set the public project URL and publishable key, then
          run the migrations in `supabase/migrations`.
        </p>
        <Link className="mt-5 inline-flex text-sm font-medium text-foreground underline decoration-accent" href="/docs">
          Read setup notes
        </Link>
      </section>
    </main>
  );
}
