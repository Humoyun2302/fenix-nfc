"use client";

import { Sparkles } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function Marquee() {
  const { dictionary: d } = useLanguage();
  const items = [...d.marquee, ...d.marquee, ...d.marquee];
  return (
    <section className="marquee" aria-label={d.solutions.eyebrow}>
      <div className="marquee-fade" aria-hidden />
      <div className="marquee-track marquee-track-a">
        {items.map((item, index) => (
          <span key={`a-${item}-${index}`}>{item}<Sparkles aria-hidden /></span>
        ))}
      </div>
      <div className="marquee-track marquee-track-b" aria-hidden>
        {[...items].reverse().map((item, index) => (
          <span key={`b-${item}-${index}`}>{item}<Sparkles aria-hidden /></span>
        ))}
      </div>
    </section>
  );
}
