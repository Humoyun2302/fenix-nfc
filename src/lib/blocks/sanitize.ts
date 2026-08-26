/**
 * Minimal server-side HTML sanitizer for the custom HTML block. It strips
 * script/style/iframe/object tags, inline event handlers, and dangerous URL
 * protocols. For richer needs, swap in a dedicated library (e.g. sanitize-html)
 * behind this same interface.
 */
const DANGEROUS_TAGS =
  /<\s*(script|style|iframe|object|embed|form|link|meta|base)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const SELF_CLOSING_DANGEROUS =
  /<\s*(script|style|iframe|object|embed|link|meta|base)\b[^>]*\/?>/gi;
const EVENT_HANDLERS = /\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
const JS_PROTOCOL = /(href|src)\s*=\s*("|')\s*javascript:[^"']*(\2)/gi;

export function sanitizeHtml(input: string): string {
  if (!input) return "";
  return input
    .replace(DANGEROUS_TAGS, "")
    .replace(SELF_CLOSING_DANGEROUS, "")
    .replace(EVENT_HANDLERS, "")
    .replace(JS_PROTOCOL, "$1=$2#$2")
    .slice(0, 20000);
}
