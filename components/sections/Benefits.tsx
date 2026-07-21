"use client";

import { motion } from "framer-motion";
import { AppWindow, Brush, Clock3, Globe2, Leaf, MousePointerClick, RefreshCw, Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NFCWaves } from "@/components/ui/NFCWaves";

const icons = [AppWindow, MousePointerClick, RefreshCw, Brush, Globe2, Clock3, Leaf, Sparkles];
const EASE = [0.22, 1, 0.36, 1] as const;

export function Benefits() {
  const { dictionary: d } = useLanguage();
  const reduced = useReducedMotion();
  return (
    <section className="section benefits-section">
      <div className="shell">
        <SectionHeading eyebrow={d.benefits.eyebrow} title={d.benefits.title} />
        <div className="bento benefits-bento">
          {d.benefits.items.map(([title, description], index) => {
            const Icon = icons[index];
            return (
              <motion.article
                key={title}
                className={`bento-${index + 1}`}
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, ease: EASE, delay: (index % 4) * 0.06 }}
                whileHover={reduced ? undefined : { y: -6, scale: 1.02 }}
              >
                <motion.div
                  className="benefit-icon"
                  animate={reduced ? undefined : (
                    index === 0 ? { scale: [1, 1.08, 1] }
                    : index === 1 ? { rotate: [0, 8, -8, 0] }
                    : index === 2 ? { rotate: 360 }
                    : undefined
                  )}
                  transition={
                    index === 2
                      ? { duration: 8, repeat: Infinity, ease: "linear" }
                      : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  <Icon aria-hidden />
                </motion.div>
                {index === 0 && <div className="benefit-mini-waves"><NFCWaves /></div>}
                {index === 3 && <span className="benefit-link-flip" aria-hidden>fenixnfc.uz</span>}
                <span className="benefit-orbit" />
                <h3>{title}</h3>
                <p>{description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
