"use client";

import { motion, useScroll, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { NFCWaves } from "@/components/ui/NFCWaves";
import { NextJump } from "@/components/ui/NextJump";
import { useLanguage } from "@/hooks/useLanguage";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function Step({ number, title, description, wave, showWave, index }: {
  number: string; title: string; description: string; wave: string; showWave: boolean; index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.65 });
  const reduced = useReducedMotion();

  return (
    <motion.article
      ref={ref}
      className={`how-step ${inView ? "is-active" : ""}`}
      initial={reduced ? false : { opacity: 0.35, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0.4, y: 12 }}
      transition={{ duration: 0.55, delay: index * 0.05 }}
    >
      <span className="how-num">{number}</span>
      <h3>{title}</h3>
      <p>{description}</p>
      {showWave && (
        <div className="how-wave">
          <NFCWaves active={inView} />
          <b>{wave}</b>
        </div>
      )}
    </motion.article>
  );
}

export function HowItWorks() {
  const { dictionary: d } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 45%"] });

  return (
    <section className="section steps-section how-section" id="how" ref={ref}>
      <div className="shell">
        <SectionHeading eyebrow={d.how.eyebrow} title={d.how.title} />
        <div className="how-track">
          <div className="how-line" />
          <motion.div className="how-progress" style={{ scaleX: scrollYProgress, scaleY: scrollYProgress }} />
          {d.how.items.map(([number, title, description], index) => (
            <Step
              key={number}
              number={number}
              title={title}
              description={description}
              wave={d.how.wave}
              showWave={index === 2}
              index={index}
            />
          ))}
        </div>
        <NextJump href="#demo" label={`${d.common.next}: ${d.demo.eyebrow}`} />
      </div>
    </section>
  );
}
