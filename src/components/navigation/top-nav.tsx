"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronsUpDown,
  Check,
  LogOut,
  Settings,
  CircleHelp,
  Bell,
  User,
  LayoutDashboard,
} from "lucide-react";
import { FenixLogo, FenixMark } from "@/components/brand/logo";
import { Menu, MenuItem, MenuLabel, MenuSeparator } from "@/components/ui/menu";
import { logoutAction } from "@/app/(auth)/actions";
import { cn } from "@/lib/utils";
import type { WorkspaceRole } from "@/types/database";

export interface NavWorkspace {
  id: string;
  name: string;
  role: WorkspaceRole;
}

interface TopNavProps {
  user: { email: string; fullName: string | null };
  workspaces: NavWorkspace[];
  activeWorkspaceId: string;
  planLabel?: string;
}

const MAIN_NAV = [
  { href: "/dashboard", label: "Pages", icon: LayoutDashboard },
  { href: "/statistics", label: "Statistics" },
  { href: "/leads", label: "Leads" },
  { href: "/products", label: "Products" },
  { href: "/settings", label: "Settings" },
];

export function TopNav({
  user,
  workspaces,
  activeWorkspaceId,
  planLabel = "Free",
}: TopNavProps) {
  const pathname = usePathname();
  const active =
    workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];

  const initials = (user.fullName ?? user.email)
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <div className="mx-auto flex h-[56px] max-w-6xl items-center gap-3 px-4">
        <Link href="/dashboard" className="shrink-0" aria-label="Fenix.nfc home">
          <span className="hidden sm:inline">
            <FenixLogo />
          </span>
          <span className="sm:hidden">
            <FenixMark />
          </span>
        </Link>

        {active ? (
          <Menu
            align="start"
            trigger={
              <span className="flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1.5 text-sm font-medium text-ink hover:bg-workspace">
                <span className="max-w-32 truncate">{active.name}</span>
                <ChevronsUpDown className="size-3.5 text-ink-secondary" />
              </span>
            }
          >
            <MenuLabel>Workspaces</MenuLabel>
            {workspaces.map((w) => (
              <Link key={w.id} href={`/dashboard?ws=${w.id}`}>
                <MenuItem>
                  <span className="flex-1 truncate">{w.name}</span>
                  {w.id === active.id ? (
                    <Check className="size-4 text-accent" />
                  ) : null}
                </MenuItem>
              </Link>
            ))}
            <MenuSeparator />
            <Link href="/settings/workspace">
              <MenuItem>
                <Settings className="size-4" /> Workspace settings
              </MenuItem>
            </Link>
          </Menu>
        ) : null}

        <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Main">
          {MAIN_NAV.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "font-medium text-ink"
                    : "text-ink-secondary hover:text-ink",
                )}
              >
                {item.label}
                {isActive ? (
                  <span className="absolute inset-x-2 -bottom-[9px] h-0.5 rounded-full bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/settings/billing"
            className="hidden rounded-full border border-line px-2.5 py-1 text-xs font-medium text-ink-secondary hover:text-ink sm:inline"
          >
            {planLabel} plan
          </Link>
          <Link
            href="/help"
            className="rounded-md p-2 text-ink-secondary hover:bg-workspace hover:text-ink"
            aria-label="Help"
          >
            <CircleHelp className="size-5" />
          </Link>
          <Link
            href="/notifications"
            className="rounded-md p-2 text-ink-secondary hover:bg-workspace hover:text-ink"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
          </Link>

          <Menu
            trigger={
              <span className="flex size-8 items-center justify-center rounded-full bg-dark-surface text-xs font-semibold text-white">
                {initials || <User className="size-4" />}
              </span>
            }
          >
            <div className="px-3 py-2">
              <p className="truncate text-sm font-medium text-ink">
                {user.fullName ?? "Account"}
              </p>
              <p className="truncate text-xs text-ink-secondary">{user.email}</p>
            </div>
            <MenuSeparator />
            <Link href="/settings/account">
              <MenuItem>
                <User className="size-4" /> Account
              </MenuItem>
            </Link>
            <Link href="/settings">
              <MenuItem>
                <Settings className="size-4" /> Settings
              </MenuItem>
            </Link>
            <MenuSeparator />
            <form action={logoutAction}>
              <button
                type="submit"
                role="menuitem"
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger transition-colors hover:bg-workspace"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </form>
          </Menu>
        </div>
      </div>

      <nav
        className="flex items-center gap-1 overflow-x-auto border-t border-line px-2 py-1.5 md:hidden"
        aria-label="Main mobile"
      >
        {MAIN_NAV.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-md px-3 py-1.5 text-sm",
                isActive
                  ? "bg-workspace font-medium text-ink"
                  : "text-ink-secondary",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
