"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, Users, MousePointerClick, Target, Inbox, ScanLine } from "lucide-react";
import { formatCompact } from "@/lib/utils";

interface Metrics {
  views: number;
  uniques: number;
  clicks: number;
  ctr: number;
  leads: number;
  conversion: number;
  scans: number;
}

export function StatCards({
  metrics,
  series,
}: {
  metrics: Metrics;
  series: { date: string; views: number }[];
}) {
  const cards = [
    { icon: Eye, label: "Views", value: formatCompact(metrics.views) },
    { icon: Users, label: "Unique visitors", value: formatCompact(metrics.uniques) },
    { icon: MousePointerClick, label: "Clicks", value: formatCompact(metrics.clicks) },
    { icon: Target, label: "CTR", value: `${metrics.ctr}%` },
    { icon: Inbox, label: "Leads", value: formatCompact(metrics.leads) },
    { icon: ScanLine, label: "NFC scans", value: formatCompact(metrics.scans) },
  ];

  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-line bg-surface p-4">
            <c.icon className="size-4 text-ink-secondary" />
            <p className="mt-2 text-2xl font-semibold text-ink">{c.value}</p>
            <p className="text-xs text-ink-secondary">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-line bg-surface p-4">
        <p className="mb-3 text-sm font-medium text-ink">Views over time</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ left: -20, right: 8, top: 8 }}>
              <defs>
                <linearGradient id="fxViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D6A84B" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#D6A84B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#858B92" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#858B92" }}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E1E4E7",
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#C3953B"
                strokeWidth={2}
                fill="url(#fxViews)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
