"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { siteConfig } from "@/data/siteConfig";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { NFCCard3D } from "@/components/ui/NFCCard3D";
import { NFCWaves } from "@/components/ui/NFCWaves";
import { PhoneMockup } from "@/components/ui/PhoneMockup";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { dictionary: d } = useLanguage();
  const reduced = useReducedMotion();
  const { scrollY } = useScroll();
  const cardY = useTransform(scrollY, [0, 650], [0, reduced ? 0 : 105]);
  const phoneX = useTransform(scrollY, [0, 400], [36, reduced ? 36 : -12]);
  const titleWords = d.hero.title.split(" ");

  const reveal = (delay: number) =>
    reduced
      ? { initial: false as const }
      : { initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease: EASE, delay } };

  return (
    <section className="hero" id="top">
      <div className="hero-glow" />
      <div className="hero-orb hero-orb-a" aria-hidden />
      <div className="hero-orb hero-orb-b" aria-hidden />
      <div className="shell hero-grid">
        <div className="hero-copy">
          <motion.p className="hero-kicker" {...reveal(0)}>{d.hero.kicker}</motion.p>
          <h1 className="hero-title">
            {titleWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="hero-word"
                initial={reduced ? false : { opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: EASE, delay: 0.08 + index * 0.055 }}
              >
                {word}{" "}
              </motion.span>
            ))}
          </h1>
          <motion.p className="hero-text" {...reveal(0.35)}>{d.hero.subtitle}</motion.p>
          <motion.div className="hero-actions" {...reveal(0.45)}>
            <MagneticButton href="#solutions">{d.hero.solutions}</MagneticButton>
            <MagneticButton href={siteConfig.telegram}>{d.hero.discuss}</MagneticButton>
          </motion.div>
          <motion.div className="hero-quick" {...reveal(0.55)}>
            <a href="#solutions">{d.nav.solutions}</a>
            <a href="#how">{d.nav.how}</a>
            <a href="#contact">{d.nav.contacts}</a>
          </motion.div>
        </div>
        <motion.div
          className="hero-visual hero-visual-new"
          style={{ y: cardY }}
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
        >
          <NFCCard3D label={d.hero.cardLabel} />
          <motion.div className="hero-phone-touch" style={{ x: phoneX }}>
            <PhoneMockup title="FENIX NFC" status={d.hero.connected} />
            <NFCWaves />
          </motion.div>
        </motion.div>
      </div>
      <a className="scroll-cue" href="#solutions" aria-label={d.common.scroll}><ArrowDown /></a>
    </section>
  );
}
