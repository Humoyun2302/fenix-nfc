import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/states";
import { Globe, Info } from "lucide-react";
import type { DomainRow } from "@/types/database";

export const metadata: Metadata = { title: "Domains" };

export default async function DomainsPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string }>;
}) {
  const { ws } = await searchParams;
  const active = await getActiveWorkspace(ws);
  const supabase = await createClient();
  const { data } = await supabase
    .from("domains")
    .select("*")
    .eq("workspace_id", active.workspace.id);
  const domains = (data ?? []) as DomainRow[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Custom domains</h1>
        <p className="text-sm text-ink-secondary">
          Connect your own domain to serve your published pages.
        </p>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-info/30 bg-info/5 p-4 text-sm text-ink">
        <Info className="mt-0.5 size-4 shrink-0 text-info" />
        <p>
          Custom domains are available on paid plans. After adding a domain you&apos;ll
          receive DNS records to verify ownership; status only becomes{" "}
          <strong>Active</strong> once verification and SSL succeed.
        </p>
      </div>

      {domains.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="No domains connected"
          description="Upgrade to a paid plan to connect a custom domain."
        />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {domains.map((d) => (
            <li key={d.id} className="flex items-center justify-between px-4 py-3">
              <span className="font-medium text-ink">{d.hostname}</span>
              <span className="rounded-full bg-workspace px-2.5 py-1 text-xs font-medium text-ink-secondary">
                {d.status.replace(/_/g, " ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
