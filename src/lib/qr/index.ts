import QRCode from "qrcode";

export async function generateQrSvg(value: string, options?: { foreground?: string; background?: string; margin?: number }) {
  return QRCode.toString(value, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: options?.margin ?? 2,
    color: {
      dark: options?.foreground ?? "#171717",
      light: options?.background ?? "#FFFFFF",
    },
  });
}

export async function generateQrPngDataUrl(value: string, options?: { foreground?: string; background?: string; size?: number }) {
  return QRCode.toDataURL(value, {
    width: options?.size ?? 1024,
    errorCorrectionLevel: "M",
    color: {
      dark: options?.foreground ?? "#171717",
      light: options?.background ?? "#FFFFFF",
    },
  });
}
