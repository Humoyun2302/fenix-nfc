import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { publicFormSubmissionSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  if (!hasSupabaseEnv()) {
    return NextResponse.json({ error: "Forms are not configured." }, { status: 503 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await request.json()
    : Object.fromEntries((await request.formData()).entries());

  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (key.startsWith("fields.")) fields[key.replace("fields.", "")] = String(value);
  }

  const parsed = publicFormSubmissionSchema.parse({
    workspaceId: payload.workspaceId,
    pageId: payload.pageId,
    blockId: payload.blockId,
    visitorId: payload.visitorId,
    fields: Object.keys(fields).length ? fields : payload.fields,
  });

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    workspace_id: parsed.workspaceId,
    page_id: parsed.pageId,
    block_id: parsed.blockId,
    name: typeof parsed.fields.name === "string" ? parsed.fields.name : null,
    phone: typeof parsed.fields.phone === "string" ? parsed.fields.phone : null,
    email: typeof parsed.fields.email === "string" ? parsed.fields.email : null,
    form_data: parsed.fields,
    status: "new",
  });
  if (error) return NextResponse.json({ error: "Lead could not be created." }, { status: 400 });

  await supabase.from("analytics_events").insert({
    workspace_id: parsed.workspaceId,
    page_id: parsed.pageId,
    block_id: parsed.blockId,
    event_type: "form_submission",
    visitor_id: parsed.visitorId,
    metadata: {},
  });

  if (contentType.includes("application/json")) {
    return NextResponse.json({ ok: true });
  }
  return new Response("Thank you. Your request was sent.", {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
