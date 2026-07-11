const FALLBACK_BRAND = {
  primary: "#011A47",
  secondary: "#1BAAC0",
  dark: "#001235",
  darker: "#000A1F",
  white: "#ffffff",
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHex(r, g, b) {
  const toHex = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex) {
  const normalized = (hex || "").replace("#", "").trim();
  if (normalized.length !== 6) return null;
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) return null;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta > 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  return { h, s, l };
}

function hslToRgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (h < 60) [r1, g1, b1] = [c, x, 0];
  else if (h < 120) [r1, g1, b1] = [x, c, 0];
  else if (h < 180) [r1, g1, b1] = [0, c, x];
  else if (h < 240) [r1, g1, b1] = [0, x, c];
  else if (h < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];

  return {
    r: (r1 + m) * 255,
    g: (g1 + m) * 255,
    b: (b1 + m) * 255,
  };
}

function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

/** Build a usable admin palette from any source color. */
export function buildBrandPalette(sourceHex, fallback = FALLBACK_BRAND) {
  const hsl = hexToHsl(sourceHex);
  if (!hsl) {
    return {
      primary: fallback.primary,
      secondary: fallback.secondary,
      dark: fallback.dark,
      darker: fallback.darker,
      white: fallback.white,
    };
  }

  const hue = hsl.h;
  const saturation = clamp(Math.max(hsl.s, 0.42), 0.42, 0.82);
  const primary = hslToHex(hue, saturation, 0.5);
  const secondary = hslToHex(hue, clamp(saturation - 0.08, 0.35, 0.75), 0.64);
  const dark = hslToHex(hue, clamp(saturation + 0.04, 0.45, 0.85), 0.36);
  const darker = hslToHex(hue, clamp(saturation + 0.08, 0.5, 0.9), 0.24);

  return {
    primary,
    secondary,
    dark,
    darker,
    white: fallback.white,
  };
}

export function normalizeBrandPalette(input = {}, fallback = FALLBACK_BRAND) {
  const hasCustomColors = Boolean(
    input.primary || input.secondary || input.dark || input.darker
  );

  if (!hasCustomColors) {
    return {
      logo: input.logo ?? null,
      primary: fallback.primary,
      secondary: fallback.secondary,
      dark: fallback.dark,
      darker: fallback.darker,
      white: fallback.white,
    };
  }

  const source = input.primary || input.secondary || fallback.primary;
  const palette = buildBrandPalette(source, fallback);

  return {
    logo: input.logo ?? null,
    primary: input.primary || palette.primary,
    secondary: input.secondary || palette.secondary,
    dark: input.dark || palette.dark,
    darker: input.darker || palette.darker,
    white: fallback.white,
  };
}

export function brandFromTheme(theme) {
  return {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    dark: theme.palette.primary.dark,
  };
}

export function applyBrandCssVars(colors = FALLBACK_BRAND) {
  const root = document.documentElement;
  const entries = {
    "--brand-primary": colors.primary,
    "--brand-secondary": colors.secondary,
    "--brand-dark": colors.dark,
    "--brand-darker": colors.darker,
    "--brand-white": colors.white || FALLBACK_BRAND.white,
  };

  Object.entries(entries).forEach(([key, value]) => {
    if (value) root.style.setProperty(key, value);
  });

  const primaryRgb = hexToRgb(colors.primary || FALLBACK_BRAND.primary);
  const secondaryRgb = hexToRgb(colors.secondary || FALLBACK_BRAND.secondary);
  if (primaryRgb) {
    root.style.setProperty("--brand-primary-rgb", `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
  }
  if (secondaryRgb) {
    root.style.setProperty("--brand-secondary-rgb", `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
  }
}
