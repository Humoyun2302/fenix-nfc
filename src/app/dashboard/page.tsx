import Link from "next/link";
import { Plus } from "lucide-react";
import { AppTopNav } from "@/components/navigation/app-top-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfigRequired } from "@/components/ui/config-required";
import { hasSupabaseEnv } from "@/lib/env";
import { formatPublicUrl } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { createPageAction, createWorkspaceAction } from "@/app/dashboard/actions";

export default async function DashboardPage() {
  if (!hasSupabaseEnv()) return <ConfigRequired />;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: memberships } = await supabase
    .from("workspace_members")
    .select("workspace_id, role, workspaces(id, name, slug, status)")
    .eq("user_id", user.id)
    .limit(1);

  const membership = memberships?.[0] as
    | { workspace_id: string; role: string; workspaces: { id: string; name: string; slug: string; status: string } }
    | undefined;

  const workspace = membership?.workspaces;
  const { data: pages } = workspace
    ? await supabase.from("pages").select("id, title, slug, status, updated_at").eq("workspace_id", workspace.id).order("updated_at", { ascending: false })
    : { data: null };

  return (
    <>
      <AppTopNav active="Page" workspaceName={workspace?.name} />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        {!workspace ? (
          <section className="rounded-lg border border-border bg-white p-5">
            <h1 className="text-xl font-semibold">Create your workspace</h1>
            <p className="mt-2 text-sm text-muted">Every page, lead, NFC tag, and asset belongs to an isolated workspace.</p>
            <form action={createWorkspaceAction} className="mt-5 flex max-w-md gap-2">
              <Input name="name" placeholder="Workspace name" required />
              <Button type="submit">Create</Button>
            </form>
          </section>
        ) : (
          <>
            <section className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold">Pages</h1>
                <p className="mt-1 text-sm text-muted">Draft, publish, and manage NFC-ready pages.</p>
              </div>
              <form action={createPageAction} className="flex flex-wrap gap-2">
                <input name="workspaceId" type="hidden" value={workspace.id} />
                <Input className="w-44" name="title" placeholder="Page name" required />
                <Input className="w-36" name="slug" placeholder="slug" required />
                <Button type="submit">
                  <Plus className="h-4 w-4" /> Create page
                </Button>
              </form>
            </section>
            <section className="mt-5 overflow-hidden rounded-lg border border-border bg-white">
              {pages?.length ? (
                <div className="divide-y divide-border">
                  {pages.map((page) => (
                    <div className="grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-center" key={page.id}>
                      <div>
                        <Link className="font-medium hover:underline" href={`/editor/${page.id}`}>{page.title}</Link>
                        <p className="mt-1 text-xs text-muted">{formatPublicUrl(page.slug)} · {page.status}</p>
                      </div>
                      <Link href={`/editor/${page.id}`}>
                        <Button variant="secondary">Edit</Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-muted">No pages yet. Create one to open the editor.</div>
              )}
            </section>
          </>
        )}
      </main>
    </>
  );
}
