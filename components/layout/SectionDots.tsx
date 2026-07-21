"use client";

import { useMemo } from "react";
import { navigation } from "@/data/siteConfig";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useLanguage } from "@/hooks/useLanguage";

export function SectionDots() {
  const { dictionary: d } = useLanguage();
  const ids = useMemo(() => navigation.map((item) => item.href.slice(1)), []);
  const active = useActiveSection(ids);

  return (
    <nav className="section-dots" aria-label={d.footer.navigation}>
      {navigation.map((item) => {
        const id = item.href.slice(1);
        const isActive = active === id;
        return (
          <a
            key={item.key}
            href={item.href}
            className={isActive ? "is-active" : ""}
            aria-label={d.nav[item.key]}
            aria-current={isActive ? "true" : undefined}
          >
            <span className="section-dot" />
            <span className="section-dot-label">{d.nav[item.key]}</span>
          </a>
        );
      })}
    </nav>
  );
}
