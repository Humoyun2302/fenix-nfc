import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BellRing,
  BookOpen,
  Briefcase,
  CalendarCheck,
  Check,
  ConciergeBell,
  FileText,
  Globe,
  Link2,
  LogOut,
  MapPin,
  Phone,
  Play,
  Repeat,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  UserPlus,
  UtensilsCrossed,
  Wifi,
} from 'lucide-react'
import type { ComponentType, SVGProps } from 'react'

export type GlyphProps = SVGProps<SVGSVGElement>

const brandBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

/** Brand marks are hand-drawn — lucide v1 no longer ships third-party logos. */
export function InstagramGlyph(props: GlyphProps) {
  return (
    <svg {...brandBase} {...props} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5.2" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TelegramGlyph(props: GlyphProps) {
  return (
    <svg {...brandBase} {...props} aria-hidden="true">
      <path d="M21.2 4.3 2.9 11.2c-.7.3-.7.8 0 1l4.2 1.3 1.6 4.9c.2.6.6.7 1 .3l2.3-2.1 4.3 3.2c.6.4 1.1.2 1.3-.5l3.3-14c.2-.8-.3-1.2-1-.9Z" />
      <path d="m8.1 13.5 9.6-6.6-6.8 7.4-.2 3.4" />
    </svg>
  )
}

/** The NFC contactless mark used across the product surfaces. */
export function NfcGlyph(props: GlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      {...props}
      aria-hidden="true"
    >
      <path d="M5.5 7.6a7.5 7.5 0 0 1 0 8.8" />
      <path d="M8.6 9.1a4.3 4.3 0 0 1 0 5.8" />
      <path d="M11.6 10.7a1.6 1.6 0 0 1 0 2.6" />
      <rect x="14.1" y="6.4" width="4.6" height="8.1" rx="1.2" />
      <path d="M18.7 14.5v2.1a2.4 2.4 0 0 1-2.4 2.4h-1.6" />
    </svg>
  )
}

export const iconRegistry = {
  'menu-book': UtensilsCrossed,
  wifi: Wifi,
  instagram: InstagramGlyph,
  'map-pin': MapPin,
  star: Star,
  stethoscope: Stethoscope,
  calendar: CalendarCheck,
  phone: Phone,
  play: Play,
  activity: Activity,
  repeat: Repeat,
  shield: ShieldCheck,
  bell: BellRing,
  'room-service': ConciergeBell,
  book: BookOpen,
  logout: LogOut,
  'user-plus': UserPlus,
  send: TelegramGlyph,
  globe: Globe,
  briefcase: Briefcase,
  sparkles: Sparkles,
  link: Link2,
  file: FileText,
  check: Check,
  arrow: ArrowRight,
  'arrow-up-right': ArrowUpRight,
  nfc: NfcGlyph,
} satisfies Record<string, ComponentType<GlyphProps>>

export type IconName = keyof typeof iconRegistry

export function Icon({
  name,
  ...props
}: { name: IconName } & GlyphProps) {
  const Cmp = iconRegistry[name]
  return <Cmp {...props} />
}
