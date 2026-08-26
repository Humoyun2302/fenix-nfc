import { NextResponse } from "next/server";
import { z } from "zod";
import { generateQrPngDataUrl, generateQrSvg } from "@/lib/qr";

const qrSchema = z.object({
  value: z.url(),
  format: z.enum(["svg", "png"]).default("svg"),
  foreground: z.string().default("#171717"),
  background: z.string().default("#FFFFFF"),
});

export async function POST(request: Request) {
  const parsed = qrSchema.parse(await request.json());
  const data =
    parsed.format === "svg"
      ? await generateQrSvg(parsed.value, parsed)
      : await generateQrPngDataUrl(parsed.value, parsed);
  return NextResponse.json({ data });
}
