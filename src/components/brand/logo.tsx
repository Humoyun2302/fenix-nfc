import { cn } from "@/lib/utils";

/**
 * Original Fenix.nfc mark: an upward "phoenix spark" chevron inside a rounded
 * square, paired with the wordmark. Purely original artwork.
 */
export function FenixMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-7", className)}
      role="img"
      aria-label="Fenix.nfc"
    >
      <rect width="32" height="32" rx="8" fill="#2D3034" />
      <path
        d="M16 6.5c2.6 3 4.2 5.3 4.2 8a4.2 4.2 0 0 1-1.5 3.3c.5-1.6.1-3-.9-4.2.2 2.6-1 4.4-2.9 5.6.7-1.6.5-3-.6-4.2-.3 2-1.4 3-2.7 3.8a4.3 4.3 0 0 1-.6-2.2c0-3.3 2.2-6.4 5.5-9.9Z"
        fill="#D6A84B"
      />
      <path
        d="M11 21.5h10a1 1 0 0 1 0 2H11a1 1 0 0 1 0-2Z"
        fill="#D6A84B"
        opacity="0.55"
      />
    </svg>
  );
}

export function FenixLogo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <FenixMark />
      {showWordmark ? (
        <span className="text-[17px] font-semibold tracking-tight text-ink">
          Fenix<span className="text-accent">.nfc</span>
        </span>
      ) : null}
    </span>
  );
}
