import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/states";
import { Inbox } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { LeadRow } from "@/types/database";

export const metadata: Metadata = { title: "Leads" };

const STATUS_STYLES: Record<string, string> = {
  new: "bg-info/10 text-info",
  contacted: "bg-warning/10 text-warning",
  qualified: "bg-accent/15 text-accent",
  won: "bg-success/10 text-success",
  lost: "bg-danger/10 text-danger",
};

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string }>;
}) {
  const { ws } = await searchParams;
  const active = await getActiveWorkspace(ws);
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .eq("workspace_id", active.workspace.id)
    .order("created_at", { ascending: false })
    .limit(200);
  const leads = (data ?? []) as LeadRow[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Leads</h1>
        <p className="text-sm text-ink-secondary">
          Submissions captured by your published forms.
        </p>
      </div>

      {leads.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No leads yet"
          description="When visitors submit a form on a published page, their details appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-line bg-surface">
          <div className="hidden grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr] gap-2 border-b border-line bg-workspace px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-ink-secondary sm:grid">
            <span>Name</span>
            <span>Phone</span>
            <span>Email</span>
            <span>Status</span>
            <span>Date</span>
          </div>
          <ul className="divide-y divide-line">
            {leads.map((lead) => (
              <li
                key={lead.id}
                className="grid grid-cols-1 gap-1 px-4 py-3 text-sm sm:grid-cols-[1.5fr_1fr_1fr_0.8fr_0.8fr] sm:items-center sm:gap-2"
              >
                <span className="font-medium text-ink">{lead.name ?? "—"}</span>
                <span className="text-ink-secondary">{lead.phone ?? "—"}</span>
                <span className="truncate text-ink-secondary">{lead.email ?? "—"}</span>
                <span>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[lead.status] ?? "bg-workspace text-ink-secondary"}`}
                  >
                    {lead.status}
                  </span>
                </span>
                <span className="text-xs text-ink-secondary">
                  {formatDate(lead.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
