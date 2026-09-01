import { Reveal } from './Reveal'

/** Editorial section marker: number — rule — label. */
export function SectionMark({ num, label, inverse = false }: { num: string; label: string; inverse?: boolean }) {
  return (
    <Reveal className={`smark${inverse ? ' smark--inv' : ''}`}>
      <span className="micro">{num}</span>
      <span className="smark__line" aria-hidden="true" />
      <span className="micro">{label}</span>
    </Reveal>
  )
}
