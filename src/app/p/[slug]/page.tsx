import { notFound } from "next/navigation";
import { BlockRenderer } from "@/components/blocks/block-renderer";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { PublishedSnapshot } from "@/types/product";

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!hasSupabaseEnv()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
        <div>
          <h1 className="text-xl font-semibold">Public page runtime is not configured</h1>
          <p className="mt-2 text-sm text-muted">Connect Supabase and publish a page to serve this URL.</p>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: page } = await supabase
    .from("pages")
    .select("id, workspace_id, title, slug, status, published_snapshot")
    .eq("slug", slug)
    .single();

  if (!page || page.status === "archived") notFound();
  if (page.status === "disabled") {
    return <State title="Page disabled" text="This page is temporarily unavailable." />;
  }
  if (page.status !== "published" || !page.published_snapshot) {
    return <State title="Page unpublished" text="The owner has not published this page yet." />;
  }

  const snapshot = page.published_snapshot as unknown as PublishedSnapshot;
  await supabase.from("analytics_events").insert({
    workspace_id: page.workspace_id,
    page_id: page.id,
    event_type: "page_view",
    metadata: { slug },
  });

  return (
    <main
      className="min-h-screen py-5"
      style={{ background: snapshot.page.draft_design.backgroundColor, color: snapshot.page.draft_design.textColor }}
    >
      <section
        className="mx-auto space-y-3"
        style={{
          maxWidth: snapshot.page.draft_design.contentWidth,
          padding: snapshot.page.draft_design.pagePadding,
        }}
      >
        {snapshot.blocks.map((block) => (
          <BlockRenderer block={block} design={snapshot.page.draft_design} key={block.id} />
        ))}
      </section>
    </main>
  );
}

function State({ title, text }: { title: string; text: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 text-center">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-muted">{text}</p>
      </div>
    </main>
  );
}
