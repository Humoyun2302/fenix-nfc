"use client";

import Image from "next/image";
import { useRef } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { useMousePosition } from "@/hooks/useMousePosition";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { siteConfig } from "@/data/siteConfig";

export function ContactCTA() {
  const { dictionary: d } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const mouse = useMousePosition(ref);
  return (
    <section className="cta-section" id="contact" ref={ref} style={{ "--x": `${mouse.x * 100}%`, "--y": `${mouse.y * 100}%` } as React.CSSProperties}>
      <Image src="/brand/fenix-symbol-white.png" alt="" width={620} height={620} className="cta-symbol" />
      <div className="cursor-glow" />
      <div className="shell"><p className="eyebrow">{d.cta.eyebrow}</p><h2>{d.cta.title}</h2><p className="cta-subtitle">{d.cta.subtitle}</p><div className="cta-actions"><MagneticButton href={siteConfig.telegram} light>{d.cta.telegram}</MagneticButton><MagneticButton href={`mailto:${siteConfig.email}`} light>{d.cta.contact}</MagneticButton></div></div>
    </section>
  );
}
