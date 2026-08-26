import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "@/lib/blocks/sanitize";

describe("html sanitizer", () => {
  it("keeps safe markup", () => {
    const input = "<p>Hello <strong>world</strong></p>";
    expect(sanitizeHtml(input)).toBe(input);
  });

  it("removes script tags", () => {
    const out = sanitizeHtml('<p>ok</p><script>alert(1)</script>');
    expect(out).not.toContain("<script");
    expect(out).toContain("<p>ok</p>");
  });

  it("strips inline event handlers", () => {
    const out = sanitizeHtml('<a href="#" onclick="steal()">x</a>');
    expect(out).not.toContain("onclick");
  });

  it("neutralizes javascript: URLs", () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">x</a>');
    expect(out).not.toContain("javascript:");
  });

  it("removes iframes and style tags", () => {
    const out = sanitizeHtml('<iframe src="evil"></iframe><style>x{}</style><p>ok</p>');
    expect(out).not.toContain("<iframe");
    expect(out).not.toContain("<style");
    expect(out).toContain("<p>ok</p>");
  });
});
