import { SectionShell } from "@/components/layout/section-shell";

export default function ProductsPage() {
  return (
    <SectionShell
      active="Products"
      title="Products and menus"
      description="Manage product cards, categories, restaurant dishes, prices, availability, and menu languages."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {["Product catalog", "Restaurant menu", "Availability", "Languages"].map((item) => (
          <article className="rounded-lg border border-border bg-white p-4" key={item}>
            <h2 className="font-semibold">{item}</h2>
            <p className="mt-2 text-sm text-muted">Database tables and RLS are ready for this workflow.</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
