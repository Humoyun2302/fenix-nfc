import type { ReactNode } from "react";
import { ChevronIcon } from "./icons";
import styles from "@/app/ibrohim/card.module.css";

export type ContactButtonProps = {
  /** Destination: a tel: URI or an external profile URL. */
  href: string;
  /** Platform label, e.g. "TELEGRAM". */
  title: string;
  /** Username or number shown beneath the title. */
  subtitle: string;
  /** Gold platform glyph rendered inside the circular badge. */
  icon: ReactNode;
  /** Accessible description for screen readers. */
  ariaLabel: string;
  /** Open in a new tab (external social links). tel: links stay in place. */
  external?: boolean;
  /** Entrance-animation stagger index. */
  index?: number;
};

export function ContactButton({
  href,
  title,
  subtitle,
  icon,
  ariaLabel,
  external = false,
  index = 0,
}: ContactButtonProps) {
  return (
    <a
      className={styles.card}
      href={href}
      aria-label={ariaLabel}
      style={{ "--i": index } as React.CSSProperties}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      <span className={styles.cardIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.cardText}>
        <span className={styles.cardTitle}>{title}</span>
        <span className={styles.cardSubtitle}>{subtitle}</span>
      </span>
      <ChevronIcon className={styles.cardChevron} />
    </a>
  );
}
