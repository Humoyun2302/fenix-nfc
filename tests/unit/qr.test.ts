import { describe, expect, it } from "vitest";
import { generateQrSvg } from "@/lib/qr";

describe("QR generation", () => {
  it("creates SVG QR output for a URL", async () => {
    const svg = await generateQrSvg("https://fenixnfc.uz/p/menu");
    expect(svg).toContain("<svg");
    expect(svg).toContain("path");
  });
});
