import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  formId: z.string().uuid(),
  workspaceId: z.string().uuid().optional().nullable(),
  pageId: z.string().uuid().optional().nullable(),
  blockId: z.string().uuid().optional().nullable(),
  data: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])),
  utm: z.record(z.string(), z.string().nullable()).optional(),
  // Honeypot: must be empty (basic spam protection).
  company_website: z.string().optional(),
});

export async function POST(request: NextRequest) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 },
    );
  }

  // Spam honeypot — silently accept but do nothing.
  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex") : null;
  const ua = request.headers.get("user-agent") ?? null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("fx_submit_form", {
    payload: {
      form_id: parsed.data.formId,
      page_id: parsed.data.pageId ?? null,
      block_id: parsed.data.blockId ?? null,
      data: parsed.data.data,
      utm: parsed.data.utm ?? {},
      ip_hash: ipHash,
      user_agent: ua,
      referrer: request.headers.get("referer"),
    },
  });

  if (error) {
    return NextResponse.json(
      { error: "We couldn't submit the form. Please try again." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, result: data });
}
