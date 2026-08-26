import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { Send, Mail, Webhook, BarChart3, Tag } from "lucide-react";
import type { IntegrationRow, IntegrationType } from "@/types/database";

export const metadata: Metadata = { title: "Integrations" };

const CATALOG: { type: IntegrationType; name: string; desc: string; icon: typeof Send }[] = [
  { type: "telegram", name: "Telegram", desc: "Get new-lead alerts in Telegram.", icon: Send },
  { type: "email", name: "Email notifications", desc: "Email alerts for form submissions.", icon: Mail },
  { type: "webhook", name: "Webhooks", desc: "POST events to your endpoint.", icon: Webhook },
  { type: "google_analytics", name: "Google Analytics", desc: "Track pages with GA4.", icon: BarChart3 },
  { type: "meta_pixel", name: "Meta Pixel", desc: "Attribute conversions on Meta.", icon: Tag },
  { type: "tiktok_pixel", name: "TikTok Pixel", desc: "Attribute conversions on TikTok.", icon: Tag },
];

export default async function IntegrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string }>;
}) {
  const { ws } = await searchParams;
  const active = await getActiveWorkspace(ws);
  const supabase = await createClient();
  const { data } = await supabase
    .from("integrations")
    .select("type, status")
    .eq("workspace_id", active.workspace.id);
  const connected = new Map(
    ((data ?? []) as Pick<IntegrationRow, "type" | "status">[]).map((i) => [i.type, i.status]),
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Integrations</h1>
        <p className="text-sm text-ink-secondary">
          Connect Fenix.nfc to your other tools.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {CATALOG.map((item) => {
          const status = connected.get(item.type);
          return (
            <div key={item.type} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="flex size-10 items-center justify-center rounded-lg bg-workspace text-ink">
                  <item.icon className="size-5" />
                </span>
                <span
                  className={
                    status === "connected"
                      ? "rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success"
                      : "rounded-full bg-workspace px-2 py-0.5 text-xs font-medium text-ink-secondary"
                  }
                >
                  {status === "connected" ? "Connected" : "Not connected"}
                </span>
              </div>
              <p className="mt-3 font-medium text-ink">{item.name}</p>
              <p className="text-sm text-ink-secondary">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
