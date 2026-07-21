"use client";

import Image from "next/image";
import { Nfc } from "lucide-react";
import { useRef } from "react";
import { motion } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function NFCCard3D({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const position = useMousePosition(ref);
  const reduced = useReducedMotion();
  const rotateX = reduced ? 0 : (0.5 - position.y) * 16;
  const rotateY = reduced ? 0 : (position.x - 0.5) * 20;

  return (
    <div ref={ref} className="nfc-card-scene" aria-label={label}>
      <motion.div
        className="nfc-card-premium"
        style={{ rotateX, rotateY }}
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
      >
        <span className="card-texture" aria-hidden />
        <span className="metallic-border" aria-hidden />
        <span
          className="card-reflection"
          style={{ left: `${position.x * 100}%`, top: `${position.y * 100}%` }}
          aria-hidden
        />
        <span className="card-shine" aria-hidden />

        <div className="card-top">
          <span className="card-chip" aria-hidden>
            <i /><i /><i /><i />
          </span>
          <Nfc className="card-nfc-icon" aria-hidden />
        </div>

        <Image src="/brand/fenix-symbol-white.png" alt="" width={120} height={120} className="card-symbol" />

        <div className="card-bottom">
          <strong>FENIX NFC</strong>
          <span>one tap • connected</span>
        </div>
      </motion.div>
    </div>
  );
}
