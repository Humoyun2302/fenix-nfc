"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FAQ() {
  const { dictionary: d } = useLanguage();
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq-section" id="faq"><div className="shell faq-grid">
      <SectionHeading eyebrow={d.faq.eyebrow} title={d.faq.title} />
      <div className="faq-list">{d.faq.items.map(([question, answer], index) => {
        const active = open === index;
        return <article key={question}><h3><button type="button" onClick={() => setOpen(active ? -1 : index)} aria-expanded={active} aria-label={`${d.faq.open}: ${question}`}>{question}<ChevronDown className={active ? "rotate" : ""} /></button></h3><motion.div className="faq-answer" initial={false} animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }}><p>{answer}</p></motion.div></article>;
      })}</div>
    </div></section>
  );
}
