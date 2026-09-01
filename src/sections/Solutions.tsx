import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { PhoneMockup, PhoneScreen, type PhoneScreenData } from '@/components/PhoneMockup'
import { MaskedLines } from '@/components/Reveal'
import { SceneVisual } from '@/components/SceneVisual'
import { PlaqueStage } from '@/components/PlaqueStage'
import { solutions, type Solution } from '@/data/solutions'
import { useI18n } from '@/i18n'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function useSolutionScreen(solution: Solution): PhoneScreenData {
  const { t } = useI18n()
  const copy = t.solutions[solution.id]
  return {
    kicker: copy.screen.kicker,
    title: copy.screen.title,
    subtitle: copy.screen.subtitle,
    media: solution.hasMedia ? copy.screen.media : undefined,
    stats: solution.hasStats ? copy.screen.stats : undefined,
    actions: solution.actions.map((action, index) => ({
      ...action,
      label: copy.screen.actions[index] ?? '',
    })),
  }
}

export function Solutions() {
  const { lang, t } = useI18n()
  const [activeId, setActiveId] = useState(solutions[0].id)
  const [burst, setBurst] = useState(0)
  const active = solutions.find((item) => item.id === activeId) ?? solutions[0]
  const copy = t.solutions[active.id]
  const screen = useSolutionScreen(active)
  const reduced = useReducedMotion()

  useEffect(() => {
    setBurst((n) => n + 1)
  }, [activeId])

  return (
    <section id="solutions" className="section-y relative" aria-labelledby="solutions-title">
      <div className="shell">
        <div className="max-w-[36rem]">
          <p className="eyebrow">{t.solutions.eyebrow}</p>
          <MaskedLines
            key={lang}
            as="h2"
            id="solutions-title"
            lines={[t.solutions.title]}
            className="display-2 mt-4 text-ink"
          />
        </div>

        <div className="-mx-5 mt-10 overflow-x-auto px-5 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max gap-2" role="tablist" aria-label={t.a11y.useCases}>
            {solutions.map((item) => {
              const selected = item.id === activeId
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveId(item.id)}
                  className={`min-h-11 snap-start rounded-full px-4 text-[0.875rem] font-medium tracking-[-0.01em] transition-colors duration-400 ${
                    selected
                      ? 'bg-ink text-white'
                      : 'border border-[color:var(--fx-hairline)] bg-white/40 text-graphite'
                  }`}
                >
                  {t.solutions[item.id].label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-10 lg:items-start">
          <nav className="hidden lg:col-span-3 lg:block" aria-label={t.a11y.useCases}>
            <ul className="flex flex-col">
              {solutions.map((item, index) => {
                const selected = item.id === activeId
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(item.id)}
                      aria-pressed={selected}
                      className="group flex min-h-14 w-full items-baseline justify-between gap-4 border-b border-[color:var(--fx-hairline)] py-4 text-left"
                    >
                      <span
                        className={`text-[1.35rem] font-medium tracking-[-0.03em] transition-colors duration-500 ${
                          selected ? 'text-ink' : 'text-ink/28 group-hover:text-ink/60'
                        }`}
                      >
                        {t.solutions[item.id].label}
                      </span>
                      <span className="numeral text-[0.625rem] tracking-[0.16em] text-ash">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="lg:col-span-9">
            <div className="solution-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  className="solution-visual"
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={reduced ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <button
                    type="button"
                    className="solution-object"
                    onClick={() => setBurst((n) => n + 1)}
                    aria-label={t.a11y.tapPlaque}
                  >
                    {active.scene === 'card' ? (
                      <PlaqueStage
                        finish="card"
                        shape="card"
                        burst={burst}
                        ambientRipple
                        className="mx-auto w-[min(70%,14rem)]"
                        baseRotate={{ x: 8, y: -16, z: -6 }}
                      />
                    ) : (
                      <SceneVisual scene={active.scene} className="size-full rounded-[1.5rem]" />
                    )}
                  </button>

                  <div className="solution-phone">
                    <PhoneMockup>
                      <PhoneScreen screen={screen} animateKey={`${lang}-${active.id}-${burst}`} />
                    </PhoneMockup>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${lang}-${active.id}-copy`}
                className="mt-8 max-w-[36rem] sm:mt-10"
                initial={reduced ? undefined : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                <h3 className="text-[1.5rem] font-medium leading-tight tracking-[-0.03em] text-ink sm:text-[1.75rem]">
                  {copy.headline}
                </h3>
                <p className="mt-3 max-w-[42ch] text-[1.0625rem] leading-relaxed text-slate">
                  {copy.sentence}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
