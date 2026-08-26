import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { analyticsSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) return NextResponse.json({ error: "Analytics are not configured." }, { status: 503 });
  const parsed = analyticsSchema.parse(await request.json());
  const supabase = await createClient();
  const { error } = await supabase.from("analytics_events").insert({
    workspace_id: parsed.workspaceId,
    page_id: parsed.pageId,
    block_id: parsed.blockId,
    event_type: parsed.eventType,
    visitor_id: parsed.visitorId,
    metadata: parsed.metadata,
  });
  if (error) return NextResponse.json({ error: "Event could not be recorded." }, { status: 400 });
  return NextResponse.json({ ok: true });
}
