/** Shared vector marks: NFC contactless symbol, QR pattern, Fenix logo. */

// Three nested arcs + dot — the standard contactless symbol, in a 28×28 box.
export const NFC_PATH =
  'M11.36 9.5 A7 7 0 0 1 11.36 18.5 M15.19 6.29 A12 12 0 0 1 15.19 21.71 M19.02 3.07 A17 17 0 0 1 19.02 24.93'

export function NfcSymbol({
  size = 26,
  color = 'currentColor',
  strokeWidth = 2.1,
  className,
}: {
  size?: number
  color?: string
  strokeWidth?: number
  className?: string
}) {
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} fill="none" className={className} aria-hidden="true">
      <circle cx="7.5" cy="14" r="2" fill={color} />
      <path d={NFC_PATH} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  )
}

/** Engravable NFC mark as an SVG group (for use inside larger scenes). */
export function NfcMark({
  x = 0,
  y = 0,
  scale = 1,
  color = '#6F4B23',
  relief,
}: {
  x?: number
  y?: number
  scale?: number
  color?: string
  relief?: string
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {relief && (
        <g transform="translate(0 0.5)" opacity="0.85">
          <circle cx="7.5" cy="14" r="2" fill={relief} />
          <path d={NFC_PATH} stroke={relief} strokeWidth={2.1} strokeLinecap="round" fill="none" />
        </g>
      )}
      <circle cx="7.5" cy="14" r="2" fill={color} />
      <path d={NFC_PATH} stroke={color} strokeWidth={2.1} strokeLinecap="round" fill="none" />
    </g>
  )
}

/* Deterministic 21×21 QR-style pattern (v1 layout: finders + timing). */
function buildQr(): boolean[][] {
  const n = 21
  let s = 20260901 >>> 0
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
  const g: boolean[][] = Array.from({ length: n }, () => Array<boolean>(n).fill(false))
  const finder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++) {
        const ring = i === 0 || i === 6 || j === 0 || j === 6
        const core = i >= 2 && i <= 4 && j >= 2 && j <= 4
        g[r + i][c + j] = ring || core
      }
  }
  finder(0, 0)
  finder(0, 14)
  finder(14, 0)
  for (let i = 8; i < 13; i++) {
    g[6][i] = i % 2 === 0
    g[i][6] = i % 2 === 0
  }
  const inFinder = (r: number, c: number) => (r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8)
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      if (!inFinder(r, c) && r !== 6 && c !== 6 && !g[r][c]) g[r][c] = rnd() < 0.45
    }
  return g
}

const QR = buildQr()

export function QrPattern({
  x = 0,
  y = 0,
  size = 140,
  color = '#6F4B23',
  relief,
}: {
  x?: number
  y?: number
  size?: number
  color?: string
  relief?: string
}) {
  const cell = size / 21
  let d = ''
  QR.forEach((row, r) =>
    row.forEach((v, c) => {
      if (v)
        d += `M${(x + c * cell).toFixed(2)} ${(y + r * cell).toFixed(2)}h${cell.toFixed(2)}v${cell.toFixed(2)}h-${cell.toFixed(2)}z`
    }),
  )
  return (
    <g>
      {relief && <path d={d} fill={relief} transform="translate(0 0.9)" opacity="0.85" />}
      <path d={d} fill={color} />
    </g>
  )
}

export function Logo({
  size = 18,
  tone = 'ink',
  className,
}: {
  size?: number
  tone?: 'ink' | 'paper'
  className?: string
}) {
  const dot = tone === 'ink' ? '#0A0A0A' : '#F3F1EB'
  return (
    <svg viewBox="0 0 28 28" width={size} height={size} fill="none" className={className} aria-hidden="true">
      <circle cx="7.5" cy="14" r="2.2" fill={dot} />
      <path d={NFC_PATH} stroke="#FF4B00" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  )
}
