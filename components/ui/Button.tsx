import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function Button({ href, children, variant = "primary", className = "" }: { href: string; children: ReactNode; variant?: "primary" | "ghost" | "light"; className?: string }) {
  return <a href={href} className={`button button-${variant} ${className}`}>{children}<ArrowRight size={18} aria-hidden /></a>;
}
