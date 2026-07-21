import Image from "next/image";
import { Check } from "lucide-react";
import type { ReactNode } from "react";

export function PhoneMockup({ title, status, children, className = "" }: { title: string; status?: string; children?: ReactNode; className?: string }) {
  return (
    <div className={`phone-mockup ${className}`}>
      <div className="phone-mockup-island" />
      <div className="phone-mockup-screen">
        <span className="phone-glare" aria-hidden />
        <div className="phone-avatar" aria-hidden>
          <Image src="/brand/fenix-symbol-white.png" alt="" width={34} height={34} className="phone-avatar-mark" />
        </div>
        <strong>{title}</strong>
        {status && <span className="connection-status"><Check size={13} aria-hidden />{status}</span>}
        {children ?? (
          <div className="phone-links" aria-hidden>
            <i /><i /><i />
          </div>
        )}
      </div>
    </div>
  );
}
