import { SectionShell } from "@/components/layout/section-shell";

export default function AdminPage() {
  return (
    <SectionShell
      active="Settings"
      title="Super-admin"
      description="Prepare customer workspaces, manage subscriptions, audit support actions, and send claim invitations."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          "Customers",
          "Unclaimed workspaces",
          "Pages",
          "Subscriptions",
          "NFC tags",
          "Domains",
          "Payments",
          "Audit logs",
          "Platform settings",
        ].map((item) => (
          <article className="rounded-lg border border-border bg-white p-4" key={item}>
            <h2 className="font-semibold">{item}</h2>
            <p className="mt-2 text-sm text-muted">Admin actions are represented in the schema and audit log table.</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
