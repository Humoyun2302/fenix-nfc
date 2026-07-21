"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function MagneticButton({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  const reduced = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });
  return (
    <motion.a
      className={`button ${light ? "button-light" : ""}`}
      href={href}
      style={{ x, y }}
      onPointerMove={(event) => {
        if (reduced) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - rect.left - rect.width / 2) * 0.18);
        y.set((event.clientY - rect.top - rect.height / 2) * 0.18);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}<ArrowRight size={18} aria-hidden />
    </motion.a>
  );
}
