import type { Metadata } from "next";
import { requireUser } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/states";
import { Bell } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { NotificationRow } from "@/types/database";

export const metadata: Metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  const notifications = (data ?? []) as NotificationRow[];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Notifications</h1>
        <p className="text-sm text-ink-secondary">
          Activity across your workspaces.
        </p>
      </div>
      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="You're all caught up"
          description="New leads, payments and NFC activity will show up here."
        />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
          {notifications.map((n) => (
            <li key={n.id} className="flex items-start gap-3 px-4 py-3">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-accent" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{n.title}</p>
                {n.body ? (
                  <p className="text-sm text-ink-secondary">{n.body}</p>
                ) : null}
                <p className="mt-0.5 text-xs text-ink-secondary">
                  {formatDate(n.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
