import Link from "next/link";
import { FenixLogo } from "@/components/brand/logo";
import { ShieldCheck, Zap, ScanLine } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex">
            <FenixLogo />
          </Link>
          {children}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-dark-surface lg:block">
        <div className="flex h-full flex-col justify-between p-12 text-white">
          <FenixLogo className="[&_span]:text-white" />
          <div className="space-y-6">
            <h2 className="max-w-sm text-3xl font-semibold leading-tight">
              Build premium mini-sites and NFC pages in minutes.
            </h2>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3">
                <Zap className="size-5 text-accent" /> Compact, focused editor
              </li>
              <li className="flex items-center gap-3">
                <ScanLine className="size-5 text-accent" /> NFC tags & QR codes built in
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-5 text-accent" /> Secure, multi-tenant workspaces
              </li>
            </ul>
          </div>
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} Fenix.nfc. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
