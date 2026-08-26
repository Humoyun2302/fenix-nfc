import { describe, expect, it } from "vitest";
import { isSafeRedirectUrl, resolveNfcDestination } from "@/lib/nfc";

describe("NFC destination resolution", () => {
  it("rejects unsafe schemes", () => {
    expect(isSafeRedirectUrl("javascript:alert(1)")).toBe(false);
  });

  it("prefers assigned URLs and falls back to page slugs", () => {
    expect(resolveNfcDestination({ appUrl: "https://fenixnfc.uz", assignedPageSlug: "menu" })).toBe(
      "https://fenixnfc.uz/p/menu",
    );
    expect(resolveNfcDestination({ appUrl: "https://fenixnfc.uz", assignedUrl: "https://example.com" })).toBe(
      "https://example.com",
    );
  });
});
