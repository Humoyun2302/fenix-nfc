import { SectionShell } from "@/components/layout/section-shell";

export default function SettingsPage() {
  return (
    <SectionShell
      active="Settings"
      title="Workspace settings"
      description="Account, team, billing, brand kit, domains, integrations, notifications, and localization."
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {["Brand kit", "Team members", "Billing", "Custom domains", "Integrations", "Notifications"].map((item) => (
          <article className="rounded-lg border border-border bg-white p-4" key={item}>
            <h2 className="font-semibold">{item}</h2>
            <p className="mt-2 text-sm text-muted">Protected workspace module.</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
