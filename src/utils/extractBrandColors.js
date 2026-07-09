import { buildBrandPalette } from "@/utils/brandPalette";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHex(r, g, b) {
  const toHex = (n) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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

function colorDistance(a, b) {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
}

function isNeutralPixel(r, g, b, a) {
  if (a < 128) return true;
  const { s, l } = rgbToHsl(r, g, b);
  if (s < 0.12) return true;
  if (l > 0.94 || l < 0.08) return true;
  return false;
}

function pixelScore(r, g, b) {
  const { s, l } = rgbToHsl(r, g, b);
  const saturationWeight = clamp(s, 0.15, 1);
  const lightnessWeight = 1 - Math.abs(l - 0.48) * 1.35;
  return saturationWeight * clamp(lightnessWeight, 0.2, 1);
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

/** Extract brand palette from an uploaded logo image. */
export async function extractBrandColorsFromFile(file) {
  const img = await loadImageFromFile(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const size = 96;
  canvas.width = size;
  canvas.height = size;
  ctx.drawImage(img, 0, 0, size, size);

  const { data } = ctx.getImageData(0, 0, size, size);
  const buckets = new Map();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    if (isNeutralPixel(r, g, b, a)) continue;

    const weight = pixelScore(r, g, b);
    const key = `${Math.round(r / 16) * 16},${Math.round(g / 16) * 16},${Math.round(b / 16) * 16}`;
    const entry = buckets.get(key) || { score: 0, r: 0, g: 0, b: 0 };
    entry.score += weight;
    entry.r += r * weight;
    entry.g += g * weight;
    entry.b += b * weight;
    buckets.set(key, entry);
  }

  const ranked = [...buckets.values()]
    .map((entry) => {
      const total = entry.score || 1;
      return {
        score: entry.score,
        r: entry.r / total,
        g: entry.g / total,
        b: entry.b / total,
      };
    })
    .sort((a, b) => b.score - a.score);

  if (!ranked.length) {
    return null;
  }

  const dominant = ranked[0];
  let accent = dominant;

  for (let i = 1; i < ranked.length; i += 1) {
    if (colorDistance(dominant, ranked[i]) > 1600) {
      accent = ranked[i];
      break;
    }
  }

  const source = rgbToHex(dominant.r, dominant.g, dominant.b);
  const palette = buildBrandPalette(source);

  if (accent !== dominant) {
    palette.secondary = buildBrandPalette(
      rgbToHex(accent.r, accent.g, accent.b)
    ).primary;
  }

  return palette;
}
