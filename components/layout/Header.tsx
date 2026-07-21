"use client";

import { Menu } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { MobileMenu } from "./MobileMenu";
import { navigation, siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/hooks/useLanguage";
import { useActiveSection } from "@/hooks/useActiveSection";

export function Header() {
  const { dictionary: d } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const sectionIds = useMemo(() => navigation.map((item) => item.href.slice(1)), []);
  const active = useActiveSection(sectionIds);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 28);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="shell nav-inner">
        <a href="#top" aria-label="FENIX NFC"><Logo /></a>
        <nav className="desktop-nav" aria-label={d.footer.navigation}>
          {navigation.map((item) => (
            <a
              key={item.key}
              href={item.href}
              className={active === item.href.slice(1) ? "is-active" : ""}
              aria-current={active === item.href.slice(1) ? "true" : undefined}
            >
              {d.nav[item.key]}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <LanguageSwitcher />
          <span className="desktop-cta"><MagneticButton href={siteConfig.telegram}>{d.common.contact}</MagneticButton></span>
          <button type="button" className="menu-button" onClick={() => setOpen(true)} aria-label={d.common.menu} aria-expanded={open}><Menu /></button>
        </div>
      </div>
      <motion.span className="nav-progress" style={{ scaleX: progress }} aria-hidden />
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
