"use client";

import { useEffect, useState } from "react";

export type MousePosition = { x: number; y: number };

export function useMousePosition<T extends HTMLElement>(element: React.RefObject<T | null>) {
  const [position, setPosition] = useState<MousePosition>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const update = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      setPosition({
        x: Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)),
        y: Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height)),
      });
    };
    const reset = () => setPosition({ x: 0.5, y: 0.5 });
    node.addEventListener("pointermove", update);
    node.addEventListener("pointerleave", reset);
    return () => {
      node.removeEventListener("pointermove", update);
      node.removeEventListener("pointerleave", reset);
    };
  }, [element]);

  return position;
}
