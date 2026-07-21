"use client";

import { Building2, CalendarDays, Check, Hotel, Store, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const icons = [Utensils, Building2, Hotel, Store, CalendarDays];

export function UseCases() {
  const { dictionary: d } = useLanguage();
  return (
    <section className="section use-section" id="use-cases"><div className="shell">
      <SectionHeading eyebrow={d.uses.eyebrow} title={d.uses.title} text={d.uses.subtitle} />
      <div className="use-showcase">{d.uses.items.map((item, index) => {
        const Icon = icons[index];
        return <motion.article key={item.title} initial={{ opacity: 0, y: 35 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }}>
          <div className="use-case-art"><Icon aria-hidden /><span>0{index + 1}</span><i /><i /></div>
          <div className="use-case-copy"><h3>{item.title}</h3><p>{item.description}</p><ul>{item.benefits.map((benefit) => <li key={benefit}><Check size={16} aria-hidden />{benefit}</li>)}</ul><Button href="#contact" variant="ghost">{d.common.learn}</Button></div>
        </motion.article>;
      })}</div>
    </div></section>
  );
}
