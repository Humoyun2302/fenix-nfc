import { describe, it, expect } from "vitest";
import { slugSchema, isReservedSlug } from "@/lib/validation/workspace";

describe("slug validation", () => {
  it("accepts valid slugs", () => {
    expect(slugSchema.safeParse("acme-studio").success).toBe(true);
    expect(slugSchema.safeParse("my-page-1").success).toBe(true);
  });

  it("rejects invalid slugs", () => {
    expect(slugSchema.safeParse("ab").success).toBe(false); // too short
    expect(slugSchema.safeParse("Has Spaces").success).toBe(false);
    expect(slugSchema.safeParse("double--hyphen").success).toBe(false);
    expect(slugSchema.safeParse("-leading").success).toBe(false);
    expect(slugSchema.safeParse("trailing-").success).toBe(false);
  });

  it("normalizes case", () => {
    const parsed = slugSchema.safeParse("MyCafe123");
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data).toBe("mycafe123");
  });

  it("flags reserved slugs", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("dashboard")).toBe(true);
    expect(isReservedSlug("p")).toBe(true);
    expect(isReservedSlug("t")).toBe(true);
    expect(isReservedSlug("my-cafe")).toBe(false);
  });
});
