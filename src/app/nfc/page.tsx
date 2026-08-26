import { Copy, ScanLine } from "lucide-react";
import { AppTopNav } from "@/components/navigation/app-top-nav";
import { Button } from "@/components/ui/button";
import { ConfigRequired } from "@/components/ui/config-required";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function NfcPage() {
  if (!hasSupabaseEnv()) return <ConfigRequired />;
  const supabase = await createClient();
  const { data: tags } = await supabase
    .from("nfc_tags")
    .select("id, public_code, tag_name, status, total_scans, last_scan_at")
    .order("created_at", { ascending: false })
    .limit(50);
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://fenixnfc.uz";
  return (
    <>
      <AppTopNav active="Settings" />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <h1 className="text-xl font-semibold">NFC tags</h1>
        <p className="mt-1 text-sm text-muted">Managed tag URLs stay stable while destinations can change.</p>
        <section className="mt-5 grid gap-3">
          {tags?.length ? tags.map((tag) => (
            <article className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-white p-4" key={tag.id}>
              <div>
                <h2 className="font-semibold">{tag.tag_name}</h2>
                <p className="mt-1 text-xs text-muted">{base}/t/{tag.public_code} · {tag.status}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <ScanLine className="h-4 w-4" /> {tag.total_scans}
                <Button variant="secondary"><Copy className="h-4 w-4" /> Copy</Button>
              </div>
            </article>
          )) : <div className="rounded-lg border border-border bg-white p-8 text-center text-sm text-muted">No tags yet.</div>}
        </section>
      </main>
    </>
  );
}
