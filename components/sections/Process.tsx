"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Process() {
  const { dictionary: d } = useLanguage();
  return (
    <section className="section process-section"><div className="shell">
      <SectionHeading eyebrow={d.process.eyebrow} title={d.process.title} align="center" />
      <ol className="process-detailed">{d.process.items.map(([number, title, description], index) => <motion.li key={number} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .5 }} transition={{ delay: index * .1 }}><span>{number}</span><div><b>{title}</b><p>{description}</p></div>{index < d.process.items.length - 1 && <ArrowRight aria-hidden />}</motion.li>)}</ol>
    </div></section>
  );
}
