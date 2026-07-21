import type { ElementType, ReactNode } from "react";

export function GlassCard({ children, className = "", as: Tag = "article" }: { children: ReactNode; className?: string; as?: ElementType }) {
  return <Tag className={`glass-card ${className}`}>{children}</Tag>;
}
