import { ChevronRight, Play } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useI18n } from '@/i18n'
import { Icon, NfcGlyph, type IconName } from '@/lib/icons'

type PhoneMockupProps = {
  children: ReactNode
  className?: string
  glare?: boolean
}

/**
 * A single, reusable modern-smartphone frame.
 * Size is driven by CSS (aspect-ratio + clamp). Never stretch the silhouette.
 */
export function PhoneMockup({ children, className = '', glare = true }: PhoneMockupProps) {
  return (
    <div className={`phone-device ${className}`}>
      <span className="phone-btn phone-btn-silent" aria-hidden="true" />
      <span className="phone-btn phone-btn-vol-up" aria-hidden="true" />
      <span className="phone-btn phone-btn-vol-down" aria-hidden="true" />
      <span className="phone-btn phone-btn-power" aria-hidden="true" />

      <div className="phone-frame">
        <div className="phone-screen">
          <span className="phone-island" aria-hidden="true" />
          {children}
          {glare ? <span className="phone-glare" aria-hidden="true" /> : null}
        </div>
      </div>
    </div>
  )
}

export function PhoneStatusBar({ light = false }: { light?: boolean }) {
  const { t } = useI18n()
  const tone = light ? 'text-white/55' : 'text-ink/50'

  return (
    <div className={`phone-status ${tone}`}>
      <span className="numeral">{t.phoneUi.time}</span>
      <span className="phone-status-icons" aria-hidden="true">
        <span className="phone-signal">
          {[0.4, 0.6, 0.8, 1].map((h) => (
            <span key={h} style={{ height: `${h * 100}%` }} />
          ))}
        </span>
        <span className="phone-wifi" />
        <span className="phone-battery">
          <span />
        </span>
      </span>
    </div>
  )
}

export function PhoneHomeIndicator({ light = false }: { light?: boolean }) {
  return <span className={`phone-home ${light ? 'phone-home-light' : ''}`} aria-hidden="true" />
}

export type PhoneScreenData = {
  kicker: string
  title: string
  subtitle: string
  actions: { label: string; icon: IconName; primary?: boolean }[]
  media?: string
  stats?: { label: string; value: string }[]
}

export function PhoneScreen({ screen, animateKey = 'default' }: { screen: PhoneScreenData; animateKey?: string }) {
  const reduced = useReducedMotion()
  const { t } = useI18n()

  const rowMotion = (index: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: {
            duration: 0.4,
            delay: 0.08 + index * 0.04,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        }

  return (
    <div className="phone-ui">
      <PhoneStatusBar />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={animateKey}
          initial={reduced ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="phone-ui-body"
        >
          <motion.header {...rowMotion(0)} className="phone-ui-header">
            <span className="phone-ui-kicker">
              <NfcGlyph />
              {screen.kicker}
            </span>
            <h4>{screen.title}</h4>
            <p>{screen.subtitle}</p>
          </motion.header>

          {screen.media ? (
            <motion.div {...rowMotion(1)} className="phone-ui-media">
              <span className="phone-ui-play">
                <Play />
              </span>
              <span>{screen.media}</span>
            </motion.div>
          ) : null}

          {screen.stats ? (
            <motion.dl {...rowMotion(2)} className="phone-ui-stats">
              {screen.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd className="numeral">{stat.value}</dd>
                </div>
              ))}
            </motion.dl>
          ) : null}

          <div className="phone-ui-actions">
            {screen.actions.map((action, index) => (
              <motion.div
                key={action.label}
                {...rowMotion(3 + index)}
                className={action.primary ? 'phone-ui-row phone-ui-row-primary' : 'phone-ui-row'}
              >
                <span className="phone-ui-icon">
                  <Icon name={action.icon} />
                </span>
                <span className="phone-ui-label">{action.label}</span>
                <ChevronRight />
              </motion.div>
            ))}
          </div>

          <p className="phone-ui-mark">{t.phoneUi.poweredBy}</p>
        </motion.div>
      </AnimatePresence>

      <PhoneHomeIndicator />
    </div>
  )
}

export function PhoneIdle({ hint }: { hint?: string }) {
  const { t } = useI18n()

  return (
    <div className="phone-idle">
      <PhoneStatusBar light />
      <div className="phone-idle-body">
        <span className="numeral phone-idle-time">{t.phoneUi.time}</span>
        <span>{hint ?? t.phoneUi.idleHint}</span>
      </div>
      <PhoneHomeIndicator light />
    </div>
  )
}
