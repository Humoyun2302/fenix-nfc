"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view for scroll-spy navigation.
 * Returns the id (without the leading #) of the section closest to the top.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);
    if (!sections.length) return;

    const onScroll = () => {
      const marker = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids]);

  return active;
}
