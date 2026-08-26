import Link from "next/link";
import { ArrowRight, ScanLine, LayoutGrid, BarChart3, ShieldCheck } from "lucide-react";
import { FenixLogo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/workspace/context";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-dvh bg-surface">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <FenixLogo />
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/dashboard">
                <Button variant="accent" size="sm">
                  Open dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="accent" size="sm">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-3xl px-4 py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-xs font-medium text-ink-secondary">
            <ScanLine className="size-3.5 text-accent" /> NFC-ready mini-sites
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Premium mini-sites, digital cards & NFC pages.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-secondary">
            Build mobile-first pages with a fast, focused editor. Connect NFC
            tags, generate QR codes, capture leads, and track everything.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href={user ? "/dashboard" : "/register"}>
              <Button variant="accent" size="lg">
                Start building <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 pb-24">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: LayoutGrid,
                title: "Block editor",
                body: "Compact, drag-and-drop editing with a live mobile preview.",
              },
              {
                icon: ScanLine,
                title: "NFC & QR",
                body: "Managed NFC tags you can reassign anytime, plus scannable QR codes.",
              },
              {
                icon: BarChart3,
                title: "Leads & analytics",
                body: "Real forms create real leads, with views, clicks and conversions.",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-line bg-surface p-5">
                <f.icon className="size-6 text-accent" />
                <h3 className="mt-3 font-semibold text-ink">{f.title}</h3>
                <p className="mt-1 text-sm text-ink-secondary">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-sm text-ink-secondary">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="size-4" /> Secure multi-tenant workspaces
          </span>
          <span>© {new Date().getFullYear()} Fenix.nfc</span>
        </div>
      </footer>
    </div>
  );
}
