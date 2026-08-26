import type { Json } from "@/types/database";

/** Global, per-page design settings stored in `pages.design`. */
export interface PageDesign {
  themeKey?: string;
  background?: string;
  gradient?: string;
  backgroundImage?: string;
  overlay?: number;
  textColor?: string;
  headingColor?: string;
  linkColor?: string;
  buttonBg?: string;
  buttonText?: string;
  buttonRadius?: number;
  buttonShadow?: boolean;
  cardBg?: string;
  cardBorder?: string;
  cardRadius?: number;
  padding?: number;
  spacing?: number;
  contentWidth?: number;
  headerAlign?: "left" | "center";
  animation?: "none" | "fade" | "rise";
  font?: string;
}

/** Shape of a theme's `config` column. */
export interface ThemeConfig {
  background: string;
  text: string;
  heading: string;
  link: string;
  button_bg: string;
  button_text: string;
  button_radius: number;
  card_bg: string;
  card_border: string;
  card_radius: number;
  font: string;
  spacing: number;
  content_width: number;
}

export const FALLBACK_THEME: ThemeConfig = {
  background: "#FFFFFF",
  text: "#30343A",
  heading: "#171717",
  link: "#4677C8",
  button_bg: "#171717",
  button_text: "#FFFFFF",
  button_radius: 10,
  card_bg: "#FFFFFF",
  card_border: "#E1E4E7",
  card_radius: 14,
  font: "inter",
  spacing: 14,
  content_width: 420,
};

function asThemeConfig(config: Json | null | undefined): ThemeConfig {
  if (!config || typeof config !== "object" || Array.isArray(config)) {
    return FALLBACK_THEME;
  }
  return { ...FALLBACK_THEME, ...(config as Partial<ThemeConfig>) };
}

export interface ResolvedDesign {
  vars: Record<string, string>;
  contentWidth: number;
  spacing: number;
  backgroundStyle: React.CSSProperties;
}

/**
 * Merge a theme config with per-page overrides into CSS custom properties.
 * The renderer sets these on the page container; blocks consume them.
 */
export function resolveDesign(
  themeConfig: Json | null | undefined,
  design: PageDesign | null | undefined,
): ResolvedDesign {
  const t = asThemeConfig(themeConfig);
  const d = design ?? {};

  const background = d.background ?? t.background;
  const contentWidth = d.contentWidth ?? t.content_width;
  const spacing = d.spacing ?? t.spacing;

  const vars: Record<string, string> = {
    "--page-bg": background,
    "--page-text": d.textColor ?? t.text,
    "--page-heading": d.headingColor ?? t.heading,
    "--page-link": d.linkColor ?? t.link,
    "--btn-bg": d.buttonBg ?? t.button_bg,
    "--btn-text": d.buttonText ?? t.button_text,
    "--btn-radius": `${d.buttonRadius ?? t.button_radius}px`,
    "--btn-shadow": d.buttonShadow ? "0 6px 20px rgba(0,0,0,0.15)" : "none",
    "--card-bg": d.cardBg ?? t.card_bg,
    "--card-border": d.cardBorder ?? t.card_border,
    "--card-radius": `${d.cardRadius ?? t.card_radius}px`,
    "--block-gap": `${spacing}px`,
  };

  const backgroundStyle: React.CSSProperties = {
    background: d.gradient ?? background,
  };
  if (d.backgroundImage) {
    backgroundStyle.backgroundImage = `url(${d.backgroundImage})`;
    backgroundStyle.backgroundSize = "cover";
    backgroundStyle.backgroundPosition = "center";
  }

  return { vars, contentWidth, spacing, backgroundStyle };
}
