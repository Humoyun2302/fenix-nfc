import { NextResponse, type NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/env";

/**
 * Managed NFC redirect: https://fenixnfc.uz/t/ABCD1234
 * Validates the code, records the scan, resolves the destination, and redirects.
 * Only http(s) destinations are allowed to prevent unsafe redirects.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  if (!/^[A-Za-z0-9]{4,32}$/.test(code)) {
    return NextResponse.redirect(new URL("/nfc-status?state=invalid", siteUrl));
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const ipHash = ip ? createHash("sha256").update(ip).digest("hex") : null;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("fx_resolve_nfc", {
    payload: {
      code,
      ip_hash: ipHash,
      user_agent: request.headers.get("user-agent"),
      referrer: request.headers.get("referer"),
    },
  });

  if (error || !data || typeof data !== "object") {
    return NextResponse.redirect(new URL("/nfc-status?state=invalid", siteUrl));
  }

  const payload = data as Record<string, unknown>;
  const state = payload.state as string;

  if (state !== "ok") {
    return NextResponse.redirect(new URL(`/nfc-status?state=${state}`, siteUrl));
  }

  if (payload.target_type === "url") {
    const url = String(payload.url ?? "");
    if (!/^https?:\/\//i.test(url)) {
      return NextResponse.redirect(new URL("/nfc-status?state=invalid", siteUrl));
    }
    return NextResponse.redirect(url);
  }

  const slug = String(payload.slug ?? "");
  return NextResponse.redirect(new URL(`/p/${slug}`, siteUrl));
}
