import Image from "next/image";
import type { ReactNode } from "react";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import type { EditorBlock, PageDesign } from "@/types/product";

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function fields(content: Record<string, unknown>) {
  return Array.isArray(content.fields) ? content.fields : [];
}

export function BlockRenderer({
  block,
  design,
  editable,
  onClick,
}: {
  block: EditorBlock;
  design: PageDesign;
  editable?: boolean;
  onClick?: () => void;
}) {
  const content = block.content;
  const style = {
    borderRadius: design.cardRadius,
    background: design.cardBackground,
    borderColor: design.cardBorder,
    color: design.textColor,
  };

  const wrapper = (children: ReactNode, className = "") => (
    <div
      className={`group relative border p-4 ${editable ? "cursor-pointer hover:outline hover:outline-1 hover:outline-accent" : ""} ${className}`}
      onClick={onClick}
      role={editable ? "button" : undefined}
      style={style}
      tabIndex={editable ? 0 : undefined}
    >
      {children}
    </div>
  );

  if (!block.is_visible && !editable) return null;

  switch (block.type) {
    case "heading":
      return wrapper(
        <h2 className="text-pretty text-2xl font-semibold" style={{ color: design.headingColor }}>
          {text(content.text, "Heading")}
        </h2>,
      );
    case "text":
      return wrapper(<p className="whitespace-pre-wrap text-sm leading-6">{text(content.text, "Text")}</p>);
    case "link":
    case "button":
      return (
        <a
          className="flex min-h-12 items-center justify-center gap-2 border px-4 text-center text-sm font-semibold"
          href={text(content.url, "#")}
          rel="noopener noreferrer"
          style={{
            borderRadius: design.buttonRadius,
            background: block.type === "button" ? design.buttonBackground : design.cardBackground,
            color: block.type === "button" ? design.buttonText : design.linkColor,
            borderColor: design.cardBorder,
          }}
          target="_blank"
          onClick={onClick}
        >
          {text(content.label, "Open link")}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      );
    case "profile_header":
      return wrapper(
        <div className={`flex flex-col gap-3 ${design.headerAlignment === "center" ? "items-center text-center" : ""}`}>
          {text(content.avatarUrl) ? (
            <Image
              alt={text(content.name, "Profile avatar")}
              className="h-20 w-20 rounded-full object-cover"
              height={80}
              src={text(content.avatarUrl)}
              width={80}
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-xl font-semibold">
              {text(content.name, "F").charAt(0)}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold" style={{ color: design.headingColor }}>
              {text(content.name, "Fenix customer")}
            </h1>
            <p className="mt-1 text-sm text-muted">{text(content.subtitle, "Digital business card")}</p>
          </div>
        </div>,
      );
    case "contact_details":
      return wrapper(
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted" /> {text(content.phone, "+998")}
          </p>
          <p className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted" /> {text(content.email, "hello@example.com")}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted" /> {text(content.address, "Tashkent")}
          </p>
        </div>,
      );
    case "image":
      return text(content.src)
        ? wrapper(
            <Image
              alt={text(content.alt, "Page image")}
              className="h-auto w-full object-cover"
              height={520}
              src={text(content.src)}
              width={720}
            />,
            "overflow-hidden p-0",
          )
        : wrapper(<div className="flex h-36 items-center justify-center bg-zinc-100 text-sm text-muted">Image</div>);
    case "form":
      return wrapper(
        <form className="space-y-3" action="/api/forms" method="post">
          <h2 className="text-lg font-semibold" style={{ color: design.headingColor }}>
            {text(content.title, "Contact us")}
          </h2>
          <input name="workspaceId" type="hidden" value={block.workspace_id} />
          <input name="pageId" type="hidden" value={block.page_id} />
          <input name="blockId" type="hidden" value={block.id} />
          {fields(content).map((field) => {
            const item = field as { id?: string; label?: string; type?: string; required?: boolean };
            return (
              <label className="block text-xs font-medium text-muted" key={item.id}>
                {item.label}
                <input
                  className="mt-1 h-10 w-full rounded-md border border-border px-3 text-sm"
                  name={`fields.${item.id}`}
                  required={item.required}
                  type={item.type === "phone" ? "tel" : "text"}
                />
              </label>
            );
          })}
          <button
            className="h-10 w-full rounded-md px-4 text-sm font-semibold"
            style={{ background: design.buttonBackground, color: design.buttonText, borderRadius: design.buttonRadius }}
            type="submit"
          >
            Send
          </button>
        </form>,
      );
    case "divider":
      return <div className="h-px bg-border" onClick={onClick} />;
    case "spacer":
      return <div className="h-8" onClick={onClick} />;
    default:
      return wrapper(
        <div>
          <p className="text-sm font-semibold">{text(content.title, block.type.replaceAll("_", " "))}</p>
          <p className="mt-1 text-xs text-muted">This block is ready for content and design configuration.</p>
        </div>,
      );
  }
}
