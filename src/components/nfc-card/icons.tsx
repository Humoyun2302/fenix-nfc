import type { SVGProps } from "react";

/**
 * Brand + decorative icons drawn inline so the metallic gold gradient can be
 * applied precisely and there is no runtime icon-font dependency. Each gradient
 * gets a unique id so multiple instances on the page never collide.
 */

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

const GOLD_STOPS = (
  <>
    <stop offset="0%" stopColor="#8f6518" />
    <stop offset="28%" stopColor="#f7d77a" />
    <stop offset="52%" stopColor="#c58b28" />
    <stop offset="76%" stopColor="#fff0ad" />
    <stop offset="100%" stopColor="#9f6a16" />
  </>
);

function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
        {GOLD_STOPS}
      </linearGradient>
    </defs>
  );
}

export function TelegramIcon({ title, ...props }: IconProps) {
  const gid = "grad-telegram";
  return (
    <svg
      viewBox="0 0 24 24"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <GoldDefs id={gid} />
      <path
        fill={`url(#${gid})`}
        d="M21.94 4.63a1.2 1.2 0 0 0-1.24-.2L3.36 11.2c-.86.33-.83 1.57.05 1.86l4.3 1.4 1.64 5.06c.2.62.98.83 1.47.4l2.4-2.1 4.2 3.1c.5.37 1.22.11 1.37-.49l3.2-14.4a1.2 1.2 0 0 0-.45-1.2ZM9.7 14.03l7.6-5.6c.16-.12.35.1.22.24l-6.05 6.02c-.2.2-.33.47-.37.75l-.24 1.86-.9-2.77a.6.6 0 0 1 .14-.5Z"
      />
    </svg>
  );
}

export function InstagramIcon({ title, ...props }: IconProps) {
  const gid = "grad-instagram";
  return (
    <svg
      viewBox="0 0 24 24"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <GoldDefs id={gid} />
      <g fill="none" stroke={`url(#${gid})`} strokeWidth="1.7">
        <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.1" cy="6.9" r="1.15" fill={`url(#${gid})`} stroke="none" />
      </g>
    </svg>
  );
}

export function PhoneIcon({ title, ...props }: IconProps) {
  const gid = "grad-phone";
  return (
    <svg
      viewBox="0 0 24 24"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <GoldDefs id={gid} />
      <path
        fill={`url(#${gid})`}
        d="M6.6 3.2c.6 0 1.13.38 1.32.95l1 3a1.4 1.4 0 0 1-.35 1.44l-1.2 1.18a12.3 12.3 0 0 0 5.16 5.16l1.18-1.2a1.4 1.4 0 0 1 1.44-.35l3 1c.57.19.95.72.95 1.32V19c0 1.1-.9 2-2 2A15.6 15.6 0 0 1 3.2 6c0-1.1.9-2 2-2Z"
      />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  const gid = "grad-chevron";
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <GoldDefs id={gid} />
      <path
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 5 7 7-7 7"
      />
    </svg>
  );
}

export function DiamondDivider(props: IconProps) {
  const gid = "grad-diamond";
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <GoldDefs id={gid} />
      <rect
        x="6"
        y="1"
        width="7.07"
        height="7.07"
        transform="rotate(45 6 1)"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="1"
      />
    </svg>
  );
}
