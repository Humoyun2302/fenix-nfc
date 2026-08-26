import { AppTopNav } from "@/components/navigation/app-top-nav";
import { ConfigRequired } from "@/components/ui/config-required";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function LeadsPage() {
  if (!hasSupabaseEnv()) return <ConfigRequired />;
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("id, name, phone, email, status, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  return (
    <>
      <AppTopNav active="Leads" />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <h1 className="text-xl font-semibold">Leads</h1>
        <p className="mt-1 text-sm text-muted">Search, qualify, export, or anonymize submissions.</p>
        <section className="mt-5 overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-border bg-zinc-50 text-xs text-muted">
              <tr><th className="p-3">Name</th><th>Phone</th><th>Email</th><th>Status</th><th>Created</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads?.length ? leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="p-3">{lead.name ?? "Unknown"}</td>
                  <td>{lead.phone ?? "—"}</td>
                  <td>{lead.email ?? "—"}</td>
                  <td>{lead.status}</td>
                  <td>{new Date(lead.created_at).toLocaleString()}</td>
                </tr>
              )) : (
                <tr><td className="p-8 text-center text-muted" colSpan={5}>No leads yet.</td></tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
