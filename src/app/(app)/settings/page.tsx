import type { Metadata } from "next";
import Link from "next/link";
import {
  User,
  Building2,
  CreditCard,
  Users,
  ScanLine,
  Globe,
  Plug,
  Bell,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = { title: "Settings" };

const SECTIONS = [
  { href: "/settings/account", icon: User, title: "Account", desc: "Profile, password and account." },
  { href: "/settings/workspace", icon: Building2, title: "Workspace", desc: "Name, slug and general settings." },
  { href: "/settings/members", icon: Users, title: "Team members", desc: "Invite and manage roles." },
  { href: "/settings/billing", icon: CreditCard, title: "Billing", desc: "Plan, subscription and payments." },
  { href: "/settings/nfc", icon: ScanLine, title: "NFC tags", desc: "Manage tags and assignments." },
  { href: "/settings/domains", icon: Globe, title: "Domains", desc: "Connect custom domains." },
  { href: "/settings/integrations", icon: Plug, title: "Integrations", desc: "Telegram, webhooks and more." },
  { href: "/settings/notifications", icon: Bell, title: "Notifications", desc: "Choose what you're notified about." },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Settings</h1>
        <p className="text-sm text-ink-secondary">
          Manage your account, workspace and integrations.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-accent/60"
          >
            <span className="flex size-10 items-center justify-center rounded-lg bg-workspace text-ink">
              <s.icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-ink">{s.title}</span>
              <span className="block truncate text-sm text-ink-secondary">
                {s.desc}
              </span>
            </span>
            <ChevronRight className="size-4 text-ink-secondary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
