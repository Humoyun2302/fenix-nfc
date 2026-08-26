import { BarChart3, MousePointerClick, ScanLine, Users } from "lucide-react";
import { AppTopNav } from "@/components/navigation/app-top-nav";
import { ConfigRequired } from "@/components/ui/config-required";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function StatisticsPage() {
  if (!hasSupabaseEnv()) return <ConfigRequired />;
  const supabase = await createClient();
  const { count: views } = await supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "page_view");
  const { count: clicks } = await supabase.from("analytics_events").select("id", { count: "exact", head: true }).in("event_type", ["link_click", "button_click"]);
  const { count: leads } = await supabase.from("leads").select("id", { count: "exact", head: true });
  const { count: scans } = await supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("event_type", "nfc_scan");
  const cards = [
    { label: "Views", value: views ?? 0, icon: Users },
    { label: "Clicks", value: clicks ?? 0, icon: MousePointerClick },
    { label: "Leads", value: leads ?? 0, icon: BarChart3 },
    { label: "NFC scans", value: scans ?? 0, icon: ScanLine },
  ];
  return (
    <>
      <AppTopNav active="Statistics" />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <h1 className="text-xl font-semibold">Statistics</h1>
        <p className="mt-1 text-sm text-muted">Live metrics recorded in Supabase.</p>
        <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <article className="rounded-lg border border-border bg-white p-4" key={card.label}>
              <card.icon className="h-5 w-5 text-accent" />
              <p className="mt-3 text-2xl font-semibold">{card.value}</p>
              <p className="text-sm text-muted">{card.label}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
