"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Contact, Fingerprint, Menu, MessageSquareText, PanelsTopLeft, Users } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { NextJump } from "@/components/ui/NextJump";

const icons = [Menu, Contact, MessageSquareText, PanelsTopLeft, Users, Fingerprint];
const EASE = [0.22, 1, 0.36, 1] as const;

function setGlow(event: React.PointerEvent<HTMLDivElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
  event.currentTarget.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`);
}

export function Solutions() {
  const { dictionary: d } = useLanguage();
  const reduced = useReducedMotion();
  return (
    <section className="section" id="solutions">
      <div className="shell">
        <SectionHeading eyebrow={d.solutions.eyebrow} title={d.solutions.title} text={d.solutions.subtitle} />
        <div className="solutions-grid">
          {d.solutions.items.map(([title, description], index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={title}
                onPointerMove={reduced ? undefined : setGlow}
                whileHover={reduced ? undefined : { y: -10 }}
                initial={reduced ? false : { opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, ease: EASE, delay: (index % 3) * 0.08 }}
              >
                <GlassCard className={`solution-card visual-${index + 1}`}>
                  <div className="solution-visual">
                    <Icon aria-hidden />
                    <i /><i />
                    <span className="solution-pulse" aria-hidden />
                  </div>
                  <span className="solution-index">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <ArrowUpRight className="solution-arrow" aria-hidden />
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
        <NextJump href="#how" label={`${d.common.next}: ${d.how.eyebrow}`} />
      </div>
    </section>
  );
}
