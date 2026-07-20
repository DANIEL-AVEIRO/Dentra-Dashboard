import { normalizeBrandPalette } from "@/utils/brandPalette";

/** Brand constants */
export const BRAND_LOGO = "/logo.png";
export const BRAND_PRIMARY = "#011A47";
export const BRAND_SECONDARY = "#1BAAC0";
export const BRAND_DARK = "#001235";
export const BRAND_DARKER = "#000A1F";
export const BRAND_WHITE = "#ffffff";
export const APP_TITLE = "Dentra";

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
