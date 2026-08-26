import Link from "next/link";
import { ArrowRight, BarChart3, ContactRound, Nfc, QrCode, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";

const features = [
  { icon: ContactRound, title: "Mobile pages", text: "Mini sites, business cards, restaurant pages, products, and forms." },
  { icon: Nfc, title: "NFC routing", text: "Managed tag URLs with scan tracking and safe redirects." },
  { icon: QrCode, title: "QR codes", text: "Generate scannable SVG and PNG codes for pages and tags." },
  { icon: BarChart3, title: "Analytics", text: "Views, clicks, leads, conversions, scans, and referrers." },
  { icon: ShieldCheck, title: "Workspace security", text: "Supabase Auth, roles, RLS, and audit-ready admin flows." },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border bg-white px-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Link className="text-sm text-muted hover:text-foreground" href="/login">Login</Link>
          <Link href="/register">
            <Button>Start</Button>
          </Link>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
            Fenix.nfc
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
            A premium, mobile-first SaaS builder for NFC-connected pages, digital cards, forms, QR codes, leads, and
            analytics.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/register">
              <Button className="h-11">
                Create account <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button className="h-11" variant="secondary">Open dashboard</Button>
            </Link>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[390px] rounded-3xl border border-border bg-[#F7F7F5] p-5 shadow-sm">
          <div className="rounded-2xl border border-border bg-white p-5 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-dark-surface text-2xl font-semibold text-accent">
              F
            </div>
            <h2 className="mt-4 text-xl font-semibold">Fenix Business Card</h2>
            <p className="mt-1 text-sm text-muted">Tap, scan, connect.</p>
            <div className="mt-5 space-y-2">
              {["Book a meeting", "Open menu", "Send request"].map((label) => (
                <div className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground" key={label}>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-3 px-5 pb-12 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((feature) => (
          <article className="rounded-lg border border-border bg-white p-4" key={feature.title}>
            <feature.icon className="h-5 w-5 text-accent" aria-hidden="true" />
            <h2 className="mt-3 text-sm font-semibold">{feature.title}</h2>
            <p className="mt-2 text-xs leading-5 text-muted">{feature.text}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
