import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  workspaceId: z.string().uuid(),
  pageId: z.string().uuid().optional().nullable(),
  blockId: z.string().uuid().optional().nullable(),
  type: z.enum([
    "page_view",
    "link_click",
    "button_click",
    "product_click",
    "form_start",
    "qr_redirect",
  ]),
  visitorId: z.string().max(64).optional().nullable(),
  referrer: z.string().max(512).optional().nullable(),
  utm: z.record(z.string(), z.string().nullable()).optional(),
});

function parseUA(ua: string) {
  const mobile = /Mobile|Android|iPhone|iPad/i.test(ua);
  return { device: mobile ? "mobile" : "desktop" };
}

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const ua = request.headers.get("user-agent") ?? "";
  const { device } = parseUA(ua);
  const supabase = await createClient();

  const { error } = await supabase.rpc("fx_track_event", {
    payload: {
      workspace_id: parsed.data.workspaceId,
      page_id: parsed.data.pageId ?? null,
      block_id: parsed.data.blockId ?? null,
      type: parsed.data.type,
      visitor_id: parsed.data.visitorId ?? null,
      device,
      referrer: parsed.data.referrer ?? null,
      utm: parsed.data.utm ?? {},
    },
  });

  if (error) {
    return NextResponse.json({ error: "Could not record event" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
