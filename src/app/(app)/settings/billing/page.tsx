import type { Metadata } from "next";
import { getActiveWorkspace } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { Check, Info } from "lucide-react";
import type { PlanRow, SubscriptionRow } from "@/types/database";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ ws?: string }>;
}) {
  const { ws } = await searchParams;
  const active = await getActiveWorkspace(ws);
  const supabase = await createClient();

  const [{ data: plans }, { data: subscription }] = await Promise.all([
    supabase.from("plans").select("*").eq("is_active", true).order("sort_order"),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("workspace_id", active.workspace.id)
      .maybeSingle(),
  ]);

  const currentPlanId = (subscription as SubscriptionRow | null)?.plan_id;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Billing</h1>
        <p className="text-sm text-ink-secondary">
          Your current plan and available upgrades.
        </p>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-info/30 bg-info/5 p-4 text-sm text-ink">
        <Info className="mt-0.5 size-4 shrink-0 text-info" />
        <p>
          Payments are not configured in this environment. Upgrades are managed by
          a Fenix.nfc administrator. Connect a payment provider (Click, Payme or
          Stripe) to enable self-service checkout.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {((plans ?? []) as PlanRow[]).map((plan) => {
          const isCurrent = plan.id === currentPlanId;
          const limits = plan.limits as Record<string, number>;
          return (
            <div
              key={plan.id}
              className={
                isCurrent
                  ? "rounded-xl border-2 border-accent bg-surface p-5"
                  : "rounded-xl border border-line bg-surface p-5"
              }
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-ink">{plan.name}</h2>
                {isCurrent ? (
                  <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                    Current
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-2xl font-semibold text-ink">
                {plan.price > 0
                  ? `${new Intl.NumberFormat("en").format(plan.price)} ${plan.currency}`
                  : "Free"}
                {plan.price > 0 && plan.billing_interval !== "once" ? (
                  <span className="text-sm font-normal text-ink-secondary">
                    {" "}
                    /{plan.billing_interval}
                  </span>
                ) : null}
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-secondary">
                <PlanLimit label="Pages" value={limits.pages} />
                <PlanLimit label="NFC tags" value={limits.nfc_tags} />
                <PlanLimit label="Team members" value={limits.members} />
                <PlanLimit label="Custom domains" value={limits.custom_domains} />
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlanLimit({ label, value }: { label: string; value: number }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="size-4 text-success" />
      {label}: {value === -1 ? "Unlimited" : value}
    </li>
  );
}
