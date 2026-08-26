import type { BlockType } from "./types";

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "number"
  | "select"
  | "image"
  | "datetime"
  | "list";

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  /** For list fields: the schema of each item. */
  item?: FieldSchema[];
  /** Default new list item. */
  itemDefaults?: Record<string, unknown>;
  hint?: string;
}

/**
 * Field definitions per block type. The generic block editor renders these,
 * validates them, and persists the resulting content JSON.
 */
export const EDITOR_SCHEMA: Partial<Record<BlockType, FieldSchema[]>> = {
  heading: [
    { key: "text", label: "Heading text", type: "text" },
    {
      key: "level",
      label: "Size",
      type: "select",
      options: [
        { value: "1", label: "Large (H1)" },
        { value: "2", label: "Medium (H2)" },
        { value: "3", label: "Small (H3)" },
      ],
    },
  ],
  text: [{ key: "text", label: "Text", type: "textarea" }],
  button: [
    { key: "label", label: "Button label", type: "text" },
    { key: "url", label: "Link URL", type: "url", placeholder: "https://" },
  ],
  link: [
    { key: "title", label: "Title", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
    { key: "url", label: "URL", type: "url", placeholder: "https://" },
  ],
  "custom-url": [
    { key: "title", label: "Title", type: "text" },
    { key: "url", label: "URL", type: "url", placeholder: "https://" },
  ],
  "external-page": [
    { key: "title", label: "Title", type: "text" },
    { key: "url", label: "Website URL", type: "url", placeholder: "https://" },
  ],
  "internal-page": [
    { key: "title", label: "Title", type: "text" },
    { key: "targetSlug", label: "Target page slug", type: "text", hint: "The slug of another page in this site." },
  ],
  "link-list": [
    {
      key: "items",
      label: "Links",
      type: "list",
      itemDefaults: { title: "New link", url: "https://" },
      item: [
        { key: "title", label: "Title", type: "text" },
        { key: "url", label: "URL", type: "url" },
      ],
    },
  ],
  spacer: [{ key: "size", label: "Height (px)", type: "number" }],
  "icon-text": [
    { key: "icon", label: "Lucide icon name", type: "text", hint: "e.g. Star, Heart, Zap" },
    { key: "text", label: "Text", type: "text" },
  ],
  avatar: [{ key: "url", label: "Image URL", type: "image" }],
  "profile-header": [
    { key: "avatarUrl", label: "Avatar image", type: "image" },
    { key: "name", label: "Name", type: "text" },
    { key: "bio", label: "Bio", type: "textarea" },
  ],
  "contact-details": [
    {
      key: "items",
      label: "Contact methods",
      type: "list",
      itemDefaults: { type: "phone", value: "+998 90 000 00 00" },
      item: [
        {
          key: "type",
          label: "Type",
          type: "select",
          options: [
            { value: "phone", label: "Phone" },
            { value: "email", label: "Email" },
            { value: "address", label: "Address" },
            { value: "website", label: "Website" },
          ],
        },
        { key: "value", label: "Value", type: "text" },
      ],
    },
  ],
  "social-links": [
    {
      key: "items",
      label: "Networks",
      type: "list",
      itemDefaults: { network: "instagram", url: "https://" },
      item: [
        {
          key: "network",
          label: "Network",
          type: "select",
          options: [
            { value: "instagram", label: "Instagram" },
            { value: "facebook", label: "Facebook" },
            { value: "twitter", label: "Twitter / X" },
            { value: "youtube", label: "YouTube" },
            { value: "linkedin", label: "LinkedIn" },
            { value: "github", label: "GitHub" },
          ],
        },
        { key: "url", label: "URL", type: "url" },
      ],
    },
  ],
  messengers: [
    {
      key: "items",
      label: "Messengers",
      type: "list",
      itemDefaults: { app: "Telegram", value: "https://t.me/" },
      item: [
        { key: "app", label: "App", type: "text" },
        { key: "value", label: "Link", type: "url" },
      ],
    },
  ],
  phone: [
    { key: "label", label: "Label", type: "text" },
    { key: "number", label: "Phone number", type: "text" },
  ],
  email: [
    { key: "label", label: "Label", type: "text" },
    { key: "address", label: "Email address", type: "text" },
  ],
  address: [{ key: "text", label: "Address", type: "text" }],
  "working-hours": [
    {
      key: "rows",
      label: "Hours",
      type: "list",
      itemDefaults: { day: "Mon–Fri", hours: "09:00 – 18:00" },
      item: [
        { key: "day", label: "Day(s)", type: "text" },
        { key: "hours", label: "Hours", type: "text" },
      ],
    },
  ],
  image: [
    { key: "url", label: "Image", type: "image" },
    { key: "alt", label: "Alt text", type: "text" },
    { key: "caption", label: "Caption", type: "text" },
  ],
  banner: [{ key: "url", label: "Banner image", type: "image" }],
  gallery: [
    {
      key: "images",
      label: "Images",
      type: "list",
      itemDefaults: { url: "" },
      item: [{ key: "url", label: "Image URL", type: "image" }],
    },
  ],
  youtube: [{ key: "url", label: "YouTube URL", type: "url" }],
  file: [
    { key: "label", label: "Button label", type: "text" },
    { key: "url", label: "File URL", type: "url" },
  ],
  map: [{ key: "query", label: "Location / address", type: "text" }],
  services: [
    {
      key: "items",
      label: "Services",
      type: "list",
      itemDefaults: { title: "Service", price: "", description: "" },
      item: [
        { key: "title", label: "Title", type: "text" },
        { key: "price", label: "Price", type: "text" },
        { key: "description", label: "Description", type: "text" },
      ],
    },
  ],
  "price-list": [
    {
      key: "items",
      label: "Items",
      type: "list",
      itemDefaults: { label: "Item", price: "0" },
      item: [
        { key: "label", label: "Item", type: "text" },
        { key: "price", label: "Price", type: "text" },
      ],
    },
  ],
  faq: [
    {
      key: "items",
      label: "Questions",
      type: "list",
      itemDefaults: { question: "Question?", answer: "Answer." },
      item: [
        { key: "question", label: "Question", type: "text" },
        { key: "answer", label: "Answer", type: "textarea" },
      ],
    },
  ],
  reviews: [
    {
      key: "items",
      label: "Reviews",
      type: "list",
      itemDefaults: { author: "Customer", text: "Great!", rating: 5 },
      item: [
        { key: "author", label: "Author", type: "text" },
        { key: "text", label: "Review", type: "textarea" },
        { key: "rating", label: "Rating (1–5)", type: "number" },
      ],
    },
  ],
  team: [
    {
      key: "items",
      label: "Members",
      type: "list",
      itemDefaults: { name: "Name", role: "Role", avatar: "" },
      item: [
        { key: "name", label: "Name", type: "text" },
        { key: "role", label: "Role", type: "text" },
        { key: "avatar", label: "Avatar", type: "image" },
      ],
    },
  ],
  countdown: [
    { key: "title", label: "Title", type: "text" },
    { key: "target", label: "Target date/time", type: "datetime" },
  ],
  cta: [
    { key: "title", label: "Headline", type: "text" },
    { key: "label", label: "Button label", type: "text" },
    { key: "url", label: "Button URL", type: "url" },
  ],
  form: [
    { key: "title", label: "Form title", type: "text" },
    { key: "submitLabel", label: "Submit button label", type: "text" },
    { key: "successMessage", label: "Success message", type: "text" },
  ],
  newsletter: [
    { key: "title", label: "Title", type: "text" },
    { key: "placeholder", label: "Email placeholder", type: "text" },
  ],
  html: [{ key: "html", label: "Custom HTML", type: "textarea", hint: "Scripts and unsafe tags are removed on save." }],
  embed: [{ key: "url", label: "Embed URL", type: "url" }],
  divider: [],
};
