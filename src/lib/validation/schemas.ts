import { z } from "zod";
import type { BlockType } from "@/types/product";
import { slugify } from "@/lib/utils";

export const authSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
});

export const workspaceSchema = z.object({
  name: z.string().min(2).max(80),
});

export const pageSchema = z.object({
  title: z.string().min(2).max(90),
  slug: z
    .string()
    .min(2)
    .max(72)
    .transform(slugify),
});

export const blockTypeSchema = z.custom<BlockType>((value) => typeof value === "string");

export const blockSchema = z.object({
  pageId: z.uuid(),
  type: blockTypeSchema,
});

export const blockUpdateSchema = z.object({
  blockId: z.uuid(),
  content: z.record(z.string(), z.unknown()),
  design: z.record(z.string(), z.unknown()).default({}),
  isVisible: z.boolean().default(true),
});

export const reorderSchema = z.object({
  pageId: z.uuid(),
  orderedIds: z.array(z.uuid()).min(1),
});

export const publicFormSubmissionSchema = z.object({
  workspaceId: z.uuid(),
  pageId: z.uuid(),
  blockId: z.uuid(),
  visitorId: z.string().max(120).optional(),
  fields: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.array(z.string())])),
});

export const analyticsSchema = z.object({
  workspaceId: z.uuid().optional(),
  pageId: z.uuid().optional(),
  blockId: z.uuid().optional(),
  eventType: z.string().min(2).max(80),
  visitorId: z.string().max(120).optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export const nfcDestinationSchema = z.object({
  assignedPageSlug: z.string().optional().nullable(),
  assignedUrl: z.url().optional().nullable(),
});
