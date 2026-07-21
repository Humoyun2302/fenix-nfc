export function NFCWaves({ active = true, className = "" }: { active?: boolean; className?: string }) {
  return <span className={`nfc-waves ${active ? "is-active" : ""} ${className}`} aria-hidden><i /><i /><i /></span>;
}
