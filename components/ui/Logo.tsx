"use client";

import Image from "next/image";
import { useState } from "react";

type LogoProps = {
  /** Only the F symbol (square). */
  symbol?: boolean;
  className?: string;
};

/**
 * Horizontal lockup: white F symbol + FENIX NFC wordmark.
 * The supplied brand assets are square, so we compose the wordmark
 * as text to keep the navbar lockup crisp at any size.
 */
export function Logo({ symbol = false, className = "" }: LogoProps) {
  const [failed, setFailed] = useState(false);

  const mark = failed ? (
    <span className="logo-mark-fallback" aria-hidden>F</span>
  ) : (
    <Image
      src="/brand/fenix-symbol-white.png"
      alt=""
      width={40}
      height={40}
      className="logo-mark"
      onError={() => setFailed(true)}
      priority
    />
  );

  if (symbol) {
    return <span className={`logo logo-symbol ${className}`} aria-label="FENIX NFC">{mark}</span>;
  }

  return (
    <span className={`logo ${className}`} aria-label="FENIX NFC">
      {mark}
      <span className="logo-wordmark">FENIX <b>NFC</b></span>
    </span>
  );
}
