import { motion } from 'motion/react'
import { HeroProduct } from '@/components/ProductVisual'
import { MaskedLines } from '@/components/Reveal'
import { ButtonLink } from '@/components/ui/Button'
import { useI18n } from '@/i18n'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function Hero() {
  const { lang, t } = useI18n()
  const reduced = useReducedMotion()

  const fade = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        }

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-16 pt-[6.5rem] sm:pb-20 sm:pt-[7.5rem] lg:min-h-[100svh] lg:pb-24 lg:pt-[9.5rem]"
      aria-labelledby="hero-title"
    >
      <div className="shell">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="relative z-2 lg:col-span-5">
            <motion.p {...fade(0.08)} className="eyebrow">
              {t.hero.kicker}
            </motion.p>

            <MaskedLines
              key={lang}
              as="h1"
              id="hero-title"
              lines={[t.hero.line1, t.hero.line2]}
              className="display-1 mt-5 text-ink"
              delay={0.12}
            />

            <motion.p {...fade(0.45)} className="lede mt-6 max-w-[34ch]">
              {t.hero.lede}
            </motion.p>

            <motion.div {...fade(0.58)} className="mt-8 flex flex-col items-start gap-2.5 min-[420px]:flex-row min-[420px]:flex-wrap min-[420px]:items-center sm:mt-9">
              <ButtonLink href="#products" variant="ink" arrow>
                {t.hero.ctaProducts}
              </ButtonLink>
              <ButtonLink href="#contact" variant="glass">
                {t.hero.ctaContact}
              </ButtonLink>
            </motion.div>
          </div>

          <motion.div
            className="relative lg:col-span-7"
            initial={reduced ? undefined : { opacity: 0, y: 18 }}
            animate={reduced ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroProduct alt={t.products.items.wood.alt} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
