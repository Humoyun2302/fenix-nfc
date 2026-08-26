import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function formatPublicUrl(slug?: string | null) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://fenixnfc.uz";
  return `${base.replace(/\/$/, "")}/p/${slug ?? "page"}`;
}

export function maskSupabaseError(message?: string) {
  if (!message) return "Something went wrong. Please try again.";
  if (/invalid login|credentials/i.test(message)) return "Email or password is incorrect.";
  if (/already registered|already exists/i.test(message)) return "An account with this email already exists.";
  if (/email/i.test(message)) return "Please check the email address and try again.";
  return "We could not complete that action. Please try again.";
}
