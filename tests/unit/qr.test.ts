import { describe, it, expect } from "vitest";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import { generateQrPng, generateQrSvg, contrastWarning } from "@/lib/qr/generate";

function decodePngDataUrl(dataUrl: string): string | null {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  const png = PNG.sync.read(buffer);
  const result = jsQR(
    new Uint8ClampedArray(png.data),
    png.width,
    png.height,
  );
  return result?.data ?? null;
}

describe("qr generation", () => {
  it("produces a scannable PNG that decodes to the original value", async () => {
    const value = "https://fenixnfc.uz/t/ABCD2345";
    const dataUrl = await generateQrPng(value, { size: 256 });
    expect(dataUrl.startsWith("data:image/png;base64,")).toBe(true);
    expect(decodePngDataUrl(dataUrl)).toBe(value);
  });

  it("encodes a page URL correctly", async () => {
    const value = "https://fenixnfc.uz/p/acme-home";
    const decoded = decodePngDataUrl(await generateQrPng(value, { size: 320 }));
    expect(decoded).toBe(value);
  });

  it("produces valid SVG output", async () => {
    const svg = await generateQrSvg("https://fenixnfc.uz");
    expect(svg).toContain("<svg");
    expect(svg).toContain("</svg>");
  });

  it("warns on low contrast", () => {
    expect(contrastWarning("#FFFFFF", "#FEFEFE")).toBeTruthy();
    expect(contrastWarning("#000000", "#FFFFFF")).toBeNull();
  });
});
