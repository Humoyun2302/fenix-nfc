import Link from "next/link";
import { Bell, CircleHelp, UserRound } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Page" },
  { href: "/statistics", label: "Statistics" },
  { href: "/leads", label: "Leads" },
  { href: "/products", label: "Products" },
  { href: "/settings", label: "Settings" },
];

export function AppTopNav({ active = "Page", workspaceName }: { active?: string; workspaceName?: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-white px-4">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Logo />
        {workspaceName ? (
          <Badge className="hidden max-w-48 truncate sm:inline-flex">{workspaceName}</Badge>
        ) : null}
      </div>
      <nav className="hidden h-full items-center gap-5 md:flex" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            className={cn(
              "flex h-full items-center border-b-2 border-transparent text-sm text-muted hover:text-foreground",
              active === item.label && "border-accent text-foreground",
            )}
            href={item.href}
            key={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="ml-4 flex flex-1 justify-end gap-1">
        <Link className="rounded-md p-2 text-muted hover:bg-zinc-100 hover:text-foreground" href="/settings">
          <CircleHelp className="h-4 w-4" aria-label="Help" />
        </Link>
        <Link className="rounded-md p-2 text-muted hover:bg-zinc-100 hover:text-foreground" href="/settings">
          <Bell className="h-4 w-4" aria-label="Notifications" />
        </Link>
        <Badge className="hidden sm:inline-flex">Free</Badge>
        <Link className="rounded-md p-2 text-muted hover:bg-zinc-100 hover:text-foreground" href="/settings">
          <UserRound className="h-4 w-4" aria-label="Account" />
        </Link>
      </div>
    </header>
  );
}
