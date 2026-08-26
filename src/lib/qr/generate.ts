import QRCode from "qrcode";

export interface QrOptions {
  foreground?: string;
  background?: string;
  margin?: number;
  size?: number;
  errorCorrection?: "L" | "M" | "Q" | "H";
}

const DEFAULTS: Required<QrOptions> = {
  foreground: "#171717",
  background: "#FFFFFF",
  margin: 2,
  size: 512,
  errorCorrection: "M",
};

function resolve(options?: QrOptions): Required<QrOptions> {
  return { ...DEFAULTS, ...options };
}

/** Generate a PNG data URL for the given value. Works in browser and Node. */
export async function generateQrPng(value: string, options?: QrOptions): Promise<string> {
  const o = resolve(options);
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: o.errorCorrection,
    margin: o.margin,
    width: o.size,
    color: { dark: o.foreground, light: o.background },
  });
}

/** Generate an SVG string for the given value. */
export async function generateQrSvg(value: string, options?: QrOptions): Promise<string> {
  const o = resolve(options);
  return QRCode.toString(value, {
    type: "svg",
    errorCorrectionLevel: o.errorCorrection,
    margin: o.margin,
    width: o.size,
    color: { dark: o.foreground, light: o.background },
  });
}

/**
 * Basic contrast check between foreground and background (WCAG-ish). Returns a
 * warning message if the contrast is likely too low to scan reliably.
 */
export function contrastWarning(fg: string, bg: string): string | null {
  const ratio = contrastRatio(fg, bg);
  return ratio < 2.5
    ? "Low contrast — this QR code may be hard to scan. Increase the difference between colors."
    : null;
}

function contrastRatio(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

function luminance(hex: string): number {
  const c = hex.replace("#", "");
  const full = c.length === 3 ? c.split("").map((ch) => ch + ch).join("") : c;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const bl = parseInt(full.slice(4, 6), 16) / 255;
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(bl);
}
