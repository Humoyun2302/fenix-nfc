"use client";

import { ArrowDown } from "lucide-react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function NextJump({ href, label }: { href: string; label: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.a
      className="next-jump"
      href={href}
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <span>{label}</span>
      <ArrowDown size={16} aria-hidden />
    </motion.a>
  );
}
