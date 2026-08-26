import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/states";
import { Package } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ProductRow } from "@/types/database";

export const metadata: Metadata = { title: "Products" };

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string }>;
}) {
  const { ws } = await searchParams;
  const active = await getActiveWorkspace(ws);
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("workspace_id", active.workspace.id)
    .order("sort_order", { ascending: true })
    .limit(200);
  const products = (data ?? []) as ProductRow[];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Products</h1>
        <p className="text-sm text-ink-secondary">
          Your product catalog and restaurant menu items.
        </p>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products yet"
          description="Products you add here can be shown on your pages with product and menu blocks."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p.id} className="rounded-xl border border-line bg-surface p-4">
              <p className="font-medium text-ink">{p.name}</p>
              <p className="mt-1 text-sm text-ink-secondary">
                {p.price != null ? `${p.price} ${p.currency}` : "No price"}
              </p>
              <p className="mt-2 text-xs text-ink-secondary">
                Added {formatDate(p.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
