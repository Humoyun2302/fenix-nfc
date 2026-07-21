"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { navigation, siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/hooks/useLanguage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Logo } from "@/components/ui/Logo";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dictionary: d } = useLanguage();
  const reduced = useReducedMotion();
  const dialog = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const node = dialog.current;
    const focusable = node?.querySelectorAll<HTMLElement>("a, button");
    focusable?.[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const hints: Record<string, string> = {
    solutions: d.journey.hints.solutions,
    how: d.journey.hints.how,
    projects: d.journey.hints.projects,
    about: d.about.eyebrow,
    contacts: d.journey.hints.contacts,
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialog}
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={d.common.menu}
          initial={reduced ? false : { opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
        >
          <div className="mobile-menu-top">
            <Logo />
            <button type="button" onClick={onClose} aria-label={d.common.close}><X /></button>
          </div>
          <nav aria-label={d.footer.navigation}>
            {navigation.map((item, index) => (
              <motion.a
                key={item.key}
                href={item.href}
                onClick={onClose}
                className="mobile-nav-item"
                initial={reduced ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="mobile-nav-num">0{index + 1}</span>
                <span>
                  <strong>{d.nav[item.key]}</strong>
                  <em>{hints[item.key]}</em>
                </span>
              </motion.a>
            ))}
          </nav>
          <MagneticButton href={siteConfig.telegram}>{d.hero.discuss}</MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
