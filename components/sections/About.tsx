"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useLanguage } from "@/hooks/useLanguage";

export function About() {
  const { dictionary: d } = useLanguage();
  return (
    <section className="section about-section" id="about"><div className="shell about-grid">
      <div className="about-art">
        <motion.div className="brand-composition" whileInView={{ rotate: [0, 4, 0] }} transition={{ duration: 2 }}>
          <span className="brand-halo" /><Image src="/brand/fenix-symbol-white.png" alt="" width={210} height={210} className="about-symbol" /><div className="about-logo"><Logo /></div>
        </motion.div>
      </div>
      <div><SectionHeading eyebrow={d.about.eyebrow} title={d.about.title} />{d.about.paragraphs.map((paragraph) => <p className="about-paragraph" key={paragraph}>{paragraph}</p>)}</div>
    </div></section>
  );
}
