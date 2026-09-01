import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { Wordmark } from '@/components/Wordmark'
import { ButtonLink } from '@/components/ui/Button'
import { navItems, type NavId } from '@/data/navigation'
import { useI18n } from '@/i18n'
import { useActiveSection, useScrollLock, useScrolled } from '@/hooks/useScrollState'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const sectionIds = navItems.map((item) => item.id)

export function Navbar() {
  const { t } = useI18n()
  const scrolled = useScrolled(28)
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  useScrollLock(open)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const labels: Record<NavId, string> = {
    products: t.nav.products,
    solutions: t.nav.solutions,
    work: t.nav.projects,
    process: t.nav.howItWorks,
  }

  return (
    <>
      <a
        href="#main"
        className="glass fixed left-1/2 top-2 z-100 -translate-x-1/2 -translate-y-24 rounded-full px-5 py-2.5 text-sm font-medium transition-transform focus-visible:translate-y-0"
      >
        {t.a11y.skip}
      </a>

      <header
        className="fixed inset-x-0 top-0 z-60 flex justify-center px-3 sm:px-5"
        style={{
          paddingTop: scrolled ? '0.4rem' : '0.75rem',
          transition: 'padding-top 700ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <nav
          aria-label={t.a11y.primaryNav}
          className="glass flex w-full max-w-[76rem] min-w-0 items-center gap-1.5 rounded-full sm:gap-3"
          style={{
            paddingInline: '0.45rem',
            paddingBlock: scrolled ? '0.28rem' : '0.38rem',
            backdropFilter: `blur(${scrolled ? 28 : 16}px) saturate(${scrolled ? 160 : 135}%)`,
            WebkitBackdropFilter: `blur(${scrolled ? 28 : 16}px) saturate(${scrolled ? 160 : 135}%)`,
            background: scrolled ? 'rgba(255,255,255,0.62)' : 'rgba(255,255,255,0.4)',
            transition: 'padding 700ms cubic-bezier(0.22,1,0.36,1), background-color 700ms ease',
          }}
        >
          <a
            href="#top"
            className="flex min-h-11 items-center rounded-full pl-2.5 pr-1 sm:pl-3"
            aria-label={t.a11y.home}
          >
            <Wordmark className="h-[0.95rem] w-auto sm:h-[1.05rem]" />
          </a>

          <ul className="ml-1 hidden items-center gap-0.5 lg:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  className="group relative flex min-h-9 items-center rounded-full px-3 text-[0.875rem] font-medium tracking-[-0.01em] text-graphite transition-colors duration-300 hover:text-ink"
                >
                  {labels[item.id]}
                  <span
                    className="absolute bottom-1 left-1/2 size-[3px] -translate-x-1/2 rounded-full bg-ink transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      opacity: active === item.id ? 1 : 0,
                      transform: `translateX(-50%) scale(${active === item.id ? 1 : 0.2})`,
                    }}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
            <LanguageSwitch />

            <span className="hidden lg:inline-flex">
              <ButtonLink href="#contact" variant="ink" size="md" className="py-2">
                {t.nav.contact}
              </ButtonLink>
            </span>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
              className="grid size-11 place-items-center rounded-full transition-colors hover:bg-white/50 lg:hidden"
            >
              <span className="relative block h-3 w-[1.125rem]" aria-hidden="true">
                <span
                  className="absolute left-0 block h-[1.5px] w-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    top: open ? '50%' : '1px',
                    transform: open ? 'translateY(-50%) rotate(45deg)' : 'none',
                  }}
                />
                <span
                  className="absolute left-0 block h-[1.5px] w-full rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    bottom: open ? '50%' : '1px',
                    transform: open ? 'translateY(50%) rotate(-45deg)' : 'none',
                  }}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-55 lg:hidden"
            initial={reduced ? undefined : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button
              type="button"
              aria-label={t.a11y.closeMenu}
              onClick={close}
              className="absolute inset-0 bg-white/45 backdrop-blur-[3px]"
            />

            <motion.div
              id="mobile-menu"
              className="glass-strong glass-sheen absolute inset-x-3 top-[4.2rem] overflow-hidden rounded-[1.5rem] p-3 sm:inset-x-5"
              initial={reduced ? undefined : { opacity: 0, y: -12 }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="flex flex-col">
                {navItems.map((item, index) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      onClick={close}
                      className="flex min-h-11 items-center justify-between border-b border-[color:var(--fx-hairline)] px-3 text-[1.25rem] font-medium tracking-[-0.03em] text-ink"
                    >
                      {labels[item.id]}
                      <span className="numeral text-[0.625rem] tracking-[0.16em] text-ash">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-3 px-1">
                <LanguageSwitch stacked />
              </div>

              <ButtonLink href="#contact" onClick={close} variant="ink" arrow className="mt-3 w-full">
                {t.nav.contact}
              </ButtonLink>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
