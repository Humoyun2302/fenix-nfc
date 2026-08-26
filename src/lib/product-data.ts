import type { BlockType, PageDesign, ThemePreset } from "@/types/product";

export const defaultDesign: PageDesign = {
  theme: "minimal-light",
  backgroundColor: "#F7F7F5",
  textColor: "#30343A",
  headingColor: "#171717",
  linkColor: "#30343A",
  buttonBackground: "#D6A84B",
  buttonText: "#171717",
  buttonRadius: 12,
  cardBackground: "#FFFFFF",
  cardBorder: "#E1E4E7",
  cardRadius: 14,
  pagePadding: 18,
  blockSpacing: 12,
  contentWidth: 390,
  headerAlignment: "center",
};

const themeRows = [
  ["minimal-light", "Minimal Light", "#F7F7F5", "#171717", "#D6A84B"],
  ["minimal-dark", "Minimal Dark", "#202225", "#FFFFFF", "#D6A84B"],
  ["luxury-black-gold", "Luxury Black and Gold", "#151515", "#F6F1E8", "#D6A84B"],
  ["clean-business", "Clean Business", "#F4F5F6", "#30343A", "#4677C8"],
  ["professional-blue", "Professional Blue", "#EEF4FA", "#1C2B3A", "#4677C8"],
  ["modern-restaurant", "Modern Restaurant", "#FFF8F0", "#302821", "#C77B3A"],
  ["traditional-restaurant", "Traditional Restaurant", "#F6F0E8", "#2C2721", "#95613B"],
  ["warm-cafe", "Warm Cafe", "#FAF2E6", "#362A22", "#B97943"],
  ["premium-hotel", "Premium Hotel", "#F4F1EA", "#252321", "#B79A5F"],
  ["medical-clean", "Medical Clean", "#F2FAF8", "#1F3B3A", "#3D9B68"],
  ["beauty", "Beauty", "#FFF3F7", "#3A2630", "#C75C8A"],
  ["personal-brand", "Personal Brand", "#F7F6FF", "#252134", "#6E61A8"],
  ["technology", "Technology", "#EEF7FA", "#16292E", "#2F96A3"],
  ["event", "Event", "#FFF7EA", "#302B25", "#D99A2B"],
  ["digital-business-card", "Digital Business Card", "#F4F5F6", "#30343A", "#2D3034"],
  ["portfolio", "Portfolio", "#F7F7F7", "#202020", "#60646B"],
  ["soft-pastel", "Soft Pastel", "#F8F5F2", "#34312F", "#CFA8A0"],
  ["bold-creator", "Bold Creator", "#FCFAF2", "#1F1F1F", "#D9534F"],
] as const;

export const themePresets: ThemePreset[] = themeRows.map(([id, name, backgroundColor, headingColor, buttonBackground]) => ({
  id,
  name,
  description: `${name} page style`,
  design: {
    ...defaultDesign,
    theme: id,
    backgroundColor,
    headingColor,
    buttonBackground,
    linkColor: buttonBackground,
  },
}));

export const blockCatalog: Array<{
  type: BlockType;
  name: string;
  category: string;
  description: string;
  premium?: boolean;
}> = [
  { type: "heading", name: "Heading", category: "Basic", description: "Section title or main statement." },
  { type: "text", name: "Text", category: "Basic", description: "Rich body copy for details." },
  { type: "link", name: "Link", category: "Basic", description: "Trackable link row." },
  { type: "button", name: "Button", category: "Basic", description: "Primary call to action." },
  { type: "multi_links", name: "Multiple links", category: "Basic", description: "Compact list of destinations." },
  { type: "divider", name: "Divider", category: "Basic", description: "Separate page sections." },
  { type: "spacer", name: "Spacer", category: "Basic", description: "Fine tune vertical rhythm." },
  { type: "icon_text", name: "Icon and text", category: "Basic", description: "Small visual note." },
  { type: "profile_header", name: "Profile header", category: "Profile", description: "Avatar, name, and subtitle." },
  { type: "contact_details", name: "Contact details", category: "Profile", description: "Phone, email, address, hours." },
  { type: "social_networks", name: "Social networks", category: "Profile", description: "Social and messenger buttons." },
  { type: "image", name: "Image", category: "Media", description: "Single image with alt text." },
  { type: "gallery", name: "Image gallery", category: "Media", description: "Responsive image collection." },
  { type: "youtube", name: "YouTube", category: "Media", description: "Embedded YouTube video." },
  { type: "services", name: "Services", category: "Business", description: "Offer list with prices." },
  { type: "product_grid", name: "Product grid", category: "Business", description: "Sell or showcase products." },
  { type: "restaurant_menu", name: "Restaurant menu", category: "Business", description: "Menu categories and dishes." },
  { type: "faq", name: "FAQ", category: "Business", description: "Expandable answers." },
  { type: "reviews", name: "Reviews", category: "Business", description: "Trust-building testimonials." },
  { type: "form", name: "Form", category: "Conversion", description: "Collect leads securely." },
  { type: "cta", name: "Call-to-action", category: "Conversion", description: "Conversion section with analytics." },
  { type: "appointment", name: "Appointment request", category: "Conversion", description: "Booking request form.", premium: true },
  { type: "html", name: "HTML block", category: "Advanced", description: "Sanitized custom markup.", premium: true },
  { type: "embed", name: "Embed", category: "Advanced", description: "External widgets and maps.", premium: true },
];

export function defaultBlockContent(type: BlockType) {
  switch (type) {
    case "heading":
      return { text: "New section" };
    case "text":
      return { text: "Add a short, useful description." };
    case "link":
    case "button":
      return { label: "Open link", url: "https://example.com" };
    case "profile_header":
      return { name: "Fenix customer", subtitle: "Digital business card", avatarUrl: "" };
    case "contact_details":
      return { phone: "+998", email: "hello@example.com", address: "Tashkent" };
    case "image":
      return { src: "", alt: "Page image" };
    case "form":
      return {
        title: "Contact us",
        fields: [
          { id: "name", label: "Name", type: "text", required: true },
          { id: "phone", label: "Phone", type: "phone", required: true },
        ],
      };
    default:
      return { title: blockCatalog.find((block) => block.type === type)?.name ?? "Block" };
  }
}
