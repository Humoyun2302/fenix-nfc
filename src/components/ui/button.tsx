import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "dark" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" && "bg-accent text-accent-foreground hover:bg-accent-hover",
        variant === "secondary" && "border border-border bg-surface text-foreground hover:bg-zinc-50",
        variant === "dark" && "bg-dark-surface text-white hover:bg-zinc-800",
        variant === "ghost" && "text-foreground hover:bg-zinc-100",
        variant === "danger" && "bg-error text-white hover:bg-red-700",
        className,
      )}
      {...props}
    />
  );
}
