"use client";

import * as React from "react";
import type { EditorBlock } from "@/lib/blocks/types";

interface PublicFormProps {
  block: EditorBlock;
  workspaceId?: string;
  pageId?: string;
  interactive?: boolean;
}

interface FormFieldDef {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
}

const DEFAULT_FIELDS: FormFieldDef[] = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "phone", label: "Phone", type: "tel", required: true },
];

/**
 * Renders a lead-capture form. On the public page it POSTs to the backend RPC
 * and only shows the success state after the server confirms the submission.
 */
export function PublicForm({ block, workspaceId, pageId, interactive }: PublicFormProps) {
  const content = block.content as Record<string, unknown>;
  const formId = (content.formId as string | null) ?? null;
  const isNewsletter = block.type === "newsletter";
  const title = (content.title as string) ?? (isNewsletter ? "Subscribe" : "Contact us");
  const fields: FormFieldDef[] = isNewsletter
    ? [{ key: "email", label: "Email", type: "email", required: true, placeholder: (content.placeholder as string) ?? "Your email" }]
    : ((content.fields as FormFieldDef[] | undefined) ?? DEFAULT_FIELDS);

  const [status, setStatus] = React.useState<"idle" | "submitting" | "done" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!interactive) return;
    if (!formId) {
      setError("This form is not configured yet.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setError(null);
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fields.forEach((f) => {
      data[f.key] = String(formData.get(f.key) ?? "");
    });

    try {
      const res = await fetch("/api/public/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, workspaceId, pageId, blockId: block.id, data }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Submission failed");
      }
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] p-4 text-center">
        <p className="font-medium text-[var(--page-heading)]">
          {(content.successMessage as string) ?? "Thank you! We'll be in touch."}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-[var(--card-radius)] border border-[var(--card-border)] bg-[var(--card-bg)] p-4"
    >
      {title ? (
        <p className="font-semibold text-[var(--page-heading)]">{title}</p>
      ) : null}
      {fields.map((f) => (
        <div key={f.key} className="space-y-1 text-left">
          <label htmlFor={`${block.id}-${f.key}`} className="text-sm font-medium">
            {f.label}
            {f.required ? <span className="text-danger"> *</span> : null}
          </label>
          {f.type === "textarea" ? (
            <textarea
              id={`${block.id}-${f.key}`}
              name={f.key}
              required={f.required}
              placeholder={f.placeholder}
              rows={3}
              className="w-full rounded-lg border border-[var(--card-border)] bg-white/60 px-3 py-2 text-sm text-ink"
            />
          ) : (
            <input
              id={`${block.id}-${f.key}`}
              name={f.key}
              type={f.type}
              required={f.required}
              placeholder={f.placeholder}
              className="h-10 w-full rounded-lg border border-[var(--card-border)] bg-white/60 px-3 text-sm text-ink"
            />
          )}
        </div>
      ))}
      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-[var(--btn-radius)] bg-[var(--btn-bg)] px-4 py-3 font-semibold text-[var(--btn-text)] disabled:opacity-60"
      >
        {status === "submitting"
          ? "Sending…"
          : isNewsletter
            ? "Subscribe"
            : ((content.submitLabel as string) ?? "Send")}
      </button>
    </form>
  );
}
