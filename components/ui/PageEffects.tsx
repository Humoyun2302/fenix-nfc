"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Soft grain overlay + desktop cursor glow that follows the pointer. */
export function PageEffects() {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: 50, y: 40 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;

    const onMove = (event: PointerEvent) => {
      setVisible(true);
      setPos({
        x: (event.clientX / window.innerWidth) * 100,
        y: (event.clientY / window.innerHeight) * 100,
      });
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  return (
    <>
      <div className="page-grain" aria-hidden />
      {!reduced && (
        <div
          className={`page-cursor-glow ${visible ? "is-on" : ""}`}
          style={{ "--cx": `${pos.x}%`, "--cy": `${pos.y}%` } as React.CSSProperties}
          aria-hidden
        />
      )}
    </>
  );
}
