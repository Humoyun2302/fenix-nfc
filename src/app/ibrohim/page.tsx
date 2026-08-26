import type { CSSProperties } from "react";
import styles from "./card.module.css";
import { BackgroundDecor } from "@/components/nfc-card/background-decor";
import { ContactButton } from "@/components/nfc-card/contact-button";
import {
  DiamondDivider,
  InstagramIcon,
  PhoneIcon,
  TelegramIcon,
} from "@/components/nfc-card/icons";

const revealAt = (i: number) => ({ "--i": i } as CSSProperties);

function Divider({ style }: { style?: CSSProperties }) {
  return (
    <div className={`${styles.divider} ${styles.reveal}`} style={style} aria-hidden="true">
      <span className={styles.dividerLine} />
      <DiamondDivider className={styles.dividerDiamond} />
      <span className={styles.dividerLine} />
    </div>
  );
}

export default function IbrohimContactPage() {
  return (
    <div className={styles.stage}>
      <main className={styles.panel}>
        <BackgroundDecor />

        <div className={styles.content}>
          <h1 className={`${styles.monogram} ${styles.reveal}`} style={revealAt(0)}>
            IA
          </h1>

          <svg
            className={`${styles.flourish} ${styles.reveal}`}
            style={revealAt(1)}
            viewBox="0 0 200 24"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="flourishGold" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8f6518" stopOpacity="0" />
                <stop offset="50%" stopColor="#f7d77a" />
                <stop offset="100%" stopColor="#8f6518" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M4 12 C 60 0, 80 0, 100 12 C 120 24, 140 24, 196 12"
              stroke="url(#flourishGold)"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <circle cx="100" cy="12" r="1.8" fill="#f7d77a" />
          </svg>

          <p className={`${styles.name} ${styles.reveal}`} style={revealAt(2)}>
            Ibrohim
          </p>
          <p className={`${styles.surname} ${styles.reveal}`} style={revealAt(3)}>
            Abdurahmonovich
          </p>

          <Divider style={revealAt(4)} />

          <p className={`${styles.tagline} ${styles.reveal}`} style={revealAt(5)}>
            Stay Connected
          </p>

          <nav className={styles.cards} aria-label="Contact links">
            <ContactButton
              index={0}
              href="https://t.me/IbrohimZ777FZ"
              external
              title="TELEGRAM"
              subtitle="@IbrohimZ777FZ"
              ariaLabel="Message Ibrohim on Telegram (@IbrohimZ777FZ)"
              icon={<TelegramIcon />}
            />
            <ContactButton
              index={1}
              href="https://www.instagram.com/abdurahmonovic___?igsh=MTJrNDNwbmJhaHZxbw=="
              external
              title="INSTAGRAM"
              subtitle="@abdurahmonovic___"
              ariaLabel="View Ibrohim on Instagram (@abdurahmonovic___)"
              icon={<InstagramIcon />}
            />
            <ContactButton
              index={2}
              href="tel:+998990850555"
              title="PHONE"
              subtitle="+998 99 085 05 55"
              ariaLabel="Call Ibrohim at +998 99 085 05 55"
              icon={<PhoneIcon />}
            />
          </nav>

          <footer className={styles.footer}>
            <Divider style={revealAt(9)} />
            <p className={`${styles.footerText} ${styles.reveal}`} style={revealAt(10)}>
              Thank You For Connecting
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
