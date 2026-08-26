const allowedProtocols = new Set(["http:", "https:"]);

export function isSafeRedirectUrl(value: string) {
  try {
    const url = new URL(value);
    return allowedProtocols.has(url.protocol);
  } catch {
    return false;
  }
}

export function resolveNfcDestination(input: {
  appUrl: string;
  assignedPageSlug?: string | null;
  assignedUrl?: string | null;
}) {
  if (input.assignedUrl) {
    if (!isSafeRedirectUrl(input.assignedUrl)) {
      throw new Error("Unsafe NFC redirect URL.");
    }
    return input.assignedUrl;
  }

  if (input.assignedPageSlug) {
    return `${input.appUrl.replace(/\/$/, "")}/p/${input.assignedPageSlug}`;
  }

  throw new Error("NFC tag has no destination.");
}
