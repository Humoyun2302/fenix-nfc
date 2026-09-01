import { NfcMark } from './marks'

/** Dashed directional arrow used in the statement flow. */
export function FlowArrow() {
  return (
    <svg viewBox="0 0 64 12" className="flow-arrow" aria-hidden="true">
      <path d="M1 6 H52" className="flow-arrow__line" />
      <path d="M47 1.5 L55 6 L47 10.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Dashed connector between the physical scene and the phone. */
export function Connector() {
  return (
    <svg viewBox="0 0 84 24" className="uc-conn" aria-hidden="true">
      <path d="M2 12 H62" className="uc-conn__line" />
      <path d="M56 5 L68 12 L56 19" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="78" cy="12" r="3" fill="#FF4B00" stroke="none" />
    </svg>
  )
}

/** Minimal phone outline for the statement diagram (drawn for ink bg). */
export function MiniPhone() {
  return (
    <svg viewBox="0 0 64 128" className="mini-phone" aria-hidden="true">
      <rect x="2" y="2" width="60" height="124" rx="14" fill="rgba(243,241,235,0.05)" stroke="currentColor" strokeWidth="1.6" />
      <rect x="23" y="8.5" width="18" height="4.5" rx="2.25" fill="currentColor" opacity="0.85" />
      <rect x="21" y="117" width="22" height="2.6" rx="1.3" fill="currentColor" opacity="0.55" />
      <NfcMark x={17} y={46} scale={1.1} color="#FF4B00" />
      <g stroke="currentColor" strokeWidth="1.2" opacity="0.4" strokeLinecap="round">
        <path d="M14 92 H50" />
        <path d="M14 101 H38" />
      </g>
    </svg>
  )
}
