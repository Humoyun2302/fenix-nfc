"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  /** Full-screen on mobile (used for Add Block + block editors). */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-3xl",
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: DialogProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = React.useState(false);

  // Portal guard: only render into document.body after the client has mounted
  // so SSR and the first client render agree.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    // Focus the first focusable element in the panel.
    window.setTimeout(() => {
      const focusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
      focusable?.focus();
    }, 20);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  const titleId = title ? "dialog-title" : undefined;
  const descId = description ? "dialog-desc" : undefined;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/45"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        className={cn(
          "relative z-10 flex h-full w-full flex-col bg-surface shadow-xl sm:h-auto sm:max-h-[88vh] sm:rounded-2xl",
          SIZES[size],
          className,
        )}
      >
        {(title || description) && (
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-surface px-5 py-4 sm:rounded-t-2xl">
            <div className="min-w-0">
              {title ? (
                <h2 id={titleId} className="text-base font-semibold text-ink">
                  {title}
                </h2>
              ) : null}
              {description ? (
                <p id={descId} className="mt-0.5 text-sm text-ink-secondary">
                  {description}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="-mr-1 rounded-md p-1.5 text-ink-secondary transition-colors hover:bg-workspace hover:text-ink"
            >
              <X className="size-5" />
            </button>
          </div>
        )}
        <div className="fx-scroll flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <div className="sticky bottom-0 border-t border-line bg-surface px-5 py-3 sm:rounded-b-2xl">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
