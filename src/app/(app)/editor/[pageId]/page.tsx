import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser, getMemberRole } from "@/lib/workspace/context";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";
import { EditorClient } from "@/components/editor/editor-client";
import type { BlockRow, PageRow, ThemeRow } from "@/types/database";
import type { EditorBlock } from "@/lib/blocks/types";

export const metadata: Metadata = { title: "Editor" };

export default async function EditorPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  await requireUser();
  const { pageId } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("id", pageId)
    .maybeSingle();

  if (!page) notFound();

  const role = await getMemberRole(page.workspace_id);
  if (!role) notFound();

  const { data: blocks } = await supabase
    .from("blocks")
    .select("*")
    .eq("page_id", pageId)
    .order("position", { ascending: true });

  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .is("workspace_id", null)
    .order("sort_order", { ascending: true });

  const editorBlocks: EditorBlock[] = ((blocks ?? []) as BlockRow[]).map((b) => ({
    id: b.id,
    type: b.type as EditorBlock["type"],
    position: b.position,
    content: b.content as EditorBlock["content"],
    design: b.design as EditorBlock["design"],
    is_visible: b.is_visible,
    schedule_start: b.schedule_start,
    schedule_end: b.schedule_end,
  }));

  return (
    <EditorClient
      page={page as PageRow}
      role={role}
      initialBlocks={editorBlocks}
      themes={(themes ?? []) as ThemeRow[]}
      siteUrl={siteUrl}
    />
  );
}
