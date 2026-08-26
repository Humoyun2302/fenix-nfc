import { z } from "zod";

export const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Slug must be at least 3 characters")
  .max(48, "Slug is too long")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and single hyphens",
  );

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(2, "Workspace name is required").max(80),
});

export const createPageSchema = z.object({
  workspaceId: z.string().uuid(),
  title: z.string().trim().min(1, "Title is required").max(120),
  slug: slugSchema,
  isInternal: z.boolean().default(false),
});

export const renamePageSchema = z.object({
  pageId: z.string().uuid(),
  title: z.string().trim().min(1, "Title is required").max(120),
});

export const changeSlugSchema = z.object({
  pageId: z.string().uuid(),
  slug: slugSchema,
});

export const inviteSchema = z.object({
  workspaceId: z.string().uuid(),
  email: z.string().trim().email(),
  role: z.enum(["admin", "editor", "viewer", "owner"]),
  isOwnershipClaim: z.boolean().default(false),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type CreatePageInput = z.infer<typeof createPageSchema>;

/**
 * Reserved root paths that may never be used as a public username, to avoid
 * collisions with application routes.
 */
export const RESERVED_SLUGS = new Set([
  "api",
  "app",
  "admin",
  "dashboard",
  "editor",
  "login",
  "register",
  "signup",
  "logout",
  "auth",
  "reset",
  "verify",
  "onboarding",
  "settings",
  "statistics",
  "leads",
  "products",
  "p",
  "t",
  "qr",
  "help",
  "pricing",
  "about",
  "terms",
  "privacy",
  "static",
  "_next",
  "favicon.ico",
]);

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}
