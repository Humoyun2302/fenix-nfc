import { ChevronRight, Copy, Play } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLang } from '../locales'
import { USE_CASES } from '../data/usecases'
import type { CaseId, FeatureKind } from '../data/usecases'
import { Logo } from './marks'
import './Phone.css'

function SignalIcon() {
  return (
    <svg viewBox="0 0 18 12" className="scr-sicon" aria-hidden="true">
      <g fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="0.8" />
        <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
        <rect x="10" y="3" width="3" height="9" rx="0.8" />
        <rect x="15" y="0.5" width="3" height="11.5" rx="0.8" opacity="0.35" />
      </g>
    </svg>
  )
}

function WifiStatusIcon() {
  return (
    <svg viewBox="0 0 16 13" className="scr-sicon" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M1.5 4.4a10 10 0 0 1 13 0" />
      <path d="M3.8 7a6.5 6.5 0 0 1 8.4 0" />
      <path d="M6.1 9.5a3.2 3.2 0 0 1 3.8 0" />
      <circle cx="8" cy="11.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function BatteryIcon() {
  return (
    <svg viewBox="0 0 23 12" className="scr-sicon scr-sicon--bat" aria-hidden="true">
      <rect x="0.7" y="0.7" width="18.6" height="10.6" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.2" />
      <rect x="2.5" y="2.5" width="13" height="7" rx="1.6" fill="currentColor" />
      <rect x="20.8" y="4" width="1.7" height="4" rx="0.85" fill="currentColor" opacity="0.4" />
    </svg>
  )
}

function Feature({
  kind,
  Icon,
  label,
  hint,
}: {
  kind: FeatureKind
  Icon: LucideIcon
  label: string
  hint: string
}) {
  if (kind === 'video') {
    return (
      <div className="scr-video">
        <span className="scr-video__play">
          <Play size={14} fill="currentColor" strokeWidth={0} />
        </span>
        <span className="scr-video__label">{label}</span>
        {hint && <span className="scr-video__dur">{hint}</span>}
      </div>
    )
  }
  if (kind === 'wifi') {
    return (
      <div className="scr-wifi">
        <Icon size={16} strokeWidth={1.9} className="scr-wifi__icon" />
        <span className="scr-wifi__txt">
          <span className="scr-wifi__label">{label}</span>
          {hint && <span className="scr-wifi__hint">{hint}</span>}
        </span>
        <Copy size={13} strokeWidth={1.8} className="scr-wifi__copy" />
      </div>
    )
  }
  return (
    <div className="scr-tile">
      <Icon size={15} strokeWidth={1.9} />
      <span className="scr-tile__label">{label}</span>
      <ChevronRight size={14} strokeWidth={2.2} className="scr-tile__chev" />
    </div>
  )
}

/** Realistic modern smartphone (≈9:19.5) demonstrating the digital side. */
export function Phone({ caseId, className = '' }: { caseId: CaseId; className?: string }) {
  const { t } = useLang()
  const def = USE_CASES.find((c) => c.id === caseId)!
  const s = t.cases.items[caseId].screen

  return (
    <div className={`phone ${className}`.trim()} role="img" aria-label={`${s.title} — ${s.sub}`}>
      <div className="phone__frame">
        <div className="phone__island" aria-hidden="true" />
        <div className="phone__screen">
          <div className="scr-status" aria-hidden="true">
            <span className="scr-time">9:41</span>
            <span className="scr-sysicons">
              <SignalIcon />
              <WifiStatusIcon />
              <BatteryIcon />
            </span>
          </div>

          <div className="scr-head">
            <span className="scr-avatar">
              <Logo size={15} tone="paper" />
            </span>
            <span className="scr-headtxt">
              <span className="scr-title">{s.title}</span>
              <span className="scr-sub">{s.sub}</span>
            </span>
          </div>

          <Feature kind={def.feature} Icon={def.featureIcon} label={s.feature.label} hint={s.feature.hint} />

          {s.chips.length > 0 && (
            <div className="scr-chips">
              {s.chips.map((c) => (
                <span key={c} className="scr-chip">
                  {c}
                </span>
              ))}
            </div>
          )}

          <div className="scr-rows">
            {s.rows.map((label, i) => {
              const RowIcon = def.rows[i] ?? ChevronRight
              return (
                <div className="scr-row" key={label}>
                  <RowIcon size={15} strokeWidth={1.8} className="scr-row__icon" />
                  <span className="scr-row__label">{label}</span>
                  <ChevronRight size={13} strokeWidth={2.2} className="scr-row__chev" />
                </div>
              )
            })}
          </div>

          <div className="scr-foot">
            <Logo size={10} />
            <span>FENIX</span>
          </div>
          <div className="phone__home" aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
