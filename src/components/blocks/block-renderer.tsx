"use client";

import * as React from "react";
import * as Icons from "lucide-react";
import type { EditorBlock } from "@/lib/blocks/types";
import { cn } from "@/lib/utils";
import { PublicForm } from "@/components/forms/public-form";

/** Public form context passed down so `form` blocks can submit. */
export interface RenderContext {
  workspaceId?: string;
  pageId?: string;
  interactive?: boolean; // false inside the editor preview
}

function get<T = string>(obj: Record<string, unknown>, key: string, fallback: T): T {
  const value = obj[key];
  return (value ?? fallback) as T;
}

function LinkCard({
  title,
  subtitle,
  href,
  interactive,
}: {
  title: string;
  subtitle?: string;
  href: string;
  interactive?: boolean;
}) {
  return (
    <a
      href={interactive ? href : undefined}
      onClick={interactive ? undefined : (e) => e.preventDefault()}
      target={interactive ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block w-full rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 text-center transition-transform hover:-translate-y-0.5"
    >
      <span className="block font-medium text-[var(--page-text)]">{title}</span>
      {subtitle ? (
        <span className="mt-0.5 block text-sm opacity-70">{subtitle}</span>
      ) : null}
    </a>
  );
}

function ThemedButton({
  label,
  href,
  interactive,
}: {
  label: string;
  href: string;
  interactive?: boolean;
}) {
  return (
    <a
      href={interactive ? href : undefined}
      onClick={interactive ? undefined : (e) => e.preventDefault()}
      target={interactive ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="block w-full rounded-[var(--btn-radius)] bg-[var(--btn-bg)] px-4 py-3 text-center font-semibold text-[var(--btn-text)] shadow-[var(--btn-shadow)] transition-transform hover:-translate-y-0.5"
    >
      {label}
    </a>
  );
}

function Countdown({ target, title }: { target: string; title: string }) {
  const [remaining, setRemaining] = React.useState(() =>
    Math.max(0, new Date(target).getTime() - Date.now()),
  );
  React.useEffect(() => {
    const id = window.setInterval(
      () => setRemaining(Math.max(0, new Date(target).getTime() - Date.now())),
      1000,
    );
    return () => window.clearInterval(id);
  }, [target]);
  const d = Math.floor(remaining / 86400000);
  const h = Math.floor((remaining % 86400000) / 3600000);
  const m = Math.floor((remaining % 3600000) / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  const cell = (n: number, l: string) => (
    <div className="flex flex-col items-center rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] px-3 py-2">
      <span className="text-xl font-bold tabular-nums text-[var(--page-heading)]">
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase opacity-60">{l}</span>
    </div>
  );
  return (
    <div className="text-center">
      {title ? <p className="mb-2 font-medium">{title}</p> : null}
      <div className="flex justify-center gap-2">
        {cell(d, "days")}
        {cell(h, "hrs")}
        {cell(m, "min")}
        {cell(s, "sec")}
      </div>
    </div>
  );
}

function Faq({ items }: { items: { id: string; question: string; answer: string }[] }) {
  const [open, setOpen] = React.useState<string | null>(null);
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)]"
        >
          <button
            type="button"
            onClick={() => setOpen(open === item.id ? null : item.id)}
            aria-expanded={open === item.id}
            className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left font-medium"
          >
            {item.question}
            <Icons.ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform",
                open === item.id && "rotate-180",
              )}
            />
          </button>
          {open === item.id ? (
            <p className="px-4 pb-3 text-sm opacity-80">{item.answer}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name];
  if (!Cmp) return null;
  return <Cmp className={className} aria-hidden />;
}

/** Render a single block by type. Returns null for unknown/soon types. */
export function BlockView({
  block,
  ctx,
}: {
  block: EditorBlock;
  ctx: RenderContext;
}) {
  const c = block.content as Record<string, unknown>;
  const interactive = ctx.interactive ?? true;

  switch (block.type) {
    case "heading": {
      const level = get<number>(c, "level", 2);
      const Tag = (`h${Math.min(3, Math.max(1, level))}` as "h1" | "h2" | "h3");
      return (
        <Tag className="text-2xl font-bold text-[var(--page-heading)]">
          {get(c, "text", "Heading")}
        </Tag>
      );
    }
    case "text":
      return (
        <p className="whitespace-pre-wrap leading-relaxed text-[var(--page-text)]">
          {get(c, "text", "")}
        </p>
      );
    case "button":
      return (
        <ThemedButton
          label={get(c, "label", "Open link")}
          href={get(c, "url", "#")}
          interactive={interactive}
        />
      );
    case "link":
    case "custom-url":
    case "external-page":
      return (
        <LinkCard
          title={get(c, "title", "Link")}
          subtitle={get(c, "subtitle", "")}
          href={get(c, "url", "#")}
          interactive={interactive}
        />
      );
    case "internal-page":
      return (
        <LinkCard
          title={get(c, "title", "Go to page")}
          href={interactive ? `/p/${get(c, "targetSlug", "")}` : "#"}
          interactive={interactive}
        />
      );
    case "link-list": {
      const items = get<{ id: string; title: string; url: string }[]>(c, "items", []);
      return (
        <div className="space-y-2">
          {items.map((it) => (
            <LinkCard key={it.id} title={it.title} href={it.url} interactive={interactive} />
          ))}
        </div>
      );
    }
    case "divider":
      return <hr className="border-[var(--card-border)]" />;
    case "spacer":
      return <div style={{ height: get<number>(c, "size", 24) }} aria-hidden />;
    case "icon-text":
      return (
        <div className="flex items-center justify-center gap-2 text-[var(--page-text)]">
          <DynamicIcon name={get(c, "icon", "Star")} className="size-5" />
          <span>{get(c, "text", "")}</span>
        </div>
      );
    case "avatar": {
      const url = get(c, "url", "");
      return (
        <div className="flex justify-center">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt=""
              className="size-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-24 items-center justify-center rounded-full bg-[var(--card-bg)] text-[var(--page-text)]">
              <Icons.User className="size-10 opacity-40" />
            </div>
          )}
        </div>
      );
    }
    case "profile-header": {
      const avatar = get(c, "avatarUrl", "");
      return (
        <div className="flex flex-col items-center gap-2 text-center">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="size-24 rounded-full object-cover" />
          ) : (
            <div className="flex size-24 items-center justify-center rounded-full bg-[var(--card-bg)]">
              <Icons.User className="size-10 opacity-40" />
            </div>
          )}
          <h2 className="text-xl font-bold text-[var(--page-heading)]">
            {get(c, "name", "Your name")}
          </h2>
          <p className="text-sm opacity-80">{get(c, "bio", "")}</p>
        </div>
      );
    }
    case "social-links": {
      const items = get<{ id: string; network: string; url: string }[]>(c, "items", []);
      const iconFor: Record<string, string> = {
        instagram: "Instagram",
        facebook: "Facebook",
        twitter: "Twitter",
        youtube: "Youtube",
        linkedin: "Linkedin",
        github: "Github",
      };
      return (
        <div className="flex flex-wrap justify-center gap-3">
          {items.map((it) => (
            <a
              key={it.id}
              href={interactive ? it.url : undefined}
              onClick={interactive ? undefined : (e) => e.preventDefault()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-11 items-center justify-center rounded-full border border-[var(--card-border)] bg-[var(--card-bg)]"
              aria-label={it.network}
            >
              <DynamicIcon name={iconFor[it.network] ?? "Link"} className="size-5" />
            </a>
          ))}
        </div>
      );
    }
    case "messengers": {
      const items = get<{ id: string; app: string; value: string }[]>(c, "items", []);
      return (
        <div className="space-y-2">
          {items.map((it) => (
            <LinkCard key={it.id} title={it.app} href={it.value} interactive={interactive} />
          ))}
        </div>
      );
    }
    case "phone":
      return (
        <a
          href={interactive ? `tel:${get(c, "number", "")}` : undefined}
          onClick={interactive ? undefined : (e) => e.preventDefault()}
          className="flex items-center justify-center gap-2 rounded-[var(--btn-radius)] bg-[var(--btn-bg)] px-4 py-3 font-medium text-[var(--btn-text)]"
        >
          <Icons.Phone className="size-4" />
          {get(c, "label", "Call")} · {get(c, "number", "")}
        </a>
      );
    case "email":
      return (
        <a
          href={interactive ? `mailto:${get(c, "address", "")}` : undefined}
          onClick={interactive ? undefined : (e) => e.preventDefault()}
          className="flex items-center justify-center gap-2 rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3 font-medium"
        >
          <Icons.Mail className="size-4" />
          {get(c, "address", "")}
        </a>
      );
    case "address":
      return (
        <div className="flex items-center justify-center gap-2 text-center text-[var(--page-text)]">
          <Icons.MapPin className="size-4 shrink-0" />
          <span>{get(c, "text", "")}</span>
        </div>
      );
    case "working-hours": {
      const rows = get<{ id: string; day: string; hours: string }[]>(c, "rows", []);
      return (
        <div className="overflow-hidden rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)]">
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex justify-between border-b border-[var(--card-border)] px-4 py-2 text-sm last:border-b-0"
            >
              <span className="font-medium">{r.day}</span>
              <span className="opacity-80">{r.hours}</span>
            </div>
          ))}
        </div>
      );
    }
    case "image":
    case "banner": {
      const url = get(c, "url", "");
      if (!url)
        return (
          <div className="flex h-40 items-center justify-center rounded-[var(--card-radius)] border border-dashed border-[var(--card-border)] text-sm opacity-50">
            No image selected
          </div>
        );
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={get(c, "alt", "")}
            className="w-full rounded-[var(--card-radius)] object-cover"
          />
          {get(c, "caption", "") ? (
            <figcaption className="mt-1 text-center text-xs opacity-60">
              {get(c, "caption", "")}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "gallery": {
      const images = get<{ id: string; url: string }[]>(c, "images", []);
      return (
        <div className="grid grid-cols-2 gap-2">
          {images.map((img) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={img.id}
              src={img.url}
              alt=""
              className="aspect-square w-full rounded-[var(--card-radius)] object-cover"
            />
          ))}
        </div>
      );
    }
    case "youtube": {
      const url = get(c, "url", "");
      const id = extractYouTubeId(url);
      if (!id)
        return (
          <div className="flex h-40 items-center justify-center rounded-[var(--card-radius)] border border-dashed border-[var(--card-border)] text-sm opacity-50">
            Add a YouTube link
          </div>
        );
      return (
        <div className="aspect-video overflow-hidden rounded-[var(--card-radius)]">
          <iframe
            className="size-full"
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }
    case "file":
      return (
        <a
          href={interactive ? get(c, "url", "#") : undefined}
          onClick={interactive ? undefined : (e) => e.preventDefault()}
          className="flex items-center justify-center gap-2 rounded-[var(--btn-radius)] bg-[var(--btn-bg)] px-4 py-3 font-medium text-[var(--btn-text)]"
        >
          <Icons.FileDown className="size-4" />
          {get(c, "label", "Download")}
        </a>
      );
    case "map": {
      const q = encodeURIComponent(get(c, "query", "Tashkent"));
      return (
        <div className="aspect-video overflow-hidden rounded-[var(--card-radius)]">
          <iframe
            className="size-full"
            src={`https://www.google.com/maps?q=${q}&output=embed`}
            title="Map"
            loading="lazy"
          />
        </div>
      );
    }
    case "services": {
      const items = get<{ id: string; title: string; price: string; description: string }[]>(c, "items", []);
      return (
        <div className="space-y-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex items-start justify-between gap-3 rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3"
            >
              <div>
                <p className="font-medium">{it.title}</p>
                {it.description ? (
                  <p className="text-sm opacity-70">{it.description}</p>
                ) : null}
              </div>
              {it.price ? <span className="font-semibold">{it.price}</span> : null}
            </div>
          ))}
        </div>
      );
    }
    case "price-list": {
      const items = get<{ id: string; label: string; price: string }[]>(c, "items", []);
      return (
        <div className="overflow-hidden rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)]">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex justify-between border-b border-[var(--card-border)] px-4 py-2 last:border-b-0"
            >
              <span>{it.label}</span>
              <span className="font-semibold">{it.price}</span>
            </div>
          ))}
        </div>
      );
    }
    case "faq":
      return <Faq items={get(c, "items", [])} />;
    case "reviews": {
      const items = get<{ id: string; author: string; text: string; rating: number }[]>(c, "items", []);
      return (
        <div className="space-y-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-3"
            >
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: Math.max(0, Math.min(5, it.rating)) }).map((_, i) => (
                  <Icons.Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-1 text-sm">{it.text}</p>
              <p className="mt-1 text-xs opacity-60">— {it.author}</p>
            </div>
          ))}
        </div>
      );
    }
    case "team": {
      const items = get<{ id: string; name: string; role: string; avatar: string }[]>(c, "items", []);
      return (
        <div className="grid grid-cols-2 gap-2">
          {items.map((it) => (
            <div
              key={it.id}
              className="flex flex-col items-center rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] p-3 text-center"
            >
              {it.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.avatar} alt="" className="size-16 rounded-full object-cover" />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full bg-workspace">
                  <Icons.User className="size-7 opacity-40" />
                </div>
              )}
              <p className="mt-1 text-sm font-medium">{it.name}</p>
              <p className="text-xs opacity-60">{it.role}</p>
            </div>
          ))}
        </div>
      );
    }
    case "countdown":
      return <Countdown target={get(c, "target", "")} title={get(c, "title", "")} />;
    case "cta":
      return (
        <div className="rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-center">
          <p className="mb-3 text-lg font-semibold text-[var(--page-heading)]">
            {get(c, "title", "")}
          </p>
          <ThemedButton
            label={get(c, "label", "Get started")}
            href={get(c, "url", "#")}
            interactive={interactive}
          />
        </div>
      );
    case "newsletter":
    case "form":
      return (
        <PublicForm
          block={block}
          workspaceId={ctx.workspaceId}
          pageId={ctx.pageId}
          interactive={interactive}
        />
      );
    case "html":
      return (
        <div
          className="prose-sm"
          // The HTML is sanitized on save; see lib/blocks/sanitize.
          dangerouslySetInnerHTML={{ __html: get(c, "html", "") }}
        />
      );
    case "embed": {
      const url = get(c, "url", "");
      if (!url) return null;
      return (
        <div className="aspect-video overflow-hidden rounded-[var(--card-radius)]">
          <iframe className="size-full" src={url} title="Embedded content" loading="lazy" />
        </div>
      );
    }
    default:
      return null;
  }
}

export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
