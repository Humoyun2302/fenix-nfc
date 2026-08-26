import { notFound } from "next/navigation";
import { AppTopNav } from "@/components/navigation/app-top-nav";
import { ConfigRequired } from "@/components/ui/config-required";
import { EditorClient } from "@/components/editor/editor-client";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import type { EditorBlock, PageRecord } from "@/types/product";

export default async function EditorPage({ params }: { params: Promise<{ pageId: string }> }) {
  if (!hasSupabaseEnv()) return <ConfigRequired />;
  const { pageId } = await params;
  const supabase = await createClient();
  const { data: page } = await supabase.from("pages").select("*").eq("id", pageId).single();
  if (!page) notFound();

  const { data: blocks } = await supabase.from("blocks").select("*").eq("page_id", pageId).order("position");
  const { data: workspace } = await supabase.from("workspaces").select("name").eq("id", page.workspace_id).single();

  return (
    <>
      <AppTopNav active="Page" workspaceName={workspace?.name} />
      <EditorClient page={page as unknown as PageRecord} blocks={(blocks ?? []) as unknown as EditorBlock[]} />
    </>
  );
}
