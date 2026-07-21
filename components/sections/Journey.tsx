"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  { href: "#solutions", key: "solutions" as const },
  { href: "#how", key: "how" as const },
  { href: "#projects", key: "projects" as const },
  { href: "#contact", key: "contacts" as const },
];

export function Journey() {
  const { dictionary: d } = useLanguage();
  const reduced = useReducedMotion();

  return (
    <section className="journey" aria-label={d.journey.label}>
      <div className="shell">
        <motion.p
          className="journey-label"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          {d.journey.label}
        </motion.p>
        <ol className="journey-track">
          {STEPS.map((step, index) => (
            <motion.li
              key={step.key}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, ease: EASE, delay: index * 0.08 }}
            >
              <a href={step.href} className="journey-step">
                <span className="journey-num">0{index + 1}</span>
                <span className="journey-copy">
                  <strong>{d.nav[step.key]}</strong>
                  <em>{d.journey.hints[step.key]}</em>
                </span>
              </a>
              {index < STEPS.length - 1 && <ArrowRight className="journey-arrow" aria-hidden />}
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
