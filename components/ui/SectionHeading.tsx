"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
}) {
  const reduced = useReducedMotion();
  const item = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.7, ease: EASE, delay },
        };

  return (
    <div className={`section-heading ${align === "center" ? "text-center mx-auto" : ""}`}>
      <motion.p className="eyebrow" {...item(0)}>{eyebrow}</motion.p>
      <motion.h2 {...item(0.08)}>{title}</motion.h2>
      {text && <motion.p className="section-copy" {...item(0.16)}>{text}</motion.p>}
    </div>
  );
}

export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
