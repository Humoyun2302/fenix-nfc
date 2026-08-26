import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { Bell } from "lucide-react";

export const metadata: Metadata = { title: "Notification settings" };

const EVENTS = [
  "New lead",
  "New form submission",
  "New payment",
  "NFC scan spike",
  "Subscription expiration",
  "Invitation accepted",
  "Domain connected",
  "Domain failure",
];

export default async function NotificationSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string }>;
}) {
  const { ws } = await searchParams;
  await getActiveWorkspace(ws);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-workspace text-ink">
          <Bell className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold text-ink">Notification settings</h1>
          <p className="text-sm text-ink-secondary">
            Choose which events notify you and where.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2 border-b border-line bg-workspace px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-ink-secondary">
          <span>Event</span>
          <span className="w-14 text-center">In-app</span>
          <span className="w-14 text-center">Email</span>
          <span className="w-14 text-center">Telegram</span>
        </div>
        <ul className="divide-y divide-line">
          {EVENTS.map((event) => (
            <li
              key={event}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 px-4 py-3 text-sm"
            >
              <span className="text-ink">{event}</span>
              {["inapp", "email", "telegram"].map((channel) => (
                <span key={channel} className="flex w-14 justify-center">
                  <input
                    type="checkbox"
                    defaultChecked={channel === "inapp"}
                    aria-label={`${event} via ${channel}`}
                    className="size-4 accent-[var(--fx-accent)]"
                  />
                </span>
              ))}
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-3 text-xs text-ink-secondary">
        Email and Telegram delivery require the matching integration to be
        connected.
      </p>
    </div>
  );
}
