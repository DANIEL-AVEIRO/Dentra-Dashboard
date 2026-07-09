import { normalizeBrandPalette } from "@/utils/brandPalette";

/** Brand — values synced from project.frame.env */
export const BRAND_LOGO = "/logo.png";
export const BRAND_PRIMARY = "#EC0D13";
export const BRAND_SECONDARY = "#FF3535";
export const BRAND_DARK = "#B8090E";
export const BRAND_DARKER = "#7A0508";
export const BRAND_WHITE = "#ffffff";
export const APP_TITLE = "dentra";

export const DEFAULT_BRAND = {
  logo: null,
  logoFallback: BRAND_LOGO,
  primary: BRAND_PRIMARY,
  secondary: BRAND_SECONDARY,
  dark: BRAND_DARK,
  darker: BRAND_DARKER,
  white: BRAND_WHITE,
};

export function normalizeBrandPayload(data = {}) {
  return normalizeBrandPalette(
    {
      logo: data.logo || null,
      primary: data.primary,
      secondary: data.secondary,
      dark: data.dark,
      darker: data.darker,
    },
    DEFAULT_BRAND
  );
}
