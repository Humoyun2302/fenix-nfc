import Link from "next/link";

export function Logo() {
  return (
    <Link className="flex items-center gap-2 text-sm font-semibold text-foreground" href="/">
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-dark-surface text-accent">F</span>
      <span>Fenix.nfc</span>
    </Link>
  );
}
