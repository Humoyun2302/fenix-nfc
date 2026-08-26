import { AppTopNav } from "@/components/navigation/app-top-nav";
import type { ReactNode } from "react";

export function SectionShell({
  active,
  title,
  description,
  children,
}: {
  active: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <AppTopNav active={active} />
      <main className="mx-auto w-full max-w-5xl px-4 py-6">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        <div className="mt-5">{children}</div>
      </main>
    </>
  );
}
