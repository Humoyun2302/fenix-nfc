import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/utils";

describe("slugify", () => {
  it("normalizes user page slugs", () => {
    expect(slugify("  Premium Café Menu!!! ")).toBe("premium-cafe-menu");
  });
});
