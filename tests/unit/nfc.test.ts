import { describe, it, expect } from "vitest";
import { generateNfcCode, isValidNfcCode } from "@/lib/nfc/code";

describe("nfc codes", () => {
  it("generates 8-char codes from the safe alphabet", () => {
    for (let i = 0; i < 50; i++) {
      const code = generateNfcCode();
      expect(code).toHaveLength(8);
      expect(/^[A-HJ-NP-Z2-9]+$/.test(code)).toBe(true);
    }
  });

  it("generates unique codes", () => {
    const set = new Set(Array.from({ length: 500 }, () => generateNfcCode()));
    expect(set.size).toBe(500);
  });

  it("validates code format for redirects", () => {
    expect(isValidNfcCode("ABCD2345")).toBe(true);
    expect(isValidNfcCode("ab")).toBe(false);
    expect(isValidNfcCode("has space")).toBe(false);
    expect(isValidNfcCode("../etc")).toBe(false);
  });
});
