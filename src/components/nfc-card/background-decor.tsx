import styles from "@/app/ibrohim/card.module.css";

/**
 * Purely decorative background: fine curved gold lines entering from the
 * top-right and bottom-left corners, subtle dotted patterns and soft glows.
 * Drawn with SVG + CSS so it scales crisply on any viewport.
 */
export function BackgroundDecor() {
  return (
    <div className={styles.decor} aria-hidden="true">
      {/* Soft radial glows */}
      <span className={`${styles.glow} ${styles.glowTop}`} />
      <span className={`${styles.glow} ${styles.glowBottom}`} />

      {/* Top-right curved flourish */}
      <svg
        className={`${styles.curve} ${styles.curveTop}`}
        viewBox="0 0 200 200"
        fill="none"
        preserveAspectRatio="xMaxYMin meet"
      >
        <defs>
          <linearGradient id="decorGoldTop" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c58b28" stopOpacity="0" />
            <stop offset="45%" stopColor="#f7d77a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9f6a16" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M20 -10 C 130 20, 190 70, 210 200"
          stroke="url(#decorGoldTop)"
          strokeWidth="1.2"
        />
        <path
          d="M55 -20 C 150 15, 205 75, 225 190"
          stroke="url(#decorGoldTop)"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <path
          d="M0 5 C 120 30, 180 90, 200 210"
          stroke="url(#decorGoldTop)"
          strokeWidth="0.5"
          opacity="0.5"
        />
        {DOTS_TOP.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#f7d77a" opacity={0.5} />
        ))}
      </svg>

      {/* Bottom-left curved flourish (mirror of the top) */}
      <svg
        className={`${styles.curve} ${styles.curveBottom}`}
        viewBox="0 0 200 200"
        fill="none"
        preserveAspectRatio="xMinYMax meet"
      >
        <defs>
          <linearGradient id="decorGoldBottom" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#c58b28" stopOpacity="0" />
            <stop offset="45%" stopColor="#f7d77a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#9f6a16" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M180 210 C 70 180, 10 130, -10 0"
          stroke="url(#decorGoldBottom)"
          strokeWidth="1.2"
        />
        <path
          d="M145 220 C 50 185, -5 125, -25 10"
          stroke="url(#decorGoldBottom)"
          strokeWidth="0.8"
          opacity="0.7"
        />
        <path
          d="M200 195 C 80 170, 20 110, 0 -10"
          stroke="url(#decorGoldBottom)"
          strokeWidth="0.5"
          opacity="0.5"
        />
        {DOTS_BOTTOM.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#f7d77a" opacity={0.5} />
        ))}
      </svg>
    </div>
  );
}

const DOTS_TOP: Array<[number, number, number]> = [
  [150, 18, 0.9],
  [168, 40, 0.7],
  [182, 66, 0.8],
  [190, 96, 0.6],
  [140, 8, 0.6],
  [176, 52, 0.5],
];

const DOTS_BOTTOM: Array<[number, number, number]> = [
  [50, 182, 0.9],
  [32, 160, 0.7],
  [18, 134, 0.8],
  [10, 104, 0.6],
  [60, 192, 0.6],
  [24, 148, 0.5],
];
