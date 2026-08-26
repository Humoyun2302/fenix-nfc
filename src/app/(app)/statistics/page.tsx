import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { StatCards } from "@/components/analytics/stat-cards";
import type { AnalyticsEventType } from "@/types/database";

export const metadata: Metadata = { title: "Statistics" };

export default async function StatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string; range?: string }>;
}) {
  const { ws, range } = await searchParams;
  const active = await getActiveWorkspace(ws);
  const days = range === "30" ? 30 : range === "1" ? 1 : 7;
  // Server component: reading the clock here is intentional and safe.
  // eslint-disable-next-line react-hooks/purity
  const nowMs = Date.now();
  const since = new Date(nowMs - days * 86400000).toISOString();

  const supabase = await createClient();
  const { data: events } = await supabase
    .from("analytics_events")
    .select("type, visitor_id, created_at")
    .eq("workspace_id", active.workspace.id)
    .gte("created_at", since)
    .limit(50000);

  const rows = events ?? [];
  const count = (t: AnalyticsEventType) => rows.filter((r) => r.type === t).length;
  const views = count("page_view");
  const uniques = new Set(
    rows.filter((r) => r.type === "page_view").map((r) => r.visitor_id).filter(Boolean),
  ).size;
  const clicks = count("link_click") + count("button_click");
  const leads = count("form_submission");
  const scans = count("nfc_scan");
  const ctr = views > 0 ? Math.round((clicks / views) * 100) : 0;
  const conversion = views > 0 ? Math.round((leads / views) * 100) : 0;

  // Build a per-day series for the views chart.
  const series: { date: string; views: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(nowMs - i * 86400000);
    const key = d.toISOString().slice(0, 10);
    series.push({
      date: key.slice(5),
      views: rows.filter(
        (r) => r.type === "page_view" && r.created_at.slice(0, 10) === key,
      ).length,
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-ink">Statistics</h1>
          <p className="text-sm text-ink-secondary">
            Real visitor activity across your pages.
          </p>
        </div>
        <div className="flex gap-1 rounded-lg bg-surface p-1">
          {[
            { v: "1", label: "Today" },
            { v: "7", label: "7 days" },
            { v: "30", label: "30 days" },
          ].map((r) => (
            <a
              key={r.v}
              href={`/statistics?range=${r.v}`}
              className={
                String(days) === r.v
                  ? "rounded-md bg-ink px-3 py-1 text-xs font-medium text-white"
                  : "rounded-md px-3 py-1 text-xs font-medium text-ink-secondary"
              }
            >
              {r.label}
            </a>
          ))}
        </div>
      </div>

      <StatCards
        metrics={{ views, uniques, clicks, ctr, leads, conversion, scans }}
        series={series}
      />
    </div>
  );
}
