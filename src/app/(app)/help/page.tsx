import type { Metadata } from "next";
import Link from "next/link";
import { LifeBuoy, BookOpen, ScanLine, QrCode } from "lucide-react";

export const metadata: Metadata = { title: "Help" };

export default function HelpPage() {
  const links = [
    { icon: BookOpen, title: "Getting started", desc: "Create your first page and publish it.", href: "/dashboard" },
    { icon: ScanLine, title: "NFC tags", desc: "Assign and reassign managed NFC tags.", href: "/settings/nfc" },
    { icon: QrCode, title: "QR codes", desc: "Generate scannable QR codes for any page.", href: "/settings/nfc" },
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-workspace text-ink">
          <LifeBuoy className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-ink">Help & guides</h1>
          <p className="text-sm text-ink-secondary">
            Learn how to get the most out of Fenix.nfc.
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {links.map((l) => (
          <Link
            key={l.title}
            href={l.href}
            className="rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/60"
          >
            <l.icon className="size-5 text-accent" />
            <p className="mt-2 font-medium text-ink">{l.title}</p>
            <p className="text-sm text-ink-secondary">{l.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
